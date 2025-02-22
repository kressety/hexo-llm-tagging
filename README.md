# Hexo LLM Tagging Plugin

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Hexo](https://img.shields.io/badge/hexo-%3E%3D%207.3.0-brightgreen.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D%2022.x-blue.svg)

A Hexo plugin that uses OpenAI's LLM (Large Language Model) to automatically generate categories and tags for your blog posts based on their content.

## Features

- **Automatic Tagging**: Analyzes post content using OpenAI's API to generate a single category and 2-5 relevant tags.
- **Seamless Integration**: Works with Hexo's `before_post_render` filter to update `front-matter` without altering post content.
- **Configurable**: Supports custom OpenAI models, API keys, and endpoints via Hexo configuration.
- **Debugging Support**: Detailed logging for troubleshooting and verification.

## Installation

1. **Install the Plugin**:
   Run the following command in your Hexo project directory:
   ```bash
   npm install hexo-llm-tagging --save
   ```

2. **Install Dependencies**:
   Ensure the required dependencies are installed:
   ```bash
   npm install openai markdown-it html-to-text hexo-front-matter hexo-fs
   ```

## Configuration

Add the following configuration to your Hexo `_config.yml` file:

```yaml
llm_tagging:
  api_key: "your-openai-api-key"
  model: "gpt-3.5-turbo" # or any other supported model
  endpoint: "https://api.openai.com/v1" # optional, defaults to OpenAI's API
  max_tokens: 100 # optional, defaults to 100
```

- `api_key`: Your OpenAI API key (required).
- `model`: The OpenAI model to use (required).
- `endpoint`: Custom API endpoint (optional).
- `max_tokens`: Maximum tokens for the API response (optional).

## Usage

1. **Write Your Posts**:
   Create or edit Markdown files in the `_posts` directory as usual. The plugin will process them automatically.

2. **Generate Site**:
   Run Hexo generation to tag your posts:
   ```bash
   hexo generate --debug
   ```
   Use `--debug` to see detailed logs of the tagging process.

3. **Check Results**:
    - The plugin updates the `categories` and `tags` in the `front-matter` of each post.
    - Example before:
      ```
      ---
      title: Better MC 个人汉化
      date: 2023-12-12 19:55:38
      ---
      ![](images/Better-MC-个人汉化/1.png)
      ## 整合包介绍
      ...
      ```
    - Example after:
      ```
      ---
      title: Better MC 个人汉化
      categories:
        - 游戏模组
      tags:
        - Minecraft
        - 汉化
        - Better MC
        - 模组整合包
        - Forge
      date: 2023-12-12 19:55:38
      ---
      ![](images/Better-MC-个人汉化/1.png)
      ## 整合包介绍
      ...
      ```

## How It Works

- **Content Analysis**: The plugin extracts plain text from your Markdown content using `markdown-it` and `html-to-text`.
- **LLM Processing**: Sends the title and content to OpenAI's API, requesting a single category and 2-5 tags in JSON format.
- **Front-matter Update**: Updates the `front-matter` with the generated `categories` and `tags`, preserving the original post content.
- **Rendering Sync**: Ensures the updated metadata is reflected in Hexo's rendering process.

## Logging

- **Info**: Logs when a post is processed and tagged successfully.
- **Debug**: Provides detailed output, including `front-matter` updates and rendering states.
- **Error**: Reports issues like API failures or configuration errors.

Example debug output:
```
INFO  Processing post: Better MC 个人汉化
INFO  Tagged post: Better MC 个人汉化 - Category: 游戏模组, Tags: Minecraft, 汉化, Better MC, 模组整合包, Forge
DEBUG Before render - Title: Better MC 个人汉化, Categories: ["游戏模组"], Tags: ["Minecraft", "汉化", "Better MC", "模组整合包", "Forge"]
```

## Troubleshooting

- **API Errors**: Ensure your `api_key` is valid and you have network access to the OpenAI endpoint.
- **Missing Tags**: Check if `max_tokens` is sufficient for the API response.
- **Content Not Tagged**: Verify that the post is in the `_posts` directory and contains readable content.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Hexo](https://hexo.io/), [OpenAI](https://openai.com/), and various Node.js libraries.
- Inspired by the need for automated metadata generation in blogging workflows.