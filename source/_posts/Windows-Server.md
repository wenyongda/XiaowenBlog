---
title: Windows Server
date: 2025-07-21 10:53:55
tags: [Windows Server, Windows, 服务器, IIS]
categories: [操作系统, Windows]
---

# Web Deploy 部署任务失败解决方案

## 报错信息：

```shell
C:\Program Files\dotnet\sdk\9.0.302\Sdks\Microsoft.NET.Sdk.Publish\targets\PublishTargets\Microsoft.NET.Sdk.Publish.MSDeploy.targets(140,5): 错误 : Web 部署任务失败。
((2025/7/21 10:43:25)在远程计算机上处理请求时出错。)
(2025/7/21 10:43:25)在远程计算机上处理请求时出错。
无法执行此操作。请与服务器管理员联系，检查授权和委派设置。
```

## 解决方法：

计算机管理

![image-20250721105643718](https://rustfs.wenyongdalucky.club:443/hexo/image-20250721105643718.png)

![image-20250721105806368](https://rustfs.wenyongdalucky.club:443/hexo/image-20250721105806368.png)

之后打开服务，找到Web 部署代理服务，重新启动一下

![image-20250721111012495](https://rustfs.wenyongdalucky.club:443/hexo/image-20250721111012495.png)

# IIS(Internet Information Services)

## 优化回收策略

![](https://rustfs.wenyongdalucky.club:443/hexo/image-20250806145506751.png)

- 回收 > 固定时间间隔（分钟）

  一个时间段，超过该时间段，应用程序池将回收。值为 0 ，则应用程序池不会按固定间隔回收

  默认值：1740分钟，29小时

  优化设置：改为0 。因为无法避免在高峰期发生回收。同时设置“回收 > 特定时间”

- 回收 > 特定时间

  应用程序池进行回收的一组特定的本地时间（24小时制）

  优化设置：固定在低峰期时回收。eg：设定为 04:00 、15:30 等

  另外，也可以使用windows计划任务实现iis站点每周六晚定时回收

- 进程模型 > 闲置超时（分钟）

  一个时间段，设定工作进程允许保持闲置状态的最大时间间隔，超过该时间就会自动关闭。

  优化设置：改为0，避免内存信息频繁被回收清空。同时设置“回收 > 特定时间”

- 进程模型 > 空闲超时操作

  默认是“Terminate”（另一个选项是“Suspend”）。

  Terminate 表示一旦超时就终止服务，并回收工作进程的缓冲区的内存；

  Suspend 则悬停等待，暂不回收缓冲区内存。

# Windows 运行命令

## 进入Windows 设置

```cmd
ms-settings:
```

## 远程桌面连接

```cmd
mstsc
```

### 本地组策略编辑器

```cmd
gpedit.msc
```

## 服务

```cmd
services.msc
```

## 设备管理器

```cmd
devmgmt.msc
```

## 控制面板

```cmd
control
```

## 注册表编辑器

```cmd
regedit
```

# PowerShell

## 激活工具命令

```powershell
irm https://massgrave.dev/get | iex
```

# CMD

## 7zip

### 解压压缩包内的部分文件或目录到指定目录下

```cmd
"C:\Users\yun\AppData\Local\Microsoft\WindowsApps\7z.exe" x "D:\source\source.7z" -o"D:" "source\repos\ruoyi-ai\*"
```

**详细解释：**

- `"C:\Users\yun\AppData\Local\Microsoft\WindowsApps\7z.exe"`: 这是 7-Zip 可执行文件的完整路径。
- `x`: 解压命令，会保留压缩包内的目录结构。
- `"D:\source\source.7z"`: 要解压的源压缩包的完整路径。
- `-o"D:"`: 这是指定**目标解压目录**。所有从压缩包中解压出来的内容都会放到这个目录下。
  - **注意：** `-o` 后面直接跟目标文件夹的完整路径，不带 `*`。
- `"source\repos\ruoyi-ai\*"`: 这是**压缩包内部想要解压的目录名称**。请确保这个名称与压缩包内的实际目录名完全一致（大小写敏感）。

# Shawl - Windows 服务封装工具

Shawl 是一个用 Rust 编写的 Windows 服务封装工具，可以将任意程序转换为 Windows 服务运行。

## 安装方式

### 下载预编译版本

从 [GitHub Releases](https://github.com/mtkennerly/shawl/releases) 下载可执行文件，放置到任意目录即可使用。

### Scoop 安装

```powershell
scoop bucket add extras
scoop install shawl
```

### Winget 安装

```powershell
winget install -e --id mtkennerly.shawl
```

### Cargo 安装（需要 Rust 环境）

```powershell
cargo install --locked shawl
```

## 基本使用

### 创建服务

使用 Shawl 的 `add` 命令创建服务（`--` 分隔 Shawl 参数和要运行的命令）：

```powershell
shawl add --name my-app -- C:/path/my-app.exe
```

使用 Windows `sc` 命令创建（更精细控制）：

```powershell
sc create my-app binPath= "C:/path/shawl.exe run --name my-app -- C:/path/my-app.exe"
```

### 配置服务

```powershell
# 设置自动启动
sc config my-app start= auto

# 启动服务
sc start my-app

# 停止服务
sc stop my-app

# 删除服务
sc delete my-app
```

## 重启策略配置

Shawl 默认在程序非零退出码时自动重启，可通过参数自定义：

```powershell
# 始终重启（适合关键服务）
shawl add --name my-service --restart -- C:/app/myapp.exe

# 永不重启
shawl add --name my-service --no-restart -- C:/app/myapp.exe

# 仅特定退出码时重启（如 1, 2, 3）
shawl add --name my-service --restart-if 1,2,3 -- C:/app/myapp.exe

# 除特定退出码外都重启（如排除成功码 0）
shawl add --name my-service --restart-if-not 0 -- C:/app/myapp.exe
```

## 常用参数

| 参数 | 说明 |
|------|------|
| `--name <name>` | 服务名称 |
| `--cwd <dir>` | 设置工作目录（默认为 `C:\Windows\System32`） |
| `--stop-timeout <ms>` | 停止等待时间，默认 3000 毫秒 |
| `--no-log` | 禁用所有日志 |
| `--no-log-cmd` | 禁用命令输出日志 |
| `--pass <code>` | 将指定退出码视为成功而非错误 |

## 设置服务账户

默认服务以 Local System 账户运行（权限较高）。建议使用 Network Service 等受限账户：

```powershell
# 先授予 Network Service 对 Shawl 目录的读写执行权限
# 然后配置服务账户
sc config my-app obj= "NT AUTHORITY\Network Service" password= ""
```

## 日志位置

Shawl 在其所在目录生成日志文件：`shawl_for_<服务名>_*.log`

默认日志限制：单文件最大 2MB，保留 2 个轮转副本。

## 与 WinSW/NSSM 的区别

Shawl 不需要特殊的安装命令来准备服务，可以直接通过 MSI 的 `ServiceInstall` 或 `sc create` 配置，更适合自动化部署场景。

## 实际示例：SSH SOCKS 代理服务

将 SSH 动态端口转发（SOCKS 代理）配置为 Windows 服务：

```powershell
C:\tools\shawl.exe add --name "SSH_SOCKS_Proxy" -- `
  "C:\Windows\System32\OpenSSH\ssh.exe" `
  -i "C:\ProgramData\SSH_Shawl\id_rsa" `
  -D 1080 `
  -N `
  -o ServerAliveInterval=60 `
  -o ServerAliveCountMax=3 `
  -o StrictHostKeyChecking=no `
  root@42.93.8.7
```

**参数说明：**

| 参数 | 说明 |
|------|------|
| `-i "id_rsa"` | 指定私钥文件路径（免密登录） |
| `-D 1080` | 在本地 1080 端口开启 SOCKS 代理 |
| `-N` | 不执行远程命令，仅建立连接 |
| `ServerAliveInterval=60` | 每 60 秒发送心跳保活 |
| `ServerAliveCountMax=3` | 3 次心跳无响应则断开 |
| `StrictHostKeyChecking=no` | 自动接受新主机密钥 |

**启动服务：**

```powershell
sc start SSH_SOCKS_Proxy
```

**使用代理：**

配置浏览器或应用程序使用 `127.0.0.1:1080` 作为 SOCKS5 代理即可。

# Windows Server 2019
