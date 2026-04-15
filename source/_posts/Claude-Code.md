---
title: Claude Code
date: 2026-02-27 14:05:22
tags: [AI, Claude, 效率工具, 开发工具]
categories: [开发工具, AI]
permalink: claude-code/
---

## 简介

Claude Code 是 Anthropic 官方推出的 CLI 工具，让你在终端中直接使用 Claude AI 助手完成软件工程任务。

## 安装

### 通过 npm 安装

确保已安装 Node.js（推荐 v18+ 版本），然后使用 npm 全局安装：

```bash
npm install -g @anthropic-ai/claude-code
```

或者使用 yarn：

```bash
yarn global add @anthropic-ai/claude-code
```

使用 pnpm：

```bash
pnpm add -g @anthropic-ai/claude-code
```

### 验证安装

```bash
claude -v
```

## 配置

### 1. 获取 API Key

访问 [Anthropic Console](https://console.anthropic.com/) 注册账号并获取 API Key。

### 2. 配置 API Key

有两种方式配置 API Key：

**方式一：环境变量（推荐）**

在命令行中设置环境变量：

```bash
# Windows PowerShell
$env:ANTHROPIC_API_KEY="your-api-key-here"

# Windows CMD
set ANTHROPIC_API_KEY=your-api-key-here

# macOS/Linux
export ANTHROPIC_API_KEY="your-api-key-here"
```

**方式二：配置文件**

```json
{
    "env": {
        "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY",
        "ANTHROPIC_BASE_URL": "https://coding.dashscope.aliyuncs.com/apps/anthropic",
        "ANTHROPIC_MODEL": "qwen3.5-plus"
    }
}
```

配置文件位置：
- Windows: `%USERPROFILE%\.claude\settings.json`
- macOS/Linux: `~/.claude\settings.json`

### 3. 配置模型

可以指定使用的 Claude 模型：

```bash
# 使用最新模型
claude --model claude-opus-4-6

# 使用 Sonnet 模型
claude --model claude-sonnet-4-6

# 使用 Haiku 模型
claude --model claude-haiku-4-5-20251001
```

## 常用命令

| 命令                      | 说明               |
| ------------------------- | ------------------ |
| `claude`                  | 启动交互式对话     |
| `claude -p "问题"`        | 直接提问并获取答案 |
| `claude --model <模型名>` | 指定模型           |
| `claude --version`        | 查看版本           |
| `claude --help`           | 查看帮助           |

## MCP 配置

MCP (Model Context Protocol) 允许 Claude 连接外部服务和工具。

### 添加 MCP Server

```bash
# 添加 fetch MCP 服务（用于网页内容抓取）
claude mcp add fetch -- uvx mcp-server-fetch
```

### 常用 MCP 服务

| 服务       | 命令                                                                      | 说明         |
| ---------- | ------------------------------------------------------------------------- | ------------ |
| fetch      | `claude mcp add fetch -- uvx mcp-server-fetch`                            | 网页内容抓取 |
| filesystem | `claude mcp add filesystem -- npx -y @anthropic-ai/mcp-server-filesystem` | 文件系统访问 |
| git        | `claude mcp add git -- npx -y @anthropic-ai/mcp-server-git`               | Git 操作     |

配置好的 MCP 配置文件实例 `~/.claude.json`

```json
{
    "mcpServers": {
    "context7": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@upstash/context7-mcp@latest"
      ],
      "env": {
        "DEFAULT_MINIMUM_TOKENS": "10000"
      }
    },
    "Sequential Thinking": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ],
      "env": {}
    },
    "Playwright": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@executeautomation/playwright-mcp-server"
      ],
      "env": {}
    },
    "Fetch": {
      "command": "cmd",
      "args": [
        "/c",
        "uvx",
        "mcp-server-fetch"
      ],
      "env": {}
    },
    "MySQL": {
      "command": "cmd",
      "args": [
        "/c",
        "uvx",
        "--from",
        "mysql-mcp-server",
        "mysql_mcp_server"
      ],
      "env": {
        "MYSQL_HOST": "127.0.0.1",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASSWORD": "123456",
        "MYSQL_DATABASE": "db"
      }
    }
  },
}
```



### 查看已配置的 MCP

```bash
claude mcp list
```

### 移除 MCP

```bash
claude mcp remove <服务名>
```

## 使用示例

```bash
# 启动交互模式
claude

# 直接提问
claude -p "解释一下什么是闭包"

# 分析代码文件
claude -p "这个函数有什么问题" ./src/index.js

# 使用特定模型
claude --model claude-opus-4-6 -p "帮我重构这段代码"
```

## 注意事项

- API 调用会产生费用，请合理使用
- 建议将 API Key 设置为环境变量避免每次输入
- 不同模型的价格和能力有所不同，根据需要选择
