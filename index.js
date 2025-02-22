const { OpenAI } = require('openai');
const MarkdownIt = require('markdown-it');
const htmlToText = require('html-to-text');

// 获取纯文本内容
function getPlainTextContent(content) {
    const md = new MarkdownIt();
    const html = md.render(content);
    const plainText = htmlToText.fromString(html, { wordwrap: false });
    const maxLength = 4000; // GPT 输入限制
    return plainText.length > maxLength ? plainText.substring(0, maxLength) : plainText;
}

// 使用 GPT 生成分类和标签
async function generateTagsWithGPT(content, client, config) {
    const prompt = `
    Analyze the following article content and generate:
    1. A single category (a broad topic the article belongs to).
    2. A list of 2-5 specific tags (keywords or phrases describing the article).
    Return the result in JSON format like this:
    {
      "category": "category_name",
      "tags": ["tag1", "tag2", "tag3"]
    }
    
    Content:
    ${content}
  `;

    const response = await client.chat.completions.create({
        model: config.model,
        messages: [
            { role: 'system', content: 'You are a helpful assistant that generates categories and tags for articles.' },
            { role: 'user', content: prompt },
        ],
        max_tokens: config.max_tokens || 100,
        temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content.trim());
    return result;
}

// 主插件逻辑
module.exports = (hexo) => {
    // 初始化 OpenAI 客户端
    const config = hexo.config.llm_tagging;
    if (!config || !config.api_key || !config.model) {
        throw new Error('llm_tagging config is incomplete');
    }

    const client = new OpenAI({
        apiKey: config.api_key,
        baseURL: config.endpoint || 'https://api.openai.com/v1', // 默认使用 OpenAI 端点
    });

    hexo.extend.filter.register('post_process', async (post) => {
        const plainText = getPlainTextContent(post.content);
        if (!plainText) {
            hexo.log.warn(`No content found for post: ${post.title}`);
            return post;
        }

        try {
            hexo.log.info(`Tagging post: ${post.title}`);
            const { category, tags } = await generateTagsWithGPT(plainText, client, config);

            // 更新前置元数据
            post.front_matter.category = category;
            if (post.front_matter.tags) {
                post.front_matter.tags = Array.from(new Set(post.front_matter.tags.concat(tags)));
            } else {
                post.front_matter.tags = tags;
            }
        } catch (error) {
            hexo.log.error(`Failed to tag post ${post.title}: ${error.message}`);
        }

        return post;
    });
};