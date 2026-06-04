---
title: OpenCode
date: 2026-06-04 10:34:02
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
