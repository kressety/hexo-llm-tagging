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

Add the following configuration to your Hexo `_config.yml` file:

```yaml
llm_tagging:
  api_key: your_openai_api_key  # Your OpenAI API key or API key for compatible service
  model: gpt-3.5-turbo        # The model name you want to use (e.g., gpt-3.5-turbo, gpt-4, etc.)
  endpoint: https://api.openai.com/v1 # The API endpoint. For OpenAI, it's https://api.openai.com/v1. For compatible services, use their endpoint.
```

**Configuration Options:**

- `api_key`: **Required.** Your API key for accessing the LLM service.
- `model`: **Required.** The name of the LLM model you want to use.
- `endpoint`: **Required.** The API endpoint of the LLM service. For OpenAI's official API, use `https://api.openai.com/v1`. For other compatible services, refer to their documentation for the correct endpoint.

**Example `_config.yml`:**

```yaml
# ... other Hexo configurations

llm_tagging:
  api_key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  model: gpt-3.5-turbo
  endpoint: https://api.openai.com/v1

# ... other Hexo configurations
```

## Usage

1. **Install the plugin:** `npm install hexo-llm-tagging`
2. **Configure the plugin:** Add the `llm_tagging` section to your Hexo `_config.yml` file with your API key, model name, and endpoint.
3. **Write your Hexo posts as usual.** When you generate your Hexo site (`hexo generate`), the plugin will automatically call the LLM API for each post and add suggested categories and tags to the post's front-matter.

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