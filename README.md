# hexo-llm-tagging

`hexo-llm-tagging` is a Hexo plugin that automatically generates tags and categories for your blog posts using any OpenAI-compatible language model. The model, API endpoint, and API key are configurable, making the plugin flexible for different use cases.

## Features

- Automatically generates tags and categories for Hexo blog posts.
- Uses OpenAI-compatible language models like GPT-3, GPT-4, or other models that support the OpenAI API.
- Configuration options for API endpoint, model name, and API key.
- Seamlessly integrates with Hexo's post rendering system.

## Installation

1. Install the plugin via npm in your Hexo project:

   ```bash
   npm install hexo-llm-tagging --save
   ```

2. After installation, configure the plugin in your Hexo project's `_config.yml`.

## Configuration

In your `_config.yml`, add the following configuration for `hexo-llm-tagging`:

```yaml
hexo-llm-tagging:
  endpoint: "https://api.openai.com/v1"  # OpenAI API endpoint (default is https://api.openai.com/v1)
  modelName: "gpt-4"                    # The model name to use (default is "gpt-4")
  apiKey: "your_api_key_here"            # Your OpenAI API key
```

- `endpoint`: The API endpoint of the OpenAI-compatible model. Default is `https://api.openai.com/v1`.
- `modelName`: The name of the model you want to use. By default, it uses `gpt-4`, but you can configure it to use other models like `gpt-3.5` or any other OpenAI-compatible model.
- `apiKey`: Your API key to authenticate the requests. This is required to use the plugin.

## Usage

Once configured, the plugin will automatically generate tags and categories for each blog post. This happens after Hexo renders the posts.

1. The plugin sends the content of each post to the specified model.
2. The model will return suggested tags and categories.
3. The tags and categories will be applied to the post before publishing.

## Example

Here is an example of how a blog post might look after the plugin runs:

- Post content:
  ```
  This is a blog post about machine learning and artificial intelligence. It explores recent advancements in the field and how they are transforming industries.
  ```

- Generated tags: `["machine learning", "artificial intelligence", "technology"]`
- Generated categories: `["AI", "Technology"]`

## License

MIT License. See the [LICENSE](LICENSE) file for more details.