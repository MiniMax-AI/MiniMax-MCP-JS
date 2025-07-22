[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/minimax-ai-minimax-mcp-js-badge.png)](https://mseep.ai/app/minimax-ai-minimax-mcp-js)

![export](https://github.com/MiniMax-AI/MiniMax-01/raw/main/figures/MiniMaxLogo-Light.png)

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
  <a href="https://github.com/MiniMax-AI/MiniMax-AI.github.io/blob/main/images/wechat-qrcode.jpeg" target="_blank" style="margin: 2px;">
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
  <a href="https://smithery.ai/server/@MiniMax-AI/MiniMax-MCP-JS"><img alt="Smithery Badge" src="https://smithery.ai/badge/@MiniMax-AI/MiniMax-MCP-JS"></a>
</div>

</div>

## Documentation

- [中文文档](README.zh-CN.md)
- [Python Version](https://github.com/MiniMax-AI/MiniMax-MCP) - Official Python implementation of MiniMax MCP

## Release Notes

### July 22, 2025

#### 🔧 Fixes & Improvements
- **TTS Tool Fixes**: Fixed parameter handling for `languageBoost` and `subtitleEnable` in the `text_to_audio` tool
- **API Response Enhancement**: TTS API can return both audio file and subtitle file, providing a more complete speech-to-text experience

### July 7, 2025

#### 🆕 What's New
- **Voice Design**: New `voice_design` tool - create custom voices from descriptive prompts with preview audio
- **Video Enhancement**: Added `MiniMax-Hailuo-02` model with ultra-clear quality and duration/resolution controls  
- **Music Generation**: Enhanced `music_generation` tool powered by `music-1.5` model

#### 📈 Enhanced Tools
- `voice_design` - Generate personalized voices from text descriptions
- `generate_video` - Now supports MiniMax-Hailuo-02 with 6s/10s duration and 768P/1080P resolution options
- `music_generation` - High-quality music creation with music-1.5 model

## Features

- Text-to-Speech (TTS)
- Image Generation
- Video Generation
- Voice Cloning
- Music Generation
- Voice Design
- Dynamic configuration (supports both environment variables and request parameters)
- Compatible with MCP platform hosting (ModelScope and other MCP platforms)

## Installation

### Installing via Smithery

To install MiniMax MCP JS for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@MiniMax-AI/MiniMax-MCP-JS):

```bash
npx -y @smithery/cli install @MiniMax-AI/MiniMax-MCP-JS --client claude
```

### Installing manually
```bash
# Install with pnpm (recommended)
pnpm add minimax-mcp-js
```

## Quick Start

MiniMax MCP JS implements the [Model Context Protocol (MCP)](https://github.com/anthropics/model-context-protocol) specification and can be used as a server to interact with MCP-compatible clients (such as Claude AI).

### Quickstart with MCP Client

1. Get your API key from [MiniMax International Platform](https://www.minimax.io/platform/user-center/basic-information/interface-key).
2. Make sure that you already installed [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. **Important: API HOST&KEY are different in different region**, they must match, otherwise you will receive an `Invalid API key` error.

|Region| Global  | Mainland  |
|:--|:-----|:-----|
|MINIMAX_API_KEY| go get from [MiniMax Global](https://www.minimax.io/platform/user-center/basic-information/interface-key) | go get from [MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key) |
|MINIMAX_API_HOST| ​https://api.minimaxi.chat (note the extra **"i"**) | ​https://api.minimax.chat |


### Using with MCP Clients (Recommended)

Configure your MCP client:

#### Claude Desktop

Go to `Claude > Settings > Developer > Edit Config > claude_desktop_config.json` to include:

```json
{
  "mcpServers": {
    "minimax-mcp-js": {
      "command": "npx",
      "args": [
        "-y",
        "minimax-mcp-js"
      ],
      "env": {
        "MINIMAX_API_HOST": "<https://api.minimaxi.chat|https://api.minimax.chat>",
        "MINIMAX_API_KEY": "<your-api-key-here>",
        "MINIMAX_MCP_BASE_PATH": "<local-output-dir-path, such as /User/xxx/Desktop>",
        "MINIMAX_RESOURCE_MODE": "<optional, [url|local], url is default, audio/image/video are downloaded locally or provided in URL format>"
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
        "api_host": "<https://api.minimaxi.chat|https://api.minimaxi.chat>",
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
  apiHost: 'https://api.minimaxi.chat', // Global Host - https://api.minimaxi.chat, Mainland Host - https://api.minimax.chat
  basePath: '/path/to/output',
  resourceMode: 'url'
});
```

### 3. Command Line Arguments

1. Install the CLI tool globally:
```bash
# Install globally
pnpm install -g minimax-mcp-js
```

2. When used as a CLI tool, you can provide configuration via command line arguments:

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

# MiniMax API Host (optional, defaults to https://api.minimaxi.chat, Global Host - https://api.minimaxi.chat, Mainland Host - https://api.minimax.chat)
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
| apiHost | MiniMax API Host | Global Host - https://api.minimaxi.chat, Mainland Host - https://api.minimax.chat |
| basePath | Base path for output files | User's desktop |
| resourceMode | Resource handling mode, 'url' or 'local' | url |

⚠️ **Note**: The API key needs to match the host address. Different hosts are used for global and mainland China versions:
- Global Host: `https://api.minimaxi.chat` (note the extra "i")
- Mainland China Host: `https://api.minimax.chat`

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

### 5. generate music
<img src="https://filecdn.minimax.chat/public/5675b3dc-6789-4ceb-9505-8ef39ae4224f.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

### 6. voice design
<img src="https://filecdn.minimax.chat/public/5654f5df-0642-477f-9c5d-b853d185b8b0.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

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
- `languageBoost`: Enhance the ability to recognize specified languages and dialects.
Supported values include:
'Chinese', 'Chinese,Yue', 'English', 'Arabic', 'Russian', 'Spanish', 'French', 'Portuguese', 'German', 'Turkish', 'Dutch', 'Ukrainian', 'Vietnamese', 'Indonesian', 'Japanese', 'Italian', 'Korean', 'Thai', 'Polish', 'Romanian', 'Greek', 'Czech', 'Finnish', 'Hindi', 'auto', default is 'auto'
- `stream`: Enable streaming output
- `subtitleEnable`: The parameter controls whether the subtitle service is enabled. The model must be 'speech-01-turbo' or 'speech-01-hd'. If this parameter is not provided, the default value is false
- `outputDirectory`: Directory to save the output file. `outputDirectory` is relative to `MINIMAX_MCP_BASE_PATH` (or `basePath` in config). The final save path is `${basePath}/${outputDirectory}`. For example, if `MINIMAX_MCP_BASE_PATH=~/Desktop` and `outputDirectory=workspace`, the output will be saved to `~/Desktop/workspace/`. (optional)
- `outputFile`: Path to save the output file (optional, auto-generated if not provided)

### Play Audio

Play an audio file. Supports WAV and MP3 formats. Does not support video.

Tool Name: `play_audio`

Parameters:
- `inputFilePath`: Path to the audio file to play (required)
- `isUrl`: Whether the audio file is a URL, default is false

### Voice Clone

Clone a voice from an audio file.

Tool Name: `voice_clone`

Parameters:
- `audioFile`: Path to audio file (required)
- `voiceId`: Voice ID (required)
- `text`: Text for demo audio (optional)
- `outputDirectory`: Directory to save the output file. `outputDirectory` is relative to `MINIMAX_MCP_BASE_PATH` (or `basePath` in config). The final save path is `${basePath}/${outputDirectory}`. For example, if `MINIMAX_MCP_BASE_PATH=~/Desktop` and `outputDirectory=workspace`, the output will be saved to `~/Desktop/workspace/`. (optional)

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
- `outputDirectory`: Directory to save the output file. `outputDirectory` is relative to `MINIMAX_MCP_BASE_PATH` (or `basePath` in config). The final save path is `${basePath}/${outputDirectory}`. For example, if `MINIMAX_MCP_BASE_PATH=~/Desktop` and `outputDirectory=workspace`, the output will be saved to `~/Desktop/workspace/`. (optional)
- `outputFile`: Path to save the output file (optional, auto-generated if not provided)
- `asyncMode`: Whether to use async mode. Defaults to False. If True, the video generation task will be submitted asynchronously and the response will return a task_id. Should use `query_video_generation` tool to check the status of the task and get the result. (optional)

### Generate Video

Generate videos based on text prompts.

Tool Name: `generate_video`

Parameters:
- `prompt`: Video description (required)
- `model`: Model version, options are 'T2V-01', 'T2V-01-Director', 'I2V-01', 'I2V-01-Director', 'I2V-01-live', 'S2V-01', 'MiniMax-Hailuo-02', default is 'MiniMax-Hailuo-02'
- `firstFrameImage`: Path to first frame image (optional)
- `duration`: The duration of the video. The model must be "MiniMax-Hailuo-02". Values can be 6 and 10. (optional)
- `resolution`: The resolution of the video. The model must be "MiniMax-Hailuo-02". Values range ["768P", "1080P"]. (optional)
- `outputDirectory`: Directory to save the output file. `outputDirectory` is relative to `MINIMAX_MCP_BASE_PATH` (or `basePath` in config). The final save path is `${basePath}/${outputDirectory}`. For example, if `MINIMAX_MCP_BASE_PATH=~/Desktop` and `outputDirectory=workspace`, the output will be saved to `~/Desktop/workspace/`. (optional)
- `outputFile`: Path to save the output file (optional, auto-generated if not provided)
- `asyncMode`: Whether to use async mode. Defaults to False. If True, the video generation task will be submitted asynchronously and the response will return a task_id. Should use `query_video_generation` tool to check the status of the task and get the result. (optional)

### Query Video Generation Status

Query the status of a video generation task.

Tool Name: `query_video_generation`

Parameters:
- `taskId`: The Task ID to query. Should be the task_id returned by `generate_video` tool if `async_mode` is True. (required)
- `outputDirectory`: Directory to save the output file. `outputDirectory` is relative to `MINIMAX_MCP_BASE_PATH` (or `basePath` in config). The final save path is `${basePath}/${outputDirectory}`. For example, if `MINIMAX_MCP_BASE_PATH=~/Desktop` and `outputDirectory=workspace`, the output will be saved to `~/Desktop/workspace/`. (optional)

### Generate Music

Generate music from prompt and lyrics.

Tool Name: `music_generation`

Parameters:
- `prompt`: Music creation inspiration describing style, mood, scene, etc. Example: "Pop music, sad, suitable for rainy nights". Character range: [10, 300]. (required)
- `lyrics`: Song lyrics for music generation. Use newline (\\n) to separate each line of lyrics. Supports lyric structure tags [Intro] [Verse] [Chorus] [Bridge] [Outro] to enhance musicality. Character range: [10, 600] (each Chinese character, punctuation, and letter counts as 1 character). (required)
- `sampleRate`: Sample rate of generated music. Values: [16000, 24000, 32000, 44100], default is 32000. (optional)
- `bitrate`: Bitrate of generated music. Values: [32000, 64000, 128000, 256000], default is 128000. (optional)
- `format`: Format of generated music. Values: ["mp3", "wav", "pcm"], default is 'mp3'. (optional)
- `outputDirectory`: The directory to save the output file. `outputDirectory` is relative to `MINIMAX_MCP_BASE_PATH` (or `basePath` in config). The final save path is `${basePath}/${outputDirectory}`. For example, if `MINIMAX_MCP_BASE_PATH=~/Desktop` and `outputDirectory=workspace`, the output will be saved to `~/Desktop/workspace/`. (optional)


### Voice Design

Generate a voice based on description prompts.

Tool Name: `voice_design`

Parameters:
- `prompt`: The prompt to generate the voice from. (required)
- `previewText`: The text to preview the voice. (required)
- `voiceId`: The id of the voice to use. For example, "male-qn-qingse"/"audiobook_female_1"/"cute_boy"/"Charming_Lady"... (optional)
- `outputDirectory`: The directory to save the output file. `outputDirectory` is relative to `MINIMAX_MCP_BASE_PATH` (or `basePath` in config). The final save path is `${basePath}/${outputDirectory}`. For example, if `MINIMAX_MCP_BASE_PATH=~/Desktop` and `outputDirectory=workspace`, the output will be saved to `~/Desktop/workspace/`. (optional)

## FAQ

### 1. How to use `generate_video` in async-mode
Define completion rules before starting:
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/cursor_rule2.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>
Alternatively, these rules can be configured in your IDE settings (e.g., Cursor):
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/cursor_video_rule.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

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
