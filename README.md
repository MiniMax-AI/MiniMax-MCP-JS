![export](https://github.com/MiniMax-AI/MiniMax-01/raw/main/figures/MiniMaxLogo-Light.png)

<a href="https://glama.ai/mcp/servers/@MiniMax-AI/MiniMax-MCP-JS">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@MiniMax-AI/MiniMax-MCP-JS/badge" alt="MiniMax JS MCP server" />
</a>

<div align="center">

# MiniMax MCP JS

JavaScript/TypeScript implementation of MiniMax MCP, providing image generation, video generation, text-to-speech, and more.

<div style="line-height: 1.5;">
  <a href="https://www.minimax.io" target="_blank" style="margin: 2px; color: var(--fgColor-default);">
    <img alt="Homepage" src="https://img.shields.io/badge/_Homepage-MiniMax-FF4040?style=flat-square&labelColor=2C3E50&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDkwLjE2IDQxMS43Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjMzLjQ1LDQwLjgxYTE3LjU1LDE3LjU1LDAsMSwwLTM1LjEsMFYzMzEuNTZhNDAuODIsNDAuODIsMCwwLDEtODEuNjMsMFYxNDVhMTcuNTUsMTcuNTUsMCwxLDAtMzUuMDksMHY3OS4wNmE0MC44Miw0MC44MiwwLDAsMS04MS42MywwVjE5NS40MmExMS42MywxMS42MywwLDAsMSwyMy4yNiwwdjI4LjY2YTE3LjU1LDE3LjU1LDAsMCwwLDM1LjEsMFYxNDVBNDAuODIsNDAuODIsMCwwLDEsMTQwLDE0NVYzMzEuNTZhMTcuNTUsMTcuNTUsMCwwLDAsMzUuMSwwVjIxNy41aDBWNDAuODFhNDAuODEsNDAuODEsMCwxLDEsODEuNjIsMFYyODEuNTZhMTEuNjMsMTEuNjMsMCwxLDEtMjMuMjYsMFptMjE1LjksNjMuNEE0MC44Niw0MC44NiwwLDAsMCw0MDguNTMsMTQ1VjMwMC44NWExNy41NSwxNy41NSwwLDAsMS0zNS4wOSwwdi0yNjBhNDAuODIsNDAuODIsMCwwLDAtODEuNjMsMFYzNzAuODlhMTcuNTUsMTcuNTUsMCwwLDEtMzUuMSwwVjMzMGExMS42MywxMS42MywwLDEsMC0yMy4yNiwwdjQwLjg2YTQwLjgxLDQwLjgxLDAsMCwwLDgxLjYyLDBWNDAuODFhMTcuNTUsMTcuNTUsMCwwLDEsMzUuMSwwdjI2MGE0MC44Miw0MC44MiwwLDAsMCw4MS42MywwVjE0NWExNy41NSwxNy41NSwwLDEsMSwzNS4xLDBWMjgxLjU2YTExLjYzLDExLjYzLDAsMCwwLDIzLjI2LDBWMTQ1QTQwLjg1LDQwLjg1LDAsMCwwLDQ0OS4zNSwxMDQuMjFaIi8+PC9zdmc+&logoWidth=20" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://arxiv.org/abs/2501.08313" target="_blank" style="margin: 2px;">
    <img alt="Paper" src="https://img.shields.io/badge/📖_Paper-MiniMax--01-FF4040?style=flat-square&labelColor=2C3E50" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://chat.minimax.io/" target="_blank" style="margin: 2px;">
    <img alt="Chat" src="https://img.shields.io/badge/_MiniMax_Chat-FF4040?style=flat-square&labelColor=2C3E50&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDkwLjE2IDQxMS43Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjMzLjQ1LDQwLjgxYTE3LjU1LDE3LjU1LDAsMSwwLTM1LjEsMFYzMzEuNTZhNDAuODIsNDAuODIsMCwwLDEtODEuNjMsMFYxNDVhMTcuNTUsMTcuNTUsMCwxLDAtMzUuMDksMHY3OS4wNmE0MC44Miw0MC44MiwwLDAsMS04MS42MywwVjE5NS40MmExMS42MywxMS42MywwLDAsMSwyMy4yNiwwdjI4LjY2YTE3LjU1LDE3LjU1LDAsMCwwLDM1LjEsMFYxNDVBNDAuODIsNDAuODIsMCwwLDEsMTQwLDE0NVYzMzEuNTZhMTcuNTUsMTcuNTUsMCwwLDAsMzUuMSwwVjIxNy41aDBWNDAuODFhNDAuODEsNDAuODEsMCwxLDEsODEuNjIsMFYyODEuNTZhMTEuNjMsMTEuNjMsMCwxLDEtMjMuMjYsMFptMjE1LjksNjMuNEE0MC44Niw0MC44NiwwLDAsMCw0MDguNTMsMTQ1VjMwMC44NWExNy41NSwxNy41NSwwLDAsMS0zNS4wOSwwdi0yNjBhNDAuODIsNDAuODIsMCwwLDAtODEuNjMsMFYzNzAuODlhMTcuNTUsMTcuNTUsMCwwLDEtMzUuMSwwVjMzMGExMS42MywxMS42MywwLDEsMC0yMy4yNiwwdjQwLjg2YTQwLjgxLDQwLjgxLDAsMCwwLDgxLjYyLDBWNDAuODFhMTcuNTUsMTcuNTUsMCwwLDEsMzUuMSwwdjI2MGE0MC44Miw0MC44MiwwLDAsMCw4MS42MywwVjE0NWExNy41NSwxNy41NSwwLDEsMSwzNS4xLDBWMjgxLjU2YTExLjYzLDExLjYzLDAsMCwwLDIzLjI2LDBWMTQ1QTQwLjg1LDQwLjg1LDAsMCwwLDQ0OS4zNSwxMDQuMjFaIi8+PC9zdmc+&logoWidth=20" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://www.minimax.io/platform" style="margin: 2px;">
    <img alt="API" src="https://img.shields.io/badge/⚡_API-Platform-FF4040?style=flat-square&labelColor=2C3E50" style="display: inline-block; vertical-align: middle;"/>
  </a>
</div>

<div style="line-height: 1.5;">
  <a href="https://huggingface.co/MiniMaxAI" target="_blank" style="margin: 2px;">
    <img alt="Hugging Face" src="https://img.shields.io/badge/🤗_Hugging_Face-MiniMax-FF4040?style=flat-square&labelColor=2C3E50" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://github.com/MiniMax-AI/MiniMax-01/blob/main/figures/wechat-qrcode.jpeg" target="_blank" style="margin: 2px;">
    <img alt="WeChat" src="https://img.shields.io/badge/_WeChat-MiniMax-FF4040?style=flat-square&labelColor=2C3E50" style="display: inline-block; vertical-align: middle;"/>
  </a>
  <a href="https://www.modelscope.cn/organization/MiniMax" target="_blank" style="margin: 2px;">
    <img alt="ModelScope" src="https://img.shields.io/badge/_ModelScope-MiniMax-FF4040?style=flat-square&labelColor=2C3E50" style="display: inline-block; vertical-align: middle;"/>
  </a>
</div>

<div style="line-height: 1.5;">
  <a href="https://github.com/MiniMax-AI/MiniMax-MCP-JS/blob/main/LICENSE" style="margin: 2px;">
    <img alt="Code License" src="https://img.shields.io/badge/_Code_License-MIT-FF4040?style=flat-square&labelColor=2C3E50" style="display: inline-block; vertical-align: middle;"/>
  </a>
</div>

</div>

## Documentation

- [中文文档](README.zh-CN.md)
- [Python Version](https://github.com/MiniMax-AI/MiniMax-MCP) - Official Python implementation of MiniMax MCP

## Features

- Text-to-Speech (TTS)
- Image Generation
- Video Generation
- Voice Cloning
- Dynamic configuration (supports both environment variables and request parameters)
- Compatible with MCP platform hosting (ModelScope and other MCP platforms)

## Installation

```bash
# Install with pnpm (recommended)
pnpm add minimax-mcp-js
```

## Quick Start

MiniMax MCP JS implements the [Model Context Protocol (MCP)](https://github.com/anthropics/model-context-protocol) specification and can be used as a server to interact with MCP-compatible clients (such as Claude AI).

### Quickstart with MCP Client

1. Get your API key from [MiniMax International Platform](https://www.minimax.io/platform/user-center/basic-information/interface-key).
2. Install [minimax-mcp-js](https://www.npmjs.com/package/minimax-mcp-js) using pnpm: `pnpm add minimax-mcp-js`

### Using with MCP Clients (Recommended)

1. Install the CLI tool globally:
```bash
# Install globally
pnpm install -g minimax-mcp-js
```

2. Configure your MCP client:

#### Claude Desktop

Go to `Claude > Settings > Developer > Edit Config > claude_desktop_config.json` to include:

```json
{
  "mcpServers": {
    "minimax-mcp-js": {
      "command": "npx",
      "args": [
        "minimax-mcp-js"
      ],
      "env": {
        "MINIMAX_API_HOST": "https://api.minimaxi.chat",
        "MINIMAX_API_KEY": "<your-api-key-here>",
        "MINIMAX_MCP_BASE_PATH": "<local-output-dir-path>",
        "MINIMAX_RESOURCE_MODE": "url"
      }
    }
  }
}
```

#### Cursor

Go to `Cursor → Preferences → Cursor Settings → MCP → Add new global MCP Server` to add the above config.

⚠️ **Note**: If you encounter a "No tools found" error when using MiniMax MCP JS with Cursor, please update your Cursor to the latest version. For more information, see this [discussion thread](https://forum.cursor.com/t/mcp-servers-no-tools-found/49094/23).

That's it. Your MCP client can now interact with MiniMax through these tools.

**For local development**: 
When developing locally, you can use `npm link` to test your changes:
```bash
# In your project directory
npm link
```

Then configure Claude Desktop or Cursor to use npx as shown above. This will automatically use your linked version.

⚠️ **Note**: The API key needs to match the host address. Different hosts are used for global and mainland China versions:
- Global Host: `https://api.minimaxi.chat` (note the extra "i")
- Mainland China Host: `https://api.minimaxi.chat`

## Transport Modes

MiniMax MCP JS supports three transport modes:

| Feature | stdio (default) | REST | SSE |
|:-----|:-----|:-----|:-----|
| Environment | Local only | Local or cloud deployment | Local or cloud deployment |
| Communication | Via `standard I/O` | Via `HTTP requests` | Via `server-sent events` |
| Use Cases | Local MCP client integration | API services, cross-language calls | Applications requiring server push |
| Input Restrictions | Supports `local files` or `URL` resources | When deployed in cloud, `URL` input recommended | When deployed in cloud, `URL` input recommended |

## Configuration

MiniMax-MCP-JS provides multiple flexible configuration methods to adapt to different use cases. The configuration priority from highest to lowest is as follows:

### 1. Request Parameter Configuration (Highest Priority)

In platform hosting environments (like ModelScope or other MCP platforms), you can provide an independent configuration for each request via the `meta.auth` object in the request parameters:

```json
{
  "params": {
    "meta": {
      "auth": {
        "api_key": "your_api_key_here",
        "api_host": "https://api.minimaxi.chat",
        "base_path": "/path/to/output",
        "resource_mode": "url"
      }
    }
  }
}
```

This method enables multi-tenant usage, where each request can use different API keys and configurations.

### 2. API Configuration

When used as a module in other projects, you can pass configuration through the `startMiniMaxMCP` function:

```javascript
import { startMiniMaxMCP } from 'minimax-mcp-js';

await startMiniMaxMCP({
  apiKey: 'your_api_key_here',
  apiHost: 'https://api.minimaxi.chat',
  basePath: '/path/to/output',
  resourceMode: 'url'
});
```

### 3. Command Line Arguments

When used as a CLI tool, you can provide configuration via command line arguments:

```bash
minimax-mcp-js --api-key your_api_key_here --api-host https://api.minimaxi.chat --base-path /path/to/output --resource-mode url
```

### 4. Environment Variables (Lowest Priority)

The most basic configuration method is through environment variables:

```bash
# MiniMax API Key (required)
MINIMAX_API_KEY=your_api_key_here

# Base path for output files (optional, defaults to user's desktop)
MINIMAX_MCP_BASE_PATH=~/Desktop

# MiniMax API Host (optional, defaults to https://api.minimaxi.chat)
MINIMAX_API_HOST=https://api.minimaxi.chat

# Resource mode (optional, defaults to 'url')
# Options: 'url' (return URLs), 'local' (save files locally)
MINIMAX_RESOURCE_MODE=url
```

### Configuration Priority

When multiple configuration methods are used, the following priority order applies (from highest to lowest):

1. **Request-level configuration** (via `meta.auth` in each API request)
2. **Command line arguments**
3. **Environment variables**
4. **Configuration file**
5. **Default values**

This prioritization ensures flexibility across different deployment scenarios while maintaining per-request configuration capabilities for multi-tenant environments.

### Configuration Parameters

| Parameter | Description | Default Value |
|-----------|-------------|---------------|
| apiKey | MiniMax API Key | None (Required) |
| apiHost | MiniMax API Host | https://api.minimaxi.chat |
| basePath | Base path for output files | User's desktop |
| resourceMode | Resource handling mode, 'url' or 'local' | url |

⚠️ **Note**: The API key needs to match the host address. Different hosts are used for global and mainland China versions:
- Global Host: `https://api.minimaxi.chat` (note the extra "i")
- Mainland China Host: `https://api.minimaxi.chat`

## Example usage

⚠️ Warning: Using these tools may incur costs.

### 1. broadcast a segment of the evening news
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/Snipaste_2025-04-09_20-07-53.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

### 2. clone a voice
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/Snipaste_2025-04-09_19-45-13.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

### 3. generate a video
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/Snipaste_2025-04-09_19-58-52.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/Snipaste_2025-04-09_19-59-43.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle; "/>

### 4. generate images
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/gen_image.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/gen_image1.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle; "/>

## Available Tools

### Text to Audio

Convert text to speech audio file.

Tool Name: `text_to_audio`

Parameters:
- `text`: Text to convert (required)
- `model`: Model version, options are 'speech-02-hd', 'speech-02-turbo', 'speech-01-hd', 'speech-01-turbo', 'speech-01-240228', 'speech-01-turbo-240228', default is 'speech-02-hd'
- `voiceId`: Voice ID, default is 'male-qn-qingse'
- `speed`: Speech speed, range 0.5-2.0, default is 1.0
- `vol`: Volume, range 0.1-10.0, default is 1.0
- `pitch`: Pitch, range -12 to 12, default is 0
- `emotion`: Emotion, options are 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral', default is 'happy'. Note: This parameter only works with 'speech-02-hd', 'speech-02-turbo', 'speech-01-turbo', 'speech-01-hd' models
- `format`: Audio format, options are 'mp3', 'pcm', 'flac', 'wav', default is 'mp3'
- `sampleRate`: Sample rate (Hz), options are 8000, 16000, 22050, 24000, 32000, 44100, default is 32000
- `bitrate`: Bitrate (bps), options are 64000, 96000, 128000, 160000, 192000, 224000, 256000, 320000, default is 128000
- `channel`: Audio channels, options are 1 or 2, default is 1
- `languageBoost`: Language boost, default is 'auto'
- `latexRead`: Enable LaTeX formula reading
- `pronunciationDict`: Pronunciation dictionary
- `stream`: Enable streaming output
- `subtitleEnable`: Enable subtitle generation
- `outputDirectory`: Directory to save the output file (optional)
- `outputFile`: Path to save the output file (optional, auto-generated if not provided)

### Text to Image

Generate images based on text prompts.

Tool Name: `text_to_image`

Parameters:
- `prompt`: Image description (required)
- `model`: Model version, default is 'image-01'
- `aspectRatio`: Aspect ratio, default is '1:1', options are '1:1', '16:9','4:3', '3:2', '2:3', '3:4', '9:16', '21:9'
- `n`: Number of images to generate, range 1-9, default is 1
- `promptOptimizer`: Whether to optimize the prompt, default is true
- `subjectReference`: Path to local image file or public URL for character reference (optional)
- `outputDirectory`: Directory to save the output file (optional)
- `outputFile`: Path to save the output file (optional, auto-generated if not provided)

### Generate Video

Generate videos based on text prompts.

Tool Name: `generate_video`

Parameters:
- `prompt`: Video description (required)
- `model`: Model version, options are 'T2V-01', 'T2V-01-Director', 'I2V-01', 'I2V-01-Director', 'I2V-01-live', 'S2V-01', default is 'T2V-01'
- `firstFrameImage`: Path to first frame image (optional)
- `outputDirectory`: Directory to save the output file (optional)
- `outputFile`: Path to save the output file (optional, auto-generated if not provided)

### Voice Clone

Clone a voice from an audio file.

Tool Name: `voice_clone`

Parameters:
- `audioFile`: Path to audio file (required)
- `voiceId`: Voice ID (required)
- `text`: Text for demo audio (optional)
- `outputDirectory`: Directory to save the output file (optional)

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/MiniMax-AI/MiniMax-MCP-JS.git
cd minimax-mcp-js

# Install dependencies
pnpm install
```

### Build

```bash
# Build the project
pnpm run build
```

### Run

```bash
# Run the MCP server
pnpm start
```

## License

MIT