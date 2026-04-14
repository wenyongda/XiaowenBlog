---
title: PowerShell
date: 2023-10-07 11:25:08
tags:
---

# PowerShell 7 使用 Oh My Posh 来美化命令行

## 安装 PowerShell 7

`PowerShell 7` 指的不是系统自带的 `powershell` ，而是新下载的(微软官方出品)，当然这个教程也适用于系统自带的 `powershell`

微软官方文档地址：https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2
下载地址：https://github.com/PowerShell/PowerShell/releases
或者可通过 Winget 方式下载安装

```powershell
winget search --id Microsoft.PowerShell
```

Output

```powershell
Name               Id                           Version Source
---------------------------------------------------------------
PowerShell         Microsoft.PowerShell         7.5.4.0 winget
PowerShell Preview Microsoft.PowerShell.Preview 7.6.0.5 winget
```

使用 `--id` 参数安装 PowerShell 或 PowerShell 预览版

```powershell
winget install --id Microsoft.PowerShell --source winget
```

```powershell
winget install --id Microsoft.PowerShell.Preview --source winget
```

## 安装 Oh My Posh

官方文档地址：https://ohmyposh.dev/

最好在管理员模式下运行 `powershell`

下载安装，在 `powershell` 命令行中输入

```powershell
winget install oh-my-posh
```

在 `powershell` 命令行中输入下面命令，打开 `$Profile` 进行设置，如果系统提示不存文件，是否创建，请点击创建

```powershell
notepad $Profile
```

将以下命令添加到 `$Profile` 文件中

```powershell
oh-my-posh init pwsh | Invoke-Expression
```

应用修改，则直接在命令行中执行 `. $Profile` ，如果出现错误等问题，请尝试关闭所有 `powershell` 命令窗口，重新打开，一般都会正常显示

### 配置环境变量

配置 `POSH_THEMES_PATH` 环境变量，最好配置成系统级别的，路径在 `C:\Users\<当前登录用户>\AppData\Local\Programs\oh-my-posh\themes` 下面。

### 更改主题

在 `powerShell` 命令行中输入 `Get-ChildItem $env:POSH_THEMES_PATH` 来获取所有的已安装主题

**预览主题（官方推荐方式）：** 由于在终端里一次性渲染所有主题会很卡，官方建议直接去网页上看截图，然后记住名字即可。

- **[Oh My Posh 官方主题预览页 (Themes)](https://ohmyposh.dev/docs/themes)**

编辑 `$Profile` 文件

```powershell
notepad $Profile
```

把 `oh-my-posh init pwsh ...` 的部分後面加上 `--config "$env:POSH_THEMES_PATH/{主題名稱}.omp.json"`。
将其内部文字改为：

```powershell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/montys.omp.json" | Invoke-Expression
```

## 扩展模块

### PowerShellGet

> [PowerShellGet](https://github.com/PowerShell/PowerShellGet) 是 Windows 平台上的包管理器，主要用于管理 PowerShell 模块，但也支持其他类型的包。

以系统管理员权限打开**PowerShell**终端，执行以下命令：

```powershell
Install-Module -Name PowerShellGet -Force
```

### [posh-git](https://github.com/dahlbyk/posh-git)

> [posh-git](https://github.com/dahlbyk/posh-git)是一款用于 Windows 系统的 PowerShell 扩展模块，它主要为 Git 提供了更加丰富且人性化的命令行界面体验。

以系统管理员权限打开**PowerShell**终端，执行以下命令：

```powershell
PowerShellGet\Install-Module posh-git -Scope CurrentUser -Force
```

### [PSReadLine](https://github.com/PowerShell/PSReadLine)

> [PSReadLine](https://github.com/PowerShell/PSReadLine)用于增强命令行编辑体验的模块，提供语法高亮/命令预测/历史记录管理以及提供了丰富的快捷键和编辑命令。

以系统管理员权限打开**PowerShell**终端，执行以下命令：

```powershell
Install-Module PSReadLine -Force
```

## 编辑oh-my-posh配置文件

打开**PowerShell**终端，执行以下命令编辑配置文件 `code $PROFILE`：

```powershell
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete #Tab键会出现自动补全菜单
Set-PSReadlineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadlineKeyHandler -Key DownArrow -Function HistorySearchForward #上下方向键箭头，搜索历史中进行自动补全

oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/jandedobbeleer.omp.json" | Invoke-Expression
Import-Module posh-git # git的自动补全
```

# 文件

## 新建文件

```powershell
New-Item <文件名>.<扩展名后缀>
New-Item my.ini
```

## 删除文件

```powershell
Remove-Item <文件名>.<扩展名后缀>
Remove-Item my.ini
```

## 对文件添加内容

```powershell
Set-Content <文件名>.<扩展名后缀> -value "<内容>"
Set-Content my.ini -value ""
```

## 新建文件夹

```powershell
New-Item data -ItemType Directory
```

# 目录



# 查询版本

```powershell
$PSVersionTable
```

在输出的信息中，查看 **`PSVersion`** 这一行。

**示例输出解读：**

- **Major**: 主版本号（如 5 或 7）。
- **Minor**: 次版本号。
- 如果显示 `5.1.xxxxx`，这是 Windows 自带的 **Windows PowerShell**。
- 如果显示 `7.x.x`，这是跨平台的 **PowerShell (Core)**。

仅查看版本号（简洁）

如果你不需要其他详细信息，只想看版本号，可以使用这个命令：

```powershell
$PSVersionTable.PSVersion
```

或者使用宿主查询命令（虽然通常一致，但在某些特殊宿主环境下可能不同）：

```powershell
(Get-Host).Version
```

从 CMD (命令提示符) 查看

如果你当前在 CMD 窗口，不想进入 PowerShell 也能查看：

```powershell
powershell -command "$PSVersionTable.PSVersion"
```

### 补充说明：常见的两个主要版本

- **Windows PowerShell 5.1**：这是 Windows 10 和 Windows 11 默认自带的版本（蓝色背景图标）。微软已不再为其开发新功能，仅进行维护。
- **PowerShell 7.x**：这是微软目前主推的跨平台版本（黑色背景图标），性能更强，功能更多。

# 做 sudo 命令

在Windows系统上sudo对应的就是管理员权限了。

一般使用Powershell时，并不会管理员启动，当执行需要权限的命令（比如net start mysql），就需要以管理员打开新的窗口。

为了一步到位，这里给powershell创建一个`alias` -> `sudo` 来运行需要管理员权限的命令。

在文档目录中(在`powershell`执行`$profile`即可输出此文件路径)，新建文件夹`WindowsPowerShell`，新建文件`Microsoft.PowerShell_profile.ps1`。

> 此文件是在启动Powershell时执行的脚本。set-alias 在退出后就会失效，所以放到启动脚本中。

追加如下代码,**然后重启Powershell窗口。**

```text
function _sudo {
    $ss = "$args ; pause"
    Start-Process powershell -Verb runAs -ArgumentList $ss
}
set-alias  -name sudo -value _sudo
```

保存后发现无法加载，因为默认不加载外部脚本，管理员权限下 powershell 运行：

```text
set-ExecutionPolicy RemoteSigned
```

# 实用脚本

## 自动延长VS社区版过期时间

> 该脚本作用为 自动检查VS社区版是否在一天内过期，如是则自动延长30天
>
> 需事先从Github上Clone开源项目[beatcracker/VSCELicense: PowerShell module to get and set Visual Studio Community Edition license expiration date in registry (github.com)](https://github.com/beatcracker/VSCELicense)
>
> 然后放置在指定目录，并解除脚本执行限制，以管理员身份执行如下命令：
>
> ```powershell
> Set-ExecutionPolicy RemoteSigned
> ```
>
> 输入 A 即可

```powershell
# 加载 VSCELicense 模块
try {
    Import-Module -Name 'C:\VSCELicense\VSCELicense.psd1' -ErrorAction Stop
} catch {
    Write-Error "无法加载模块 'C:\VSCELicense\VSCELicense.psd1'，请确认路径是否正确。错误信息: $_"
    exit 1
}


# 获取许可证信息
try {
    $output = Get-VSCELicenseExpirationDate -ErrorAction Stop | Out-String
} catch {
    Write-Error "执行 Get-VSCELicenseExpirationDate 时出错: $_"
    exit 1
}

# 使用正则表达式提取版本号和过期日期
$version = $null
$expDateStr = $null

if ($output -match '(?m)^\s*(\d{4})\s+(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2}:\d{2})') {
    $version = $matches[1].Trim()
    $expDateStr = $matches[2].Trim()
    Write-Host "找到版本: $version"
    Write-Host "过期日期: $expDateStr"
} else {
    Write-Error "无法从输出中找到版本和过期日期"
    exit 1
}

# 将过期日期字符串解析为 DateTime 对象
try {
    $expirationDate = [datetime]::ParseExact($expDateStr, 'dd/MM/yyyy HH:mm:ss', $null)
} catch {
    Write-Error "日期格式解析失败: $expDateStr. 错误: $_"
    exit 1
}

# 获取当前时间并设置阈值
$currentTime = Get-Date
$threshold = $currentTime.AddDays(1)

Write-Host "当前时间: $currentTime"
Write-Host "过期时间: $expirationDate"
Write-Host "阈值时间（当前时间 + 1天）: $threshold"

# 判断是否在1天内过期 -le 表示小于等于 想起了 Mybatis-Plus 条件构造器中的 le
if ($expirationDate -le $threshold) {
    Write-Host "许可证即将过期，正在执行 Set-VSCELicenseExpirationDate 命令..."
    try {
        Set-VSCELicenseExpirationDate -Version $version -ErrorAction Stop
        Write-Host "Set-VSCELicenseExpirationDate 命令执行成功。"
    } catch {
        Write-Error "执行 Set-VSCELicenseExpirationDate 时出错: $_"
        exit 1
    }
} else {
    Write-Host "许可证未在一天内过期，无需操作。"
}
```

输出如下：

![image-20250718112238088](https://rustfs.wenyongdalucky.club:443/hexo/image-20250718112238088.png)

可结合任务计划程序进行使用，免去手动执行的烦恼

![image-20250718142611106](https://rustfs.wenyongdalucky.club:443/hexo/image-20250718142611106.png)

### 🧩 步骤 1：打开任务计划程序

1. 按下 `Win + R`，输入 `taskschd.msc`，回车。
2. 在左侧的“任务计划程序库”中，右键选择“创建任务”。

### 🧩 步骤 2：设置任务基本信息

- 常规 

  选项卡：

  - 名称：例如 `Check-VS-LicenseExpiration`
  - 描述（可选）：每天早上 7 点检查许可证过期状态
  - 勾选“不管用户是否登录都要运行”
  - 勾选“使用最高权限”

![image-20250718142545538](https://rustfs.wenyongdalucky.club:443/hexo/image-20250718142545538.png)

### 🧩 步骤 3：设置触发器

1. 切换到 **触发器** 选项卡。
2. 点击 **新建** 。
3. 设置：
   - 开始时间：`07:00:00`
   - 每天
   - 勾选“启用此触发器”
4. 点击 **确定** 。

![image-20250718142556458](https://rustfs.wenyongdalucky.club:443/hexo/image-20250718142556458.png)

### 🧩 步骤 4：设置操作

1. 切换到 **操作** 选项卡。
2. 点击 **新建** 。
3. 设置：
   - 操作：`启动程序`
   - 程序/脚本：`powershell.exe`
   - 参数（可选）：`-ExecutionPolicy RemoteSigned -File "C:\VSCELicense\Check-VS-LicenseExpiration.ps1`
   - 起始于（可选）：`C:\VSCELicense`（确保路径正确）

> ✅ **说明** ： 
>
> - `-ExecutionPolicy RemoteSigned`：允许本地脚本运行，避免执行策略限制。
> - `"C:\VSCELicense\Check-VS-LicenseExpiration.ps1"`：替换为你实际的脚本路径。
> - 如果脚本路径包含空格，请用双引号包裹。

### 🧩 步骤 5：设置条件（可选）

1. 切换到 **条件** 选项卡。
2. 可以取消勾选“只有在计算机使用交流电源时才启动此任务”，确保任务在任何电源模式下都能运行。

### 🧩 步骤 6：设置设置（可选）

1. 切换到 **设置** 选项卡。
2. 勾选“如果任务失败，按以下频率重新启动”并设置时间间隔（如每 1 分钟）。
3. 勾选“如果任务运行时间超过以下时间，则停止任务”并设置合理时间（如 1 小时）。

### 🧩 步骤 7：保存任务

1. 点击 **确定** 。
2. 如果弹出用户账户控制（UAC）提示，输入管理员凭据确认。
