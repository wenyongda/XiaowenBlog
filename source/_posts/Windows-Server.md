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

> **兼容性说明：** Shawl 依赖较新的 Windows API，**不兼容 Windows Server 2008 R2**。如果你的服务器是 2008 R2，建议使用 [NSSM](#nssm---windows-服务封装工具gui-方式)。

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

| 参数                  | 说明                                         |
| --------------------- | -------------------------------------------- |
| `--name <name>`       | 服务名称                                     |
| `--cwd <dir>`         | 设置工作目录（默认为 `C:\Windows\System32`） |
| `--stop-timeout <ms>` | 停止等待时间，默认 3000 毫秒                 |
| `--no-log`            | 禁用所有日志                                 |
| `--no-log-cmd`        | 禁用命令输出日志                             |
| `--pass <code>`       | 将指定退出码视为成功而非错误                 |

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

| 参数                       | 说明                            |
| -------------------------- | ------------------------------- |
| `-i "id_rsa"`              | 指定私钥文件路径（免密登录）    |
| `-D 1080`                  | 在本地 1080 端口开启 SOCKS 代理 |
| `-N`                       | 不执行远程命令，仅建立连接      |
| `ServerAliveInterval=60`   | 每 60 秒发送心跳保活            |
| `ServerAliveCountMax=3`    | 3 次心跳无响应则断开            |
| `StrictHostKeyChecking=no` | 自动接受新主机密钥              |

将 Nginx 1.25.2 配置为 Windows 服务：

```powershell
C:\tools\shawl.exe add `
  --name "Nginx 1.25.2" `
  --cwd "D:\Program Files (x86)\nginx-1.25.2" `
  --log-dir "D:\Program Files (x86)\nginx-1.25.2\logs" `
  --restart `
  --kill-process-tree `
  --stop-timeout 5000 `
  -- `
  nginx.exe
```

**参数说明：**

| 参数                    | 说明                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `--name "Nginx 1.25.2"` | 服务名称（可自定义）                                                                                             |
| `--cwd <dir>`           | 设置 Nginx 工作目录为其安装目录，确保 nginx.exe 能正确读取配置文件与日志路径                                     |
| `--log-dir <dir>`       | **日志输出目录（不是文件路径）。** 将 Shawl 日志输出到指定目录，Shawl 会自动生成 `shawl_for_<服务名>_*.log` 文件 |
| `--restart`             | Nginx 进程退出时自动重启，确保持续运行                                                                           |
| `--kill-process-tree`   | 停止服务时终止整个进程树，防止残留子进程（如 nginx worker 进程未被完全关闭）                                     |
| `--stop-timeout <ms>`   | 等待 Nginx 优雅退出的超时时间（5000 毫秒），超时后强制终止                                                       |
| `--`                    | 分隔符，分隔 Shawl 自身参数与要运行的命令                                                                        |
| `nginx.exe`             | Shawl 托管运行的 Nginx 可执行文件                                                                                |

由于 Shawl 通过 `sc` 注册服务时，服务名中不能包含空格。如直接运行会报错 `The parameter is incorrect`。因此推荐先通过 `shawl add` 创建服务（期间会要求以管理员身份运行），然后通过 `sc` 管理：

```powershell
# 启动服务
sc start "Nginx 1.25.2"

# 停止服务
sc stop "Nginx 1.25.2"

# 设置开机自启
sc config "Nginx 1.25.2" start= auto

# 删除服务
sc delete "Nginx 1.25.2"
```

> **注意：** 如果通过 `sc create` 直接注册，请使用 `binPath=` 且 `--name` 值中避免空格；或使用 `shawl add` 创建（它会处理好这些问题）。

# NSSM - Windows 服务封装工具（GUI 方式）

[NSSM (Non-Sucking Service Manager)](https://nssm.cc) 是一个老牌的 Windows 服务封装工具，提供图形界面操作，适合不熟悉命令行的场景。兼容性极好，**Windows Server 2008 R2 及更高版本均可使用**。

> 注：原 nssm.cc 已停止维护，推荐使用社区维护分支 [fawno/nssm.cc](https://github.com/fawno/nssm.cc)。

## 下载

- 下载地址：[https://github.com/fawno/nssm.cc/releases/tag/v2.24.1](https://github.com/fawno/nssm.cc/releases/tag/v2.24.1)
- 下载 `nssm-2.24.1.zip`，解压后根据系统架构选择 `win32/nssm.exe` 或 `win64/nssm.exe`

## 使用步骤

将 nginx.exe 注册为 Windows 服务并配置自动重启：

```bat
:: 1. 解压到固定目录
:: 例如：D:\tools\nssm-2.24\win64\nssm.exe

:: 2. 以管理员身份打开 CMD，注册 Nginx 服务
D:\tools\nssm-2.24\win64\nssm.exe install "Nginx 1.29.8"

:: 3. 在弹出的 GUI 界面填写：
::    - Application → Path: D:\Program Files (x86)\nginx-1.29.8\nginx.exe
::    - Application → Startup directory: D:\Program Files (x86)\nginx-1.29.8
::    - Details → Display name: Nginx 1.29.8
::    - Details → Description: Nginx 1.29.8 via NSSM (Win2008R2)
::    - Shutdown → Console control handler: 勾选
::    - Exit actions → Restart on failure: 勾选

:: 4. 点击 "Install service" 完成注册

:: 5. 启动服务
sc start "Nginx 1.29.8"
```

**GUI 字段说明：**

| 区域         | 字段                    | 说明                                                                    |
| ------------ | ----------------------- | ----------------------------------------------------------------------- |
| Application  | Path                    | nginx.exe 可执行文件路径                                                |
| Application  | Startup directory       | Nginx 工作目录（确保读取配置、日志路径正确）                            |
| Details      | Display name            | 服务列表中显示的名称（如 `Nginx 1.29.8`），仅用于标识，不影响 `sc` 命令 |
| Details      | Description             | 服务描述信息                                                            |
| Shutdown     | Console control handler | 勾选后 NSSM 通过 Ctrl+C 信号优雅关闭 nginx，而非直接杀进程              |
| Exit actions | Restart on failure      | 进程异常退出时自动重启                                                  |

> **Service Name 与 Display Name 的区别：**
>
> - **Service Name**（`Nginx 1.29.8`）— 即 `nssm.exe install "Nginx 1.29.8"` 中指定的名称，是服务的**系统标识**，用于 `sc start/stop/config/delete` 等命令操作。Windows 不允许存在两个同名 Service Name。
> - **Display Name**（`Nginx 1.29.8`）— 仅在 `services.msc` 服务管理器中显示，纯展示用途，可包含空格和中文。多个服务可以有相同的 Display Name（但不建议）。
>
> 简单来说：`sc` 命令认的是 Service Name，服务列表界面看到的是 Display Name。

## 服务管理命令

```bat
:: 启动
sc start "Nginx 1.29.8"

:: 停止
sc stop "Nginx 1.29.8"

:: 设置开机自启
sc config "Nginx 1.29.8" start= auto

:: 删除服务（需先停止）
sc delete "Nginx 1.29.8"

:: 如要修改配置，重新运行 install 命令即可（会弹出 GUI 编辑）
D:\tools\nssm-2.24\win64\nssm.exe install "Nginx 1.29.8"
```

## NSSM vs Shawl

| 对比项     | NSSM                      | Shawl                             |
| ---------- | ------------------------- | --------------------------------- |
| 操作方式   | 提供 GUI 界面，也可命令行 | 纯命令行                          |
| 配置修改   | 重新运行 install 编辑     | 需删除服务重新添加                |
| 日志管理   | 内置日志重定向到文件      | 自动生成 `shawl_for_<name>_*.log` |
| 进程树清理 | 默认处理子进程            | 需显式指定 `--kill-process-tree`  |
| 最小系统   | Windows Server 2008 R2+    | Windows 10 / Server 2012 R2+      |
| 适用场景   | 运维人员手动配置          | 自动化部署脚本                    |
