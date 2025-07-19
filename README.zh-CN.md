![export](https://github.com/MiniMax-AI/MiniMax-01/raw/main/figures/MiniMaxLogo-Light.png)

<div align="center">

# MiniMax MCP JS

MiniMax MCP JS 是 MiniMax MCP 的 JavaScript/TypeScript 实现，提供图像生成、视频生成、文本转语音等功能。

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
</div>

</div>

## 文档

- [English Documentation](README.md)
- [Python 版本](https://github.com/MiniMax-AI/MiniMax-MCP) - MiniMax MCP的官方Python实现

## 更新日志

### 2025年7月7日

#### 🆕 新增功能
- **音色设计**: 新增 `voice_design` 工具 - 根据描述性提示词创建自定义音色并生成试听音频
- **视频生成增强**: 新增 `MiniMax-Hailuo-02` 模型，支持超清画质和时长/分辨率控制
- **音乐生成**: 采用 `music-1.5` 模型增强 `music_generation` 工具

#### 📈 功能增强
- `voice_design` - 根据文本描述生成个性化音色
- `generate_video` - 现在支持 MiniMax-Hailuo-02 模型，可选择 6s/10s 时长和 768P/1080P 分辨率
- `music_generation` - 采用 music-1.5 模型进行高质量音乐创作

## 功能特性

- 文本转语音 (TTS)
- 图像生成
- 视频生成
- 语音克隆
- 音乐生成
- 音色设计
- 动态配置（支持环境变量和请求参数）
- 兼容MCP平台托管（ModelScope和其他MCP平台）

## 安装

```bash
# 使用 pnpm 安装（推荐）
pnpm add minimax-mcp-js
```

## 快速开始

MiniMax MCP JS 实现了 [Model Context Protocol (MCP)](https://github.com/anthropics/model-context-protocol) 规范，可以作为服务器与支持 MCP 的客户端（如 Claude AI）进行交互。

### 使用 MCP 客户端的快速开始

1. 从[MiniMax国内开放平台](https://platform.minimaxi.com/user-center/basic-information/interface-key)或[MiniMax国际开放平台](https://www.minimax.io/platform/user-center/basic-information/interface-key)获取您的 API 密钥。
2. 确保你已经安装了 [Node.js 和 npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. **重要提示: API的服务器地址和密钥在不同区域有所不同**，两者需要匹配，否则会有 `invalid api key` 的错误

|地区| 国际  | 国内  |
|:--|:-----|:-----|
|MINIMAX_API_KEY| 获取密钥 [MiniMax国际版](https://www.minimax.io/platform/user-center/basic-information/interface-key) | 获取密钥 [MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key) |
|MINIMAX_API_HOST| ​https://api.minimaxi.chat （请注意额外的 **"i"** 字母） | ​https://api.minimax.chat |

### 通过 MCP 客户端使用（推荐）

在 MCP 客户端中配置：

#### Claude Desktop

进入 `Claude > Settings > Developer > Edit Config > claude_desktop_config.json` 添加如下配置:

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
        "MINIMAX_API_HOST": "https://api.minimax.chat",
        "MINIMAX_API_KEY": "<您的API密钥>",
        "MINIMAX_MCP_BASE_PATH": "<本地输出目录路径，如/User/xxx/Desktop>",
        "MINIMAX_RESOURCE_MODE": "<可选配置，资源生成后的提供方式, [url|local], 默认为 url>"
      }
    }
  }
}
```

#### Cursor

进入 `Cursor → Preferences → Cursor Settings → MCP → Add new global MCP Server` 添加上述配置。

⚠️ **注意**: 如果您在 Cursor 中使用 MiniMax MCP JS 时遇到 "No tools found" 错误，请将 Cursor 升级到最新版本。
更多信息，请参阅这个[讨论帖](https://forum.cursor.com/t/mcp-servers-no-tools-found/49094/23).

完成以上步骤后，您的MCP客户端就可以通过这些工具与MiniMax进行交互了。

**本地开发**:
在本地开发时，您可以使用 `npm link` 来测试您的更改：
```bash
# 在您的项目目录中
npm link
```

⚠️ **注意**：API密钥需要与主机地址匹配，在国际版和中国大陆版使用不同的主机地址：
- 全球版主机地址: `https://api.minimaxi.chat` (注意多了一个 "i")
- 中国大陆版主机地址: `https://api.minimax.chat`

## 传输模式

MiniMax MCP JS 支持三种传输模式:

| 特性 | stdio (默认) | REST | SSE |
|:-----|:-----|:-----|:-----|
| 运行环境 | 本地运行 | 可本地或云端部署 | 可本地或云端部署 |
| 通信方式 | 通过`标准输入输出`通信 | 通过`HTTP请求`通信 | 通过`服务器发送事件`通信 |
| 适用场景 | 本地MCP客户端集成 | API服务，跨语言调用 | 需要服务器推送的应用 |
| 输入限制 | 支持处理`本地文件`或有效的`URL`资源 | 当部署在云端时，建议使用`URL`作为输入 | 当部署在云端时，建议使用`URL`作为输入 |


## 配置方式

MiniMax-MCP-JS 提供了多种灵活的配置方式，以适应不同的使用场景。配置的优先级从高到低排列如下：

### 1. 请求参数配置 (最高优先级)

在平台托管环境（如ModelScope或其他MCP平台）中，可以通过请求参数中的`meta.auth`对象为每个请求提供独立的配置：

```json
{
  "params": {
    "meta": {
      "auth": {
        "api_key": "您的API密钥",
        "api_host": "https://api.minimax.chat",
        "base_path": "/输出路径",
        "resource_mode": "url"
      }
    }
  }
}
```

这种方式允许多租户使用，每个请求可以使用不同的API密钥和配置。

### 2. API配置

当在其他项目中作为模块使用时，可以通过`startMiniMaxMCP`函数传入配置：

```javascript
import { startMiniMaxMCP } from 'minimax-mcp-js';

await startMiniMaxMCP({
  apiKey: '您的API密钥',
  apiHost: 'https://api.minimax.chat',
  basePath: '/输出路径',
  resourceMode: 'url'
});
```

### 3. 命令行参数

1. 全局安装 CLI 工具：
```bash
# 全局安装
pnpm install -g minimax-mcp-js
```

2. 当作为CLI工具使用时，可以通过命令行参数提供配置：

```bash
minimax-mcp-js --api-key 您的API密钥 --api-host https://api.minimax.chat --base-path /输出路径 --resource-mode url
```

### 4. 环境变量 (最低优先级)

最基本的配置方式，通过环境变量提供：

```bash
# MiniMax API 密钥 (必需)
MINIMAX_API_KEY=您的API密钥

# 输出文件的基础路径 (可选，默认为用户桌面)
MINIMAX_MCP_BASE_PATH=~/Desktop

# MiniMax API 主机 (可选，默认为 https://api.minimax.chat)
MINIMAX_API_HOST=https://api.minimax.chat

# 资源模式 (可选，默认为 'url')
# 选项: 'url' (返回URL), 'local' (本地保存文件)
MINIMAX_RESOURCE_MODE=url
```

## 配置优先级

当使用多种配置方式时，将按照以下优先级顺序应用（从高到低）：

1. **请求级配置**（通过每个API请求的`meta.auth`字段）
2. **命令行参数**
3. **环境变量**
4. **配置文件**
5. **默认值**

这种优先级设计确保了在不同部署场景下的灵活性，同时为多租户环境提供了按请求配置的能力。

## 配置项说明

| 配置项 | 描述 | 默认值 |
|-------|------|--------|
| apiKey | MiniMax API 密钥 | 无（必填） |
| apiHost | MiniMax API 主机地址 | https://api.minimax.chat |
| basePath | 输出文件的基础路径 | 用户桌面 |
| resourceMode | 资源处理模式，'url' 或 'local' | url |

⚠️ **注意**：API密钥需要与主机地址匹配，在国际版和中国大陆版使用不同的主机地址：
- 全球版主机地址: `https://api.minimaxi.chat` (注意多了一个 "i")
- 中国大陆版主机地址: `https://api.minimax.chat`


## 使用示例

⚠️ 注意：使用这些工具可能会产生费用。

### 1. 播报晚间新闻片段
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/Snipaste_2025-04-09_20-07-53.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

### 2. 克隆声音
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/Snipaste_2025-04-09_19-45-13.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

### 3. 生成视频
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/Snipaste_2025-04-09_19-58-52.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/Snipaste_2025-04-09_19-59-43.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle; "/>

### 4. 生成图像
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/gen_image.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/gen_image1.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle; "/>

### 5. 生成音乐
<img src="https://filecdn.minimax.chat/public/5675b3dc-6789-4ceb-9505-8ef39ae4224f.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

### 6. 音色设计
<img src="https://filecdn.minimax.chat/public/5654f5df-0642-477f-9c5d-b853d185b8b0.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

## 可用工具

### 文本转语音

将文本转换为语音文件。

工具名称：`text_to_audio`

参数：
- `text`: 要转换的文本 (必需)
- `model`: 模型版本，选项为 'speech-02-hd', 'speech-02-turbo', 'speech-01-hd', 'speech-01-turbo', 'speech-01-240228', 'speech-01-turbo-240228'，默认为 'speech-02-hd'
- `voiceId`: 语音 ID，默认为 'male-qn-qingse'
- `speed`: 语速，范围 0.5-2.0，默认为 1.0
- `vol`: 音量，范围 0.1-10.0，默认为 1.0
- `pitch`: 音调，范围 -12 到 12，默认为 0
- `emotion`: 情感，选项为 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'，默认为 'happy'。注意：此参数仅对 'speech-02-hd', 'speech-02-turbo', 'speech-01-turbo', 'speech-01-hd' 模型有效
- `format`: 音频格式，选项为 'mp3', 'pcm', 'flac', 'wav'，默认为 'mp3'
- `sampleRate`: 采样率 (Hz)，选项为 8000, 16000, 22050, 24000, 32000, 44100，默认为 32000
- `bitrate`: 比特率 (bps)，选项为 64000, 96000, 128000, 160000, 192000, 224000, 256000, 320000，默认为 128000
- `channel`: 音频通道数，选项为 1 或 2，默认为 1
- `languageBoost`: 增强对指定的小语种和方言的识别能力，设置后可以提升在指定小语种/方言场景下的语音表现。如果不明确小语种类型，则可以选择"auto"，模型将自主判断小语种类型。支持以下取值：
'Chinese', 'Chinese,Yue', 'English', 'Arabic', 'Russian', 'Spanish', 'French', 'Portuguese', 'German', 'Turkish', 'Dutch', 'Ukrainian', 'Vietnamese', 'Indonesian', 'Japanese', 'Italian', 'Korean', 'Thai', 'Polish', 'Romanian', 'Greek', 'Czech', 'Finnish', 'Hindi', 'auto'，默认为 'auto'
- `subtitleEnable`: 控制是否开启字幕服务的开关。默认为false
- `outputDirectory`: 保存输出文件的目录。 `outputDirectory` 是相对于 `MINIMAX_MCP_BASE_PATH`（或配置中的 `basePath`）的。最终的保存路径是 `${basePath}/${outputDirectory}`, 例如, 如果 `MINIMAX_MCP_BASE_PATH=~/Desktop` 且 `outputDirectory=workspace`，则输出将被保存到 `~/Desktop/workspace/` (可选)
- `outputFile`: 保存输出文件的路径 (可选，如果未提供则自动生成)

### 语音克隆

从音频文件克隆语音。

工具名称：`voice_clone`

参数：
- `audioFile`: 音频文件路径 (必需)
- `voiceId`: 语音 ID (必需)
- `text`: 演示音频的文本 (可选)
- `outputDirectory`: 保存输出文件的目录。 `outputDirectory` 是相对于 `MINIMAX_MCP_BASE_PATH`（或配置中的 `basePath`）的。最终的保存路径是 `${basePath}/${outputDirectory}`, 例如, 如果 `MINIMAX_MCP_BASE_PATH=~/Desktop` 且 `outputDirectory=workspace`，则输出将被保存到 `~/Desktop/workspace/` (可选)

### 列出所有语音类型

列出所有可用的文本转语音声音。仅在 api_host 为 https://api.minimax.chat 时支持。

工具名称：`list_voices`

参数：
- `voiceType`: 要列出的语音类型，选项为 'all'（全部）, 'system'（系统）, 'voice_cloning'（克隆语音），默认为 'all'

### 播放音频

播放音频文件。支持 WAV 和 MP3 格式。不支持视频。

工具名称：`play_audio`

参数：
- `inputFilePath`: 要播放的音频文件路径 (必需)
- `isUrl`: 音频文件是否为 URL，默认为 false

### 文本生成图像

根据文本提示生成图像。

工具名称：`text_to_image`

参数：
- `prompt`: 图像描述 (必需)
- `model`: 模型版本，默认为 'image-01'
- `aspectRatio`: 宽高比，默认为 '1:1'，选项为 '1:1', '16:9','4:3', '3:2', '2:3', '3:4', '9:16', '21:9'
- `n`: 生成图像数量，范围 1-9，默认为 1
- `promptOptimizer`: 是否优化提示，默认为 true
- `subjectReference`: 角色参考的本地图像文件路径或公共 URL (可选)
- `outputDirectory`: 保存输出文件的目录。 `outputDirectory` 是相对于 `MINIMAX_MCP_BASE_PATH`（或配置中的 `basePath`）的。最终的保存路径是 `${basePath}/${outputDirectory}`, 例如, 如果 `MINIMAX_MCP_BASE_PATH=~/Desktop` 且 `outputDirectory=workspace`，则输出将被保存到 `~/Desktop/workspace/` (可选)
- `outputFile`: 保存输出文件的路径 (可选，如果未提供则自动生成)

### 生成视频

根据文本提示生成视频。

工具名称：`generate_video`

参数：
- `prompt`: 视频描述 (必需)
- `model`: 模型版本，选项为 'T2V-01', 'T2V-01-Director', 'I2V-01', 'I2V-01-Director', 'I2V-01-live', 'S2V-01', 'MiniMax-Hailuo-02', 默认为 'MiniMax-Hailuo-02'
- `firstFrameImage`: 第一帧图像路径 (可选)
- `duration`: 视频时长秒数。模型必须是 "MiniMax-Hailuo-02"。值可以是 6 和 10。（可选）
- `resolution`: 视频分辨率。模型必须是 "MiniMax-Hailuo-02"。值范围为 ["768P", "1080P"]。（可选）
- `outputDirectory`: 保存输出文件的目录。 `outputDirectory` 是相对于 `MINIMAX_MCP_BASE_PATH`（或配置中的 `basePath`）的。最终的保存路径是 `${basePath}/${outputDirectory}`, 例如, 如果 `MINIMAX_MCP_BASE_PATH=~/Desktop` 且 `outputDirectory=workspace`，则输出将被保存到 `~/Desktop/workspace/` (可选)
- `outputFile`: 保存输出文件的路径 (可选，如果未提供则自动生成)
- `asyncMode`: 是否使用异步模式。默认为 False。如果为 True，视频生成任务将异步提交并返回任务 ID。需要使用 `query_video_generation` 工具来检查任务状态并获取结果。(可选)

### 查询视频生成状态

查询视频生成任务的状态。

工具名称：`query_video_generation`

参数：
- `taskId`: 要查询的任务 ID。如果 `generate_video` 工具的 `async_mode` 为 True，则应使用其返回的 task_id。(必需)
- `outputDirectory`: 保存输出文件的目录。 `outputDirectory` 是相对于 `MINIMAX_MCP_BASE_PATH`（或配置中的 `basePath`）的。最终的保存路径是 `${basePath}/${outputDirectory}`, 例如, 如果 `MINIMAX_MCP_BASE_PATH=~/Desktop` 且 `outputDirectory=workspace`，则输出将被保存到 `~/Desktop/workspace/` (可选)

### 音乐生成

根据提示和歌词生成音乐。

工具名称：`music_generation`

参数：
- `prompt`: 音乐创作灵感，描述风格、情绪、场景等。例如："流行音乐，悲伤，适合雨夜"。字符范围：[10, 300]。(必需)
- `lyrics`: 用于音乐生成的歌词。使用换行符 (\\n) 分隔每行歌词。支持歌词结构标签 [Intro] [Verse] [Chorus] [Bridge] [Outro] 以增强音乐性。字符范围：[10, 600]（每个中文字符、标点符号和字母计为1个字符）。(必需)
- `sampleRate`: 生成音乐的采样率。值：[16000, 24000, 32000, 44100]，默认为 32000。(可选)
- `bitrate`: 生成音乐的比特率。值：[32000, 64000, 128000, 256000]，默认为 128000。(可选)
- `format`: 生成音乐的格式。值：["mp3", "wav", "pcm"]，默认为 'mp3'。(可选)
- `outputDirectory`: 保存输出文件的目录。 `outputDirectory` 是相对于 `MINIMAX_MCP_BASE_PATH`（或配置中的 `basePath`）的。最终的保存路径是 `${basePath}/${outputDirectory}`, 例如, 如果 `MINIMAX_MCP_BASE_PATH=~/Desktop` 且 `outputDirectory=workspace`，则输出将被保存到 `~/Desktop/workspace/` (可选)


### 音色设计

根据描述提示生成音色。

工具名称：`voice_design`

参数：
- `prompt`: 生成音色的提示。(必需)
- `previewText`: 预览音色的文本。(必需)
- `voiceId`: 要使用的音色ID。例如："male-qn-qingse"/"audiobook_female_1"/"cute_boy"/"Charming_Lady"...（可选）
- `outputDirectory`: 保存输出文件的目录。 `outputDirectory` 是相对于 `MINIMAX_MCP_BASE_PATH`（或配置中的 `basePath`）的。最终的保存路径是 `${basePath}/${outputDirectory}`, 例如, 如果 `MINIMAX_MCP_BASE_PATH=~/Desktop` 且 `outputDirectory=workspace`，则输出将被保存到 `~/Desktop/workspace/` (可选)

## 常见问题

### 1. 如何使用 `generate_video` 的异步模式
在对话开始之前定义完成规则：
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/cursor_rule2.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>
或者，可以在你的本地客户端的配置中设置这些规则（例如 Cursor）：
<img src="https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/cursor_video_rule.png?x-oss-process=image/resize,p_50/format,webp" style="display: inline-block; vertical-align: middle;"/>

## 开发

### 设置

```bash
# 克隆仓库
git clone https://github.com/MiniMax-AI/MiniMax-MCP-JS.git
cd minimax-mcp-js

# 安装依赖
pnpm install
```

### 构建

```bash
# 构建项目
pnpm run build
```

### 运行

```bash
# 运行 MCP 服务器
pnpm start
```

## 许可证

MIT
