const { OpenAI } = require('openai');

module.exports = function(hexo) {
    hexo.extend.filter.register('before_post_render', async function(data) {
        const post = data;
        const config = hexo.config.llm_tagging;

        hexo.log.debug('hexo-llm-tagging: Plugin started processing post:', post.title); // 添加 debug 日志：插件开始处理文章

        hexo.log.debug('hexo-llm-tagging: Configuration loaded:', config); // 添加 debug 日志：输出加载的配置

        if (!config || !config.api_key || !config.model || !config.endpoint) {
            hexo.log.warn('hexo-llm-tagging: Plugin is not configured correctly. Please check your _config.yml.');
            return data; // 配置不完整，跳过处理
        }

        if (!post.content) {
            hexo.log.debug(`hexo-llm-tagging: Post "${post.title}" has no content, skipping.`); // 添加 debug 日志：文章没有内容
            return data; // 没有内容，跳过处理
        }

        const openai = new OpenAI({
            apiKey: config.api_key,
            baseURL: config.endpoint,
        });

        const prompt = `请根据以下文章内容，生成 3-5 个最相关的中文标签(tag)和 1-2 个分类(category)。\n\n文章标题: ${post.title}\n\n文章内容:\n${post.content}\n\n请以 JSON 格式返回结果，包含 "categories" 和 "tags" 字段，均为字符串数组。`;

        hexo.log.debug('hexo-llm-tagging: Prompt being sent to LLM:', prompt); // 添加 debug 日志：输出发送给 LLM 的 Prompt

        try {
            hexo.log.debug(`hexo-llm-tagging: Sending request to LLM for post "${post.title}".`);
            const response = await openai.chat.completions.create({
                model: config.model,
                messages: [{ role: 'user', content: prompt }],
            });

            const responseContent = response.choices[0].message.content;
            hexo.log.debug(`hexo-llm-tagging: LLM raw response for post "${post.title}": ${responseContent}`); // 添加 debug 日志：输出 LLM 的原始响应

            let result;
            try {
                result = JSON.parse(responseContent);
                hexo.log.debug(`hexo-llm-tagging: JSON response parsed successfully for post "${post.title}":`, result); // 添加 debug 日志：JSON 解析成功并输出结果
            } catch (e) {
                hexo.log.warn(`hexo-llm-tagging: Failed to parse JSON response from LLM for post "${post.title}". Response was: ${responseContent}`);
                return data; // JSON 解析失败，跳过处理
            }

            if (result && Array.isArray(result.categories) && Array.isArray(result.tags)) {
                post.categories = post.categories || [];
                post.tags = post.tags || [];

                // 添加分类，如果文章 front-matter 中没有分类，则直接赋值，否则合并去重
                if (!post.categories.length) {
                    post.categories = result.categories.filter(cat => cat && typeof cat === 'string');
                } else {
                    const existingCategories = post.categories.map(cat => typeof cat === 'object' ? cat.name : cat);
                    const newCategories = result.categories.filter(cat => cat && typeof cat === 'string' && !existingCategories.includes(cat));
                    post.categories = [...post.categories, ...newCategories];
                }

                // 添加标签，合并去重
                const existingTags = post.tags.map(tag => tag.toLowerCase());
                const newTags = result.tags.filter(tag => tag && typeof tag === 'string' && !existingTags.includes(tag.toLowerCase())).map(tag => tag.trim());
                post.tags = [...post.tags, ...newTags];

                hexo.log.info(`hexo-llm-tagging: Categories and tags generated for post "${post.title}". Categories: ${post.categories.join(', ')}, Tags: ${post.tags.join(', ')}`);
            } else {
                hexo.log.warn(`hexo-llm-tagging: Invalid response format from LLM for post "${post.title}". Expected JSON with "categories" and "tags" arrays.`);
            }

        } catch (error) {
            hexo.log.error(`hexo-llm-tagging: Error processing post "${post.title}":`, error);
            hexo.log.error('hexo-llm-tagging: Full error details:', error); // 添加 debug 日志：输出完整的错误信息
        }

        hexo.log.debug('hexo-llm-tagging: Plugin finished processing post:', post.title); // 添加 debug 日志：插件完成处理文章
        return data;
    });
};
