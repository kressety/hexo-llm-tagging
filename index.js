const { OpenAI } = require('openai');
const MarkdownIt = require('markdown-it');
const htmlToText = require('html-to-text');
const front = require('hexo-front-matter');
const fs = require('hexo-fs');

// 获取纯文本内容
function getPlainTextContent(content, title) {
    const md = new MarkdownIt();
    const html = md.render(content);
    const plainText = htmlToText.convert(html, { wordwrap: false });
    const maxLength = 4000;
    const text = `${title}: ${plainText}`; // 添加标题
    return text.length > maxLength ? text.substring(0, maxLength) : text;
}

// 使用 GPT 生成分类和标签
async function generateTagsWithGPT(content, client, config, hexo) {
    const prompt = `
    Analyze the following article content and generate:
    1. A single category (a broad topic the article belongs to).
    2. A list of 2-5 specific tags (keywords or phrases describing the article).
    Return the result in JSON format like this:
    {
      "category": "category_name",
      "tags": ["tag1", "tag2", "tag3"]
    }
    Do not include code block markers (e.g., \`\`\`json or \`\`\`) in your response.
    
    Content:
    ${content}
  `;

    try {
        const response = await client.chat.completions.create({
            model: config.model,
            messages: [
                { role: 'system', content: 'You are a helpful assistant that generates categories and tags for articles.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: config.max_tokens || 100,
            temperature: 0.7,
        });

        let rawResponse = response.choices[0].message.content.trim();
        rawResponse = rawResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');

        const result = JSON.parse(rawResponse);
        return result;
    } catch (error) {
        hexo.log.error(`GPT API call failed: ${error.message}`);
        hexo.log.debug(`Raw GPT response: ${response?.choices[0]?.message?.content || 'No response'}`);
        throw error;
    }
}

// 主插件逻辑
const config = hexo.config.llm_tagging;
if (!config || !config.api_key || !config.model) {
    hexo.log.error('llm_tagging config is incomplete. Required: api_key, model');
    return;
}

const client = new OpenAI({
    apiKey: config.api_key,
    baseURL: config.endpoint || 'https://api.openai.com/v1',
});

hexo.log.info('hexo-llm-tagging plugin initialized');

hexo.extend.filter.register('before_post_render', async (data) => {
    // 只处理 _posts 目录下的文章
    if (!data.source || !data.source.startsWith('_posts/')) {
        hexo.log.debug(`Skipping non-post page: ${data.title || data.source}`);
        return data;
    }

    hexo.log.info(`Processing post: ${data.title || data.source}`);

    const plainText = getPlainTextContent(data.content, data.title);
    if (!plainText) {
        hexo.log.warn(`No content found for post: ${data.title || data.source}`);
        return data;
    }

    try {
        const { category, tags } = await generateTagsWithGPT(plainText, client, config, hexo);

        // 解析当前 front-matter
        const frontmatter = front.parse(data.raw);

        // 更新 category 和 tags
        frontmatter.category = category;
        // 如果已有 tags，合并，否则直接赋值
        const existingTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
        frontmatter.tags = Array.from(new Set([...existingTags, ...tags]));

        // 生成新的 front-matter 字符串
        let newFrontmatter = front.stringify(frontmatter);
        newFrontmatter = '---\n' + newFrontmatter;

        // 更新 data 对象以影响渲染
        data.category = category;
        data.tags = frontmatter.tags;

        // 可选：写入源文件（如果需要持久化）
        await fs.writeFile(data.full_source, newFrontmatter + '\n' + data.content, 'utf-8');
        hexo.log.info(`Updated file: ${data.full_source}`);

        hexo.log.info(`Tagged post: ${data.title || data.source} - Category: ${category}, Tags: ${tags.join(', ')}`);
    } catch (error) {
        hexo.log.error(`Failed to tag post ${data.title || data.source}: ${error.message}`);
    }

    return data;
});