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

# 开发驱动器 (Dev Drive)

开发驱动器是 Windows 11 提供的一种新存储卷形式，基于 ReFS (Resilient File System) 技术构建，针对开发工作负载进行了文件系统优化，可显著提升编译、包恢复等开发操作的性能。

> **适用场景：** 源代码仓库、包缓存（npm/NuGet/pip/Cargo 等）、构建输出和中间文件。

## 先决条件

- Windows 11 版本 10.0.22621.2338 或更高版本
- 建议 16 GB 内存（至少 8 GB，ReFS 比 NTFS 占用更多内存）
- 最小 50 GB 可用磁盘空间
- 本地管理员权限

> **注意：** 不能将 C: 驱动器指定为开发驱动器。开发人员工具（如 Visual Studio、.NET SDK）应保留在 C: 盘。

## 创建方式

### 方式一：通过 Windows 设置

1. 打开 **设置 > 系统 > 存储 > 高级存储设置 > 磁盘和卷**
2. 选择 **创建开发人员驱动器**
3. 选择创建方式：
   - **创建新的 VHD**：在虚拟硬盘上创建（推荐，灵活易管理）
   - **调整现有卷的大小**：从现有分区划分空间
   - **使用未分配空间**：利用磁盘上已有的未分配空间

### 方式二：通过命令行

以管理员身份运行：

```powershell
# 使用 Format 命令
Format D: /DevDrv /Q

# 或使用 PowerShell
Format-Volume -DriveLetter D -DevDrive
```

> 将 `D:` 替换为实际驱动器号。

## 磁盘分区 vs VHD

| 对比项     | 磁盘分区               | VHD（推荐）                     |
| ---------- | ---------------------- | ------------------------------- |
| 性能       | 更快（直接访问物理磁盘）| 略有开销（虚拟磁盘层）          |
| 灵活性     | 调整大小复杂且风险大   | 支持动态扩展，易于管理          |
| 可移植性   | 与物理磁盘绑定         | VHD 文件可复制、移动、备份      |
| 适用场景   | 追求极致性能           | 需要灵活管理或多设备使用        |

## 信任与安全性

开发驱动器默认使用 Microsoft Defender **性能模式**，在安全性和性能之间取得平衡。

### 设置为受信任驱动器

受信任的驱动器启用性能模式（推荐），不受信任的驱动器使用实时保护模式（性能较低）。

```powershell
# 以管理员身份运行 PowerShell

# 设置为受信任
fsutil devdrv trust D:

# 查询信任状态
fsutil devdrv query D:
```

> **重要：** 将开发驱动器移动到其他计算机后，需要重新设置信任。

### 防病毒筛选器配置

```powershell
# 允许特定筛选器（适用于所有开发驱动器）
fsutil devdrv setfiltersallowed "Filter-01, Filter-02"

# 禁用防病毒筛选器（不推荐，存在安全风险）
fsutil devdrv enable /disallowAv

# 重新启用防病毒筛选器
fsutil devdrv enable /allowAv
```

### 常用筛选器列表

| 场景                           | 筛选器名称                                    |
| ------------------------------ | --------------------------------------------- |
| Docker 容器                    | `bindFlt`, `wcifs`                            |
| Windows Defender               | `WdFilter`（默认附加）                        |
| Microsoft Defender for Endpoint | `MsSecFlt`                                    |
| GVFS (Git 虚拟文件系统)        | `PrjFlt`                                      |
| 进程监视器 (ProcMon)           | `ProcMon24`                                   |
| Windows 升级                   | `WinSetupMon`（若 TEMP 在开发驱动器上则需要） |

## 包缓存迁移

将常用包缓存迁移到开发驱动器以获得最佳性能：

### npm (Node.js)

```powershell
# 创建缓存目录
mkdir D:\packages\npm

# 设置环境变量
setx /M npm_config_cache D:\packages\npm

# 迁移现有缓存（如已安装）
robocopy %AppData%\npm-cache D:\packages\npm /E
```

### NuGet (.NET)

```powershell
# 创建缓存目录
mkdir D:\packages\nuget

# 设置环境变量
setx /M NUGET_PACKAGES D:\packages\nuget

# 验证设置
dotnet nuget locals global-packages --list
```

### pip (Python)

```powershell
# 创建缓存目录
mkdir D:\packages\pip

# 设置环境变量
setx /M PIP_CACHE_DIR D:\packages\pip

# 迁移现有缓存
robocopy %LocalAppData%\pip\Cache D:\packages\pip /E
```

### Cargo (Rust)

```powershell
# 创建缓存目录
mkdir D:\packages\cargo

# 设置环境变量
setx /M CARGO_HOME D:\packages\cargo

# 迁移现有缓存
robocopy %USERPROFILE%\.cargo D:\packages\cargo /E
```

### Maven (Java)

```powershell
# 创建缓存目录
mkdir D:\packages\maven

# 设置环境变量
setx /M MAVEN_OPTS "-Dmaven.repo.local=D:\packages\maven"

# 迁移现有缓存
robocopy %USERPROFILE%\.m2\repository D:\packages\maven /E
```

### Gradle (Java)

```powershell
# 创建缓存目录
mkdir D:\packages\gradle

# 设置环境变量
setx /M GRADLE_USER_HOME D:\packages\gradle

# 迁移现有缓存
robocopy %USERPROFILE%\.gradle D:\packages\gradle /E
```

## 使用链接迁移包缓存

### 获取缓存默认目录

```powershell
# npm 缓存目录
npm config get cache

# yarn 缓存目录
yarn cache dir

# pnpm 缓存目录
pnpm store path

# NuGet 全局包目录
dotnet nuget locals global-packages -l

# pip 缓存目录
pip cache dir
```

### 使用 Junction/Symlink 迁移

除了设置环境变量外，还可以使用 **目录联接 (Junction)** 或 **符号链接 (Symlink)** 将缓存目录迁移到开发驱动器，同时保持原有路径不变。

> **优势：** 无需修改环境变量，对应用程序完全透明，兼容性更好。

### 操作步骤

1. **迁移现有缓存**：使用 `robocopy` 将原目录内容移动到开发驱动器
2. **创建链接**：在原位置创建指向新位置的 Junction/Symlink

### pnpm 缓存

```powershell
# 迁移 pnpm 全局存储
robocopy "C:\Users\你的用户名\.pnpm-store" "D:\Caches\.pnpm-store" /E /MOVE /R:3 /W:10

# 创建目录联接
New-Item -ItemType Junction -Path "C:\Users\你的用户名\.pnpm-store" -Target "D:\Caches\.pnpm-store"
```

### JetBrains 缓存

```powershell
# 迁移 JetBrains 缓存（IDE 配置、索引等）
robocopy "C:\Users\你的用户名\AppData\Local\JetBrains" "D:\Caches\JetBrains" /E /MOVE /R:3 /W:10

# 创建目录联接
New-Item -ItemType Junction -Path "C:\Users\你的用户名\AppData\Local\JetBrains" -Target "D:\Caches\JetBrains"
```

### npm 缓存

```powershell
# 迁移 npm 缓存
robocopy "C:\Users\你的用户名\AppData\Local\npm-cache" "D:\Caches\npm-cache" /E /MOVE /R:3 /W:10

# 创建目录联接
New-Item -ItemType Junction -Path "C:\Users\你的用户名\AppData\Local\npm-cache" -Target "D:\Caches\npm-cache"
```

### NuGet 缓存

```powershell
# 迁移 NuGet 全局包
robocopy "C:\Users\你的用户名\.nuget\packages" "D:\Caches\nuget-packages" /E /MOVE /R:3 /W:10

# 创建目录联接
New-Item -ItemType Junction -Path "C:\Users\你的用户名\.nuget\packages" -Target "D:\Caches\nuget-packages"
```

### pip 缓存

```powershell
# 迁移 pip 缓存
robocopy "C:\Users\你的用户名\AppData\Local\pip\Cache" "D:\Caches\pip-cache" /E /MOVE /R:3 /W:10

# 创建目录联接
New-Item -ItemType Junction -Path "C:\Users\你的用户名\AppData\Local\pip\Cache" -Target "D:\Caches\pip-cache"
```

### TEMP 目录

```powershell
# 迁移临时文件目录（可选，需添加 WinSetupMon 筛选器）
robocopy "$env:TEMP" "D:\Caches\TEMP" /E /MOVE /R:3 /W:10

# 创建目录联接
New-Item -ItemType Junction -Path "$env:TEMP" -Target "D:\Caches\TEMP"

# 添加 Windows 升级所需的筛选器
fsutil devdrv setfiltersallowed WinSetupMon
```

### robocopy 参数说明

| 参数    | 说明                                   |
| ------- | -------------------------------------- |
| `/E`    | 复制子目录，包括空目录                 |
| `/MOVE` | 移动文件和目录（复制后删除源）         |
| `/R:3`  | 失败时重试 3 次                        |
| `/W:10` | 重试之间等待 10 秒                     |

### Junction vs Symlink

| 类型         | 说明                                       | 需要管理员权限 |
| ------------ | ------------------------------------------ | -------------- |
| Junction     | 目录联接，仅支持本地目录                   | 否             |
| Symlink      | 符号链接，支持文件和远程路径               | 是（默认）     |

> **推荐使用 Junction：** 开发场景下 Junction 兼容性更好，且不需要管理员权限创建。

### 验证链接

```powershell
# 查看链接指向
Get-Item "C:\Users\你的用户名\.pnpm-store" | Select-Object FullName, LinkType, Target

# 或使用 dir 命令
cmd /c dir "C:\Users\你的用户名" /AL

# 查看目录是否为链接（Junction/Symlink）
(Get-Item "C:\Users\你的用户名\.pnpm-store").Attributes -match "ReparsePoint"

# 批量检查常用缓存目录是否为链接
@(
  "$env:USERPROFILE\.pnpm-store",
  "$env:USERPROFILE\AppData\Local\JetBrains",
  "$env:USERPROFILE\AppData\Local\npm-cache",
  "$env:USERPROFILE\.nuget\packages",
  "$env:USERPROFILE\AppData\Local\pip\Cache"
) | ForEach-Object {
    $item = Get-Item $_ -ErrorAction SilentlyContinue
    [PSCustomObject]@{
        Path = $_
        IsLink = ($item.Attributes -match "ReparsePoint")
        Target = $item.Target
    }
}
```

## 限制与注意事项

- **不支持的场景：**
  - 可移动/热插拔磁盘（USB、外部驱动器）
  - 动态磁盘（请使用存储空间代替）
  - C: 驱动器
  
- **内存占用：** ReFS 比 NTFS 使用更多内存，建议至少 8 GB，推荐 16 GB

- **VHD 注意事项：**
  - 固定磁盘上的 VHD 不建议复制，应移动后重新挂载
  - 移动到新计算机后需重新指定为开发驱动器并配置筛选器策略

- **WSL 兼容性：** 可从 WSL 访问开发驱动器上的文件，但不会有性能提升。ReFS 不支持 WSL metadata 装载选项。

## 删除开发驱动器

1. **设置 > 系统 > 存储 > 磁盘和卷**
2. 选择开发驱动器旁的 **属性**
3. 在格式标签下选择删除

> 如果是 VHD 创建的，删除卷后还需在磁盘管理中分离 VHD 才能删除 VHD 文件。

## 参考资料

- [在 Windows 11 上设置开发驱动器 - Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/dev-drive/)
- [利用 Dev Drive 提升 Visual Studio 和 Dev Boxes 的性能](https://devblogs.microsoft.com/visualstudio/devdriveperf/)
