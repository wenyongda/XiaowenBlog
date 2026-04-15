---
title: .NET
date: 2025-07-22 10:32:51
tags: [.NET, NuGet, 框架]
categories: [编程语言, .NET]
---

# Nuget包管理器

## 无法联网的情况下导入包

### 使用本地文件夹作为 NuGet 源

#### 步骤 1：准备本地 NuGet 包

你需要提前从能联网的机器上下载所需的 `.nupkg` 文件。

使用命令行下载：

```powershell
.\nuget.exe install MathNet.Numerics -OutputDirectory D:\NuGetOfflinePackages -Version 5.0.0
```

这会下载包及其依赖到 `D:\NuGetOfflinePackages` 目录。

> ⚠️ 注意：有些包有多个依赖项，需要把所有 `.nupkg` 都拷贝过来。 

#### 步骤 2：将包复制到离线机器的某个目录

比如：

```
D:\NuGetOfflinePackages\
    ├── Newtonsoft.Json.13.0.3.nupkg
    ├── System.Net.Http.4.3.4.nupkg
    └── ...
```

#### 步骤 3：配置 Visual Studio 使用本地包源

1. 打开 Visual Studio。

2. 进入：**工具 (Tools) → NuGet 包管理器 → 程序包管理器设置** 。

3. 左侧选择 **NuGet 包管理器 → 程序包源** 。

4. 点击 

   \+ 

   添加新的源：

   - 名称：比如 `Local Packages`
   - 源：填写你的文件夹路径，如 `D:\NuGetOfflinePackages`

5. 点击 **更新** ，然后确定。

✅ 完成后，在“管理 NuGet 包”时就可以看到并安装本地包了。

