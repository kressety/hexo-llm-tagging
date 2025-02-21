const { OpenAI } = require('openai');

// Hexo 插件入口
module.exports = function (hexo) {
    // 从 Hexo 配置中读取 hexo-llm-tagging 配置项
    const config = hexo.config['hexo-llm-tagging'] || {};
    const endpoint = config.endpoint || "https://api.openai.com/v1";  // 默认值
    const modelName = config.modelName || "gpt-4";  // 默认值
    const apiKey = config.apiKey;  // 必须提供 API 密钥

    if (!apiKey) {
        throw new Error('API Key is required in _config.yml for hexo-llm-tagging');
    }

    // 创建 OpenAI 实例
    const openai = new OpenAI({
        apiKey: apiKey,
        basePath: endpoint
    });

    // 钩子：文章渲染后生成标签和分类
    hexo.extend.filter.register('after_post_render', async function (post) {
        try {
            const result = await generateTagsAndCategories(post.content, openai, modelName);
            post.tags = result.tags;
            post.categories = result.categories;
        } catch (error) {
            console.error('Failed to generate tags and categories:', error);
        }
        return post;
    });

    // 调用 OpenAI API 来生成标签和分类
    async function generateTagsAndCategories(content, openai, modelName) {
        const prompt = `
    你是一个帮助文章内容生成标签和分类的智能助手。
    请根据下面的文章内容给出适合的标签和分类（以逗号分隔）。

    文章内容：
    ${content}

    请根据文章内容的主题和风格，为其生成标签和分类。
    `;

        try {
            // 使用 OpenAI SDK 调用模型
            const response = await openai.chat.completions.create({
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
                temperature: 0.7,
            });

            const text = response.choices[0].message.content.trim();
            const [categories, tags] = text.split('\n').map(str => str.split(',').map(s => s.trim()));

            return { categories, tags };
        } catch (error) {
            console.error('Error generating tags and categories:', error);
            return { categories: [], tags: [] };  // 如果出错返回空数组
        }
    }
};
