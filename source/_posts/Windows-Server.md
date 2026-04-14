---
title: Windows Server
date: 2025-07-21 10:53:55
tags:
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

# Windows Server 2019
