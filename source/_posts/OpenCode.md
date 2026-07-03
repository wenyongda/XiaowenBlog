---
title: OpenCode
date: 2026-06-13 10:34:02
tags:
---

# OpenCode 安装指南

## Windows 安装方式

### 方式一：使用 npm 安装（推荐）

1. 确保已安装 Node.js（建议版本 16 或更高）
2. 打开 PowerShell 或命令提示符
3. 运行以下命令进行全局安装：
   ```bash
   npm i -g opencode-ai
   ```
4. 安装完成后，可以通过以下命令验证安装：
   ```bash
   opencode --version
   ```

### 方式二：使用 curl 安装（需要 WSL 或 Git Bash）

如果您使用的是 Windows Subsystem for Linux (WSL) 或 Git Bash，可以使用以下命令：

```bash
curl -fsSL https://opencode.ai/install | bash
```

**注意：** 此方式需要在 Unix-like 环境中运行，Windows 原生的命令提示符或 PowerShell 不支持此命令。

## 其他操作系统安装方式

### Linux/macOS

```bash
curl -fsSL https://opencode.ai/install | bash
```

或使用 npm：

```bash
npm i -g opencode-ai
```

## 常见问题

### PowerShell 中使用 curl 安装后命令不识别

**问题描述：** 在 PowerShell 中运行 `curl -fsSL https://opencode.ai/install | bash` 后，`opencode` 命令无法识别。

**原因分析：**
1. PowerShell 中的 `curl` 是 `Invoke-WebRequest` 的别名，不是真正的 curl
2. `bash` 命令在 PowerShell 中不可用（除非安装了 WSL 或 Git Bash）
3. 即使安装成功，安装路径可能不在 Windows PATH 中

**解决方案：**

#### 方案一：使用 npm 安装（推荐）
```bash
npm i -g opencode-ai
```

#### 方案二：在 WSL 或 Git Bash 中安装
1. 打开 WSL 或 Git Bash
2. 运行安装命令：
   ```bash
   curl -fsSL https://opencode.ai/install | bash
   ```
3. 如果仍然不识别，检查安装路径并添加到 PATH

#### 方案三：手动添加 PATH
如果已安装但命令不识别：
1. 找到安装位置（通常在 `~/.local/bin` 或 `/usr/local/bin`）
2. 将路径添加到 Windows PATH：
   ```powershell
   [Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\path\to\opencode", "User")
   ```
3. 重启 PowerShell

### nvm 用户切换 Node.js 版本后 opencode 不可用

**问题描述：** 使用 nvm（Node Version Manager）管理 Node.js 版本时，切换版本后之前全局安装的 opencode 命令无法识别。

**原因分析：**
nvm 为每个 Node.js 版本维护独立的全局包目录。当您切换 Node.js 版本时：
- 每个版本有自己独立的 `node_modules` 目录
- 之前版本安装的全局包在新版本中不可用
- 需要重新安装全局包

**解决方案：**

#### 方案一：为当前版本重新安装（推荐）
```bash
# 切换到目标 Node.js 版本
nvm use 18

# 重新安装 opencode
npm i -g opencode-ai
```

#### 方案二：使用 nvm 的默认包迁移功能
```bash
# 设置默认 Node.js 版本
nvm alias default 18

# 重新安装全局包
npm i -g opencode-ai
```

#### 方案三：使用 nvm 的 --default-packages 参数
在安装 Node.js 版本时指定默认包：
```bash
# 设置默认包列表
echo "opencode-ai" > ~/.nvm/default-packages

# 安装新版本时会自动安装默认包
nvm install 18
```

#### 方案四：检查当前 Node.js 版本
```bash
# 查看当前使用的 Node.js 版本
node --version

# 查看 nvm 列表
nvm list

# 切回之前安装 opencode 的版本
nvm use <之前版本号>
```

**最佳实践：**
1. 在切换版本后检查全局包：`npm list -g --depth=0`
2. 为常用版本安装 opencode：`nvm use <版本> && npm i -g opencode-ai`
3. 考虑使用 `nvm alias default <版本>` 设置默认版本

#### 方案五：配置独立的全局包目录（一劳永逸）

将 npm 全局包目录设置到固定位置，不依赖于 nvm 管理的 Node.js 版本：

```bash
# 1. 创建全局包目录
mkdir -p ~/.npm-global

# 2. 配置 npm 使用新目录
npm config set prefix ~/.npm-global

# 3. 添加到 PATH（添加到 ~/.bashrc 或 ~/.zshrc）
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 4. 安装 opencode
npm i -g opencode-ai
```

**优点：**
- 所有 Node.js 版本共享同一套全局包
- 切换版本后无需重新安装
- 一次安装，永久可用

**注意：** 如果遇到包兼容性问题，可以删除 `~/.npm-global` 目录并重新配置。

#### 方案六：使用 nvm 的 reinstall-packages 迁移包

如果已经在某个版本下安装了 opencode，可以迁移到其他版本：

```bash
# 查看当前版本
nvm current

# 切换到目标版本
nvm use 18

# 将之前版本的全局包迁移到当前版本
nvm reinstall-packages <源版本号>
```

例如：`nvm reinstall-packages 16.20.0` 将 16.20.0 版本的全局包迁移到当前版本。

### 权限问题
如果在 Linux/macOS 上遇到权限错误，请使用 `sudo`：
```bash
sudo npm i -g opencode-ai
```

### 网络问题
如果下载速度慢，可以尝试使用镜像源：
```bash
npm config set registry https://registry.npmmirror.com
npm i -g opencode-ai
```

## 验证安装

安装完成后，运行以下命令验证：
```bash
opencode --version
```

如果显示版本号，则表示安装成功。

## 迁移 OpenCode 配置

当需要在新机器上恢复 OpenCode 配置时，可以使用以下方法迁移。

### 源机器打包

在源机器上打包 OpenCode 配置文件和目录：

##### Linux/macOS

```bash
tar -czf opencode-migration.tar.gz -C ~ \
  .config/opencode/opencode.json \
  .config/opencode/oh-my-openagent.json \
  .config/opencode/AGENTS.md \
  .agents/ \
  .local/share/opencode/auth.json \
  .cache/oh-my-opencode/connected-providers.json
```

**打包内容说明：**

- `opencode.json`：OpenCode 主配置文件
- `oh-my-openagent.json`：Oh My OpenAgent 配置
- `AGENTS.md`：Agent 指令文件
- `~/.agents/`：自定义 Agent 和 Skill 目录
- `auth.json`：认证信息（登录状态等）
- `connected-providers.json`：已连接的 Provider 配置

### 新机器恢复

在新机器上恢复配置：

```bash
# 解压配置文件到用户目录
tar -xzf opencode-migration.tar.gz -C ~/

# 进入 OpenCode 配置目录并安装依赖
cd ~/.config/opencode && npm install
```

### 迁移后验证

```bash
# 验证 OpenCode 版本
opencode --version

# 检查配置文件是否正确恢复
ls -la ~/.config/opencode/

# 测试 Agent 是否正常
opencode agent list
```

### 注意事项

- **认证信息**：`auth.json` 包含登录凭证，迁移后可能需要重新登录
- **路径差异**：如果新机器用户名不同，需要调整配置文件中的路径
- **依赖版本**：建议在新机器上使用相同或更新的 Node.js 版本
- **权限问题**：确保解压后的文件权限正确（`chmod 600 ~/.local/share/opencode/auth.json`）

### Windows 系统迁移

Windows 下的 OpenCode 配置文件路径与 Linux/macOS 不同，需要使用 PowerShell 命令进行迁移。

#### 源机器打包（PowerShell）

```powershell
# 创建临时目录存放配置文件
$tempDir = "$env:TEMP\opencode-migration"
New-Item -ItemType Directory -Path $tempDir -Force

# 复制配置文件到临时目录
Copy-Item "$env:USERPROFILE\.config\opencode\opencode.json" $tempDir -ErrorAction SilentlyContinue
Copy-Item "$env:USERPROFILE\.config\opencode\oh-my-openagent.json" $tempDir -ErrorAction SilentlyContinue
Copy-Item "$env:USERPROFILE\.config\opencode\AGENTS.md" $tempDir -ErrorAction SilentlyContinue
Copy-Item "$env:USERPROFILE\.agents" "$tempDir\.agents" -Recurse -ErrorAction SilentlyContinue
Copy-Item "$env:USERPROFILE\.local\share\opencode\auth.json" $tempDir -ErrorAction SilentlyContinue
Copy-Item "$env:USERPROFILE\.cache\oh-my-opencode\connected-providers.json" $tempDir -ErrorAction SilentlyContinue

# 压缩为 zip 文件
Compress-Archive -Path "$tempDir\*" -DestinationPath "$env:USERPROFILE\Desktop\opencode-migration.zip"

# 清理临时目录
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "配置已打包到: $env:USERPROFILE\Desktop\opencode-migration.zip"
```

#### 新机器恢复（PowerShell）

```powershell
# 解压配置文件
$zipPath = "$env:USERPROFILE\Desktop\opencode-migration.zip"
$extractPath = "$env:USERPROFILE"

Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

# 进入 OpenCode 配置目录并安装依赖
Set-Location "$env:USERPROFILE\.config\opencode"
npm install

Write-Host "配置恢复完成！"
```

#### Windows 配置文件路径

| 文件/目录  | Windows 路径                                    |
| ---------- | ----------------------------------------------- |
| 主配置目录 | `%USERPROFILE%\.config\opencode\`               |
| Agent 目录 | `%USERPROFILE%\.agents\`                        |
| 认证信息   | `%USERPROFILE%\.local\share\opencode\auth.json` |
| 缓存目录   | `%USERPROFILE%\.cache\oh-my-opencode\`          |

#### 验证迁移（PowerShell）

```powershell
# 检查配置文件是否存在
Test-Path "$env:USERPROFILE\.config\opencode\opencode.json"
Test-Path "$env:USERPROFILE\.agents"

# 查看配置目录内容
Get-ChildItem "$env:USERPROFILE\.config\opencode\"

# 验证 OpenCode 版本
opencode --version
```

#### 使用 tar 命令（Windows 10+）

Windows 10 及更高版本内置了 tar 命令，也可以使用与 Linux/macOS 相同的方式：

```powershell
# 打包
tar -czf opencode-migration.tar.gz -C $env:USERPROFILE .config/opencode/opencode.json .config/opencode/oh-my-openagent.json .config/opencode/AGENTS.md .agents .local/share/opencode/auth.json .cache/oh-my-opencode/connected-providers.json

# 解压
tar -xzf opencode-migration.tar.gz -C $env:USERPROFILE
```

#### 注意事项

- **路径分隔符**：Windows 使用反斜杠 `\`，但 PowerShell 也支持正斜杠 `/`
- **权限**：确保对配置目录有读写权限
- **隐藏文件**：`.config`、`.agents` 等是隐藏目录，需显示隐藏文件才能看到
- **npm 依赖**：恢复后需运行 `npm install` 安装依赖



# OpenCode 插件

## oh-my-openagent 使用教程

**Oh My OpenAgent**（简称 **OmO**）是一个开源的 AI 编程助手增强插件，前身叫 `oh-my-opencode`。

oh-my-openagent 运行在 OpenCode这个 AI 编程工具之上，把它变成一个由 **11 个专业 AI Agent** 组成的开发团队。

用一句话解释：

> **你发一个需求 → OmO 自动调度多个 AI 并行工作 → 比单个 AI 快数倍**

目前在 GitHub 上有 **54k+ Stars**，是最受欢迎的 OpenCode 插件。

- Github 地址：https://github.com/code-yeongyu/oh-my-openagent
- 官网：https://ohmyopenagent.com/zh

### 安装

将以下提示词复制粘贴到你的大模型工具（ OpenCode、Claude Code、AmpCode、Cursor 等）：

```
按照此链接说明安装并配置 oh-my-opencode：https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/refs/heads/dev/docs/guide/installation.md
```

执行后，它就会自己安装好，安装过程可能有 API key 的配置选项，可以选择配置，也可以不配置：



## 认识 11 位 AI 团队成员（Agent）

OmO 内置了 11 个专门的 Agent，各司其职：

### 核心 Agent

| Agent          | 角色               | 默认模型              | 什么时候用                         |
| :------------- | :----------------- | :-------------------- | :--------------------------------- |
| **Sisyphus**   | 主协调者、全能开发 | Claude Opus           | 所有任务的入口，自动调度其他 Agent |
| **Prometheus** | 战略规划师         | Claude Opus / GPT-5.4 | 复杂任务的计划制定                 |
| **Atlas**      | 待办任务管理       | Kimi K2.5             | 跟踪多步骤任务进度                 |

### 专业 Agent

| Agent          | 角色              | 默认模型      | 擅长什么                         |
| :------------- | :---------------- | :------------ | :------------------------------- |
| **Hephaestus** | 深度自主工作者    | GPT-5.3-codex | 长时间、高强度的独立编码任务     |
| **Oracle**     | 架构顾问/调试专家 | GPT-5.4       | 系统设计、疑难 bug 定位          |
| **Momus**      | 高精度审查员      | GPT-5.4       | 代码 review、输出验证            |
| **Metis**      | 计划评审          | Claude Opus   | 检查 Prometheus 的计划是否有遗漏 |

### 工具型 Agent（快速、低成本）

| Agent                 | 角色           | 默认模型                 | 为什么用便宜模型                 |
| :-------------------- | :------------- | :----------------------- | :------------------------------- |
| **Explore**           | 代码库快速搜索 | MiniMax / Grok Code Fast | 搜索任务不需要高智能，速度更重要 |
| **Librarian**         | 文档/代码检索  | MiniMax（免费）          | 文档检索不需要深度推理           |
| **Multimodal Looker** | 截图/视觉分析  | Kimi K2.5                | Kimi 擅长多模态理解              |

> 💡 **新手提示**：你不需要手动选择 Agent。Sisyphus 会根据你的任务类型自动调度合适的 Agent 组合。

## 三种工作模式

### 模式一：ultrawork（最轻松）

在提示词里加 `ultrawork` 或 `ulw`，一切自动化：

```
ultrawork 帮我把这个 React 组件改成 TypeScript
```

适合：日常开发任务，希望 AI 全自动完成的场景。

### 模式二：Prometheus 计划模式（最精准）

按 **Tab 键** 进入 Prometheus 模式。AI 会先通过问答了解你的需求，生成详细执行计划，确认后再开始执行。

流程：

1. 按 `Tab` 切换到 Prometheus 模式
2. 描述你的需求，AI 会问你一些澄清问题
3. AI 生成执行计划，你确认
4. 输入 `/start-work` 开始执行

适合：复杂功能开发、架构重构等需要精确规划的场景。

### 模式三：普通对话（最灵活）

直接输入你的问题或需求，不加任何关键词：

```
解释一下 src/auth.ts 里的 JWT 验证逻辑
```

适合：问问题、代码解释、小修改等轻量任务。



## 配置文件详解

OmO 有两个配置文件，优先级不同：

- 项目级配置（优先级更高）：**.opencode/oh-my-opencode.jsonc**
- 用户级配置（全局默认）：**~/.config/opencode/oh-my-opencode.jsonc**

配置文件支持注释（JSONC 格式），也支持 JSON Schema 自动补全：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json",

  "agents": {
    // 主协调 Agent，官方建议用 Claude Opus 系列
    "sisyphus": {
      "model": "anthropic/claude-opus-4-6"
    },
    // 架构顾问，官方建议用 GPT 系列
    "Hephaestus": {
      "model": "openai/gpt-5.4",
      "variant": "high"
    }
  }
}
```

> **新手建议**：安装完成后先不要修改配置，默认设置已经很好。

## 常用命令

在对话界面内：

| 快捷键/命令         | 说明                               |
| :------------------ | :--------------------------------- |
| `Tab`               | 切换到 Prometheus 计划模式         |
| `/start-work`       | 在 Prometheus 模式下开始执行计划   |
| `ultrawork` / `ulw` | 在提示词里加上，激活全功能并行模式 |

