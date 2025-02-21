const { OpenAI } = require('openai');

console.log('hexo-llm-tagging: Plugin started!');

module.exports = function(hexo) {
    hexo.extend.filter.register('before_post_render', (data) => {
        const post = data;

        console.log('hexo-llm-tagging: Accessing hexo.config...');
        const hexoConfig = hexo.config;
        console.log('hexo-llm-tagging: hexo.config accessed:', hexoConfig); // 打印完整的 hexo.config 对象!

        if (hexoConfig) { // 检查 hexoConfig 是否为真值 (非 null 或 undefined)
            console.log('hexo-llm-tagging: hexo.config is truthy. Now accessing hexo.config[\'llm-tagging\']...');
            const config = hexo.config['llm-tagging']; // 使用方括号和连字符键名 (与 _config.yml 一致)
            console.log('hexo-llm-tagging: hexo.config[\'llm-tagging\'] accessed:', config);
            console.log('hexo-llm-tagging: Configuration loaded:', config);

            if (!config || !config.api_key || !config.model || !config.endpoint) {
                hexo.log.warn('hexo-llm-tagging: Plugin is not configured correctly. Please check your _config.yml.');
                return data;
            }

            // 示例： 使用配置项 (目前没有实际的 LLM API 调用)
            const apiKey = config.api_key;
            const modelName = config.model;
            const apiEndpoint = config.endpoint;

            console.log('hexo-llm-tagging: API Key:', apiKey ? 'Configured' : 'Not Configured'); // 仅指示是否配置
            console.log('hexo-llm-tagging: Model Name:', modelName);
            console.log('hexo-llm-tagging: API Endpoint:', apiEndpoint);


            // 原始的 prompt 和 tag 生成逻辑 (目前被注释掉)
            /*
            const openai = new OpenAI({
                apiKey: config.api_key,
                baseURL: config.endpoint // 确保使用配置的 endpoint
            });

            async function generateTags(text) {
                try {
                    const completion = await openai.chat.completions.create({
                        model: config.model,
                        messages: [{"role": "user", "content": `请提取以下文章的关键词，用逗号分隔，关键词数量不超过5个:\n\n${text}`}],
                    });
                    return completion.choices[0].message.content.trim().split(',').map(tag => tag.trim());
                } catch (error) {
                    console.error('Error calling OpenAI API:', error);
                    return []; // 发生错误时返回空数组，避免影响文章生成
                }
            }


            if (config.tagging_enable !== false) { // 显式检查是否不为 false，默认启用
                return generateTags(post.content).then(tags => {
                    console.log('hexo-llm-tagging: Generated tags:', tags); // 打印生成的标签
                    post.tags = post.tags.concat(tags); // 将生成的标签添加到文章的 tags 中
                    return data;
                }).catch(error => {
                    console.error('hexo-llm-tagging: Error in tag generation process:', error); // 捕获 Promise 链中的错误
                    return data; // 即使发生错误也继续文章生成
                });
            }
            */


        } else {
            console.log('hexo-llm-tagging: hexo.config is falsy (null or undefined)!  Something is seriously wrong with Hexo config loading.');
        }

        return data; // 确保同步函数也返回 data
    });
};
