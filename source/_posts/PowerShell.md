---
title: PowerShell
date: 2023-10-07 11:25:08
tags: [PowerShell, Windows, Shell, 命令行]
categories: [开发工具, Windows]
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

### [PSFzf](https://github.com/kelleymaureen/PSFzf)

> [PSFzf](https://github.com/kelleymaureen/PSFzf) 是 fzf 的 PowerShell 集成模块，提供模糊搜索历史命令和文件功能。

```powershell
# 安装 PSFzf 模块
Install-Module PSFzf -Scope CurrentUser -Force

# 安装 fzf 本体（PSFzf 的底层依赖）
winget install junegunn.fzf
```

## 终端增强配置（Starship + PSReadLine）

> 参考：[PowerShell 终端增强配置指南](https://mp.weixin.qq.com/s/DV-T4Tr4KaonFdgutuzhQQ)

### 前置准备

#### 确认 PowerShell 版本

```powershell
$PSVersionTable.PSVersion
```

- 主版本号为 `5` → 使用 **PS5.1 方案**
- 主版本号为 `7` → 使用 **PS7+ 方案**

#### 确认 Profile 文件路径

```powershell
# 查看路径
echo $PROFILE

# 若文件不存在则创建
if (!(Test-Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# 用 VSCode 打开编辑
code $PROFILE
```

> PS5.1 的 Profile 路径通常为：`C:\Users\<用户名>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
>
> PS7+ 的 Profile 路径通常为：`C:\Users\<用户名>\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`
>
> 两个版本的 Profile **互相独立**，需分别配置。

#### 设置执行策略（如遇权限报错）

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 一次性安装依赖

#### PowerShell 7+ 安装依赖

```powershell
# 1. 信任 PSGallery
Set-PSRepository -Name PSGallery -InstallationPolicy Trusted

# 2. 安装最新版 PSReadLine
Install-Module PSReadLine -Force -Scope CurrentUser

# 3. 安装 posh-git
Install-Module posh-git -Scope CurrentUser -Force

# 4. 安装 PSFzf
Install-Module PSFzf -Scope CurrentUser -Force

# 5. 安装 fzf 本体
winget install junegunn.fzf
```

#### PowerShell 5.1 安装依赖

```powershell
# 1. 信任 PSGallery
Set-PSRepository -Name PSGallery -InstallationPolicy Trusted

# 2. 安装 PSReadLine（PS5.1 最高兼容 2.3.x，必须指定版本）
Install-Module PSReadLine -RequiredVersion 2.3.4 -Force -Scope CurrentUser -SkipPublisherCheck

# 3. 安装 posh-git
Install-Module posh-git -Scope CurrentUser -Force

# 4. 安装 PSFzf
Install-Module PSFzf -Scope CurrentUser -Force

# 5. 安装 fzf 本体
winget install junegunn.fzf
```

### Starship 配置

Starship 是跨平台的提示符工具，支持 Windows、Linux、macOS。

#### 安装 Starship

```powershell
winget install --id Starship.Starship
```

#### 配置文件位置

Windows 下配置文件路径：`~/.config/starship.toml`

```powershell
# 创建配置目录和文件
mkdir -p ~/.config
New-Item -Path ~/.config/starship.toml -ItemType File -Force

# 用 VSCode 打开编辑
code ~/.config/starship.toml
```

#### 完整配置（Catppuccin Mocha 主题）

将以下内容粘贴到 `starship.toml` 文件中：

```toml
"$schema" = 'https://starship.rs/config-schema.json'

format = """
[](red)\
$os\
$username\
[](bg:peach fg:red)\
$directory\
[](bg:yellow fg:peach)\
$git_branch\
$git_status\
[](fg:yellow bg:green)\
$c\
$rust\
$golang\
$nodejs\
$bun\
$php\
$java\
$kotlin\
$haskell\
$python\
[](fg:green bg:sapphire)\
$conda\
[](fg:sapphire bg:lavender)\
$time\
[ ](fg:lavender)\
$cmd_duration\
$line_break\
$character"""

palette = 'catppuccin_mocha'

[os]
disabled = false
style = "bg:red fg:crust"

[os.symbols]
Windows = ""
Ubuntu = "󰕈"
SUSE = ""
Raspbian = "󰐿"
Mint = "󰣭"
Macos = "󰀵"
Manjaro = ""
Linux = "󰌽"
Gentoo = "󰣨"
Fedora = "󰣛"
Alpine = ""
Amazon = ""
Android = ""
AOSC = ""
Arch = "󰣇"
Artix = "󰣇"
CentOS = ""
Debian = "󰣚"
Redhat = "󱄛"
RedHatEnterprise = "󱄛"

[username]
show_always = true
style_user = "bg:red fg:crust"
style_root = "bg:red fg:crust"
format = '[ $user]($style)'

[directory]
style = "bg:peach fg:crust"
format = "[ $path ]($style)"
truncation_length = 3
truncation_symbol = "…/"

[directory.substitutions]
"Documents" = "󰈙 "
"Downloads" = " "
"Music" = "󰝚 "
"Pictures" = " "
"Developer" = "󰲋 "

[git_branch]
symbol = ""
style = "bg:yellow"
format = '[[ $symbol $branch ](fg:crust bg:yellow)]($style)'

[git_status]
style = "bg:yellow"
format = '[[($all_status$ahead_behind )](fg:crust bg:yellow)]($style)'

[nodejs]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[bun]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[c]
symbol = " "
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[rust]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[golang]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[php]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[java]
symbol = " "
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[kotlin]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[haskell]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[python]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version)(\(#$virtualenv\)) ](fg:crust bg:green)]($style)'

[docker_context]
symbol = ""
style = "bg:sapphire"
format = '[[ $symbol( $context) ](fg:crust bg:sapphire)]($style)'

[conda]
symbol = "  "
style = "fg:crust bg:sapphire"
format = '[$symbol$environment ]($style)'
ignore_base = false

[time]
disabled = false
time_format = "%R"
style = "bg:lavender"
format = '[[  $time ](fg:crust bg:lavender)]($style)'

[line_break]
disabled = false

[character]
disabled = false
success_symbol = '[❯](bold fg:green)'
error_symbol = '[❯](bold fg:red)'
vimcmd_symbol = '[❮](bold fg:green)'
vimcmd_replace_one_symbol = '[❮](bold fg:lavender)'
vimcmd_replace_symbol = '[❮](bold fg:lavender)'
vimcmd_visual_symbol = '[❮](bold fg:yellow)'

[cmd_duration]
show_milliseconds = true
format = " in $duration "
style = "bg:lavender"
disabled = false
show_notifications = true
min_time_to_notify = 45000

[palettes.catppuccin_mocha]
rosewater = "#f5e0dc"
flamingo = "#f2cdcd"
pink = "#f5c2e7"
mauve = "#cba6f7"
red = "#f38ba8"
maroon = "#eba0ac"
peach = "#fab387"
yellow = "#f9e2af"
green = "#a6e3a1"
teal = "#94e2d5"
sky = "#89dceb"
sapphire = "#74c7ec"
blue = "#89b4fa"
lavender = "#b4befe"
text = "#cdd6f4"
subtext1 = "#bac2de"
subtext0 = "#a6adc8"
overlay2 = "#9399b2"
overlay1 = "#7f849c"
overlay0 = "#6c7086"
surface2 = "#585b70"
surface1 = "#45475a"
surface0 = "#313244"
base = "#1e1e2e"
mantle = "#181825"
crust = "#11111b"

[palettes.catppuccin_frappe]
rosewater = "#f2d5cf"
flamingo = "#eebebe"
pink = "#f4b8e4"
mauve = "#ca9ee6"
red = "#e78284"
maroon = "#ea999c"
peach = "#ef9f76"
yellow = "#e5c890"
green = "#a6d189"
teal = "#81c8be"
sky = "#99d1db"
sapphire = "#85c1dc"
blue = "#8caaee"
lavender = "#babbf1"
text = "#c6d0f5"
subtext1 = "#b5bfe2"
subtext0 = "#a5adce"
overlay2 = "#949cbb"
overlay1 = "#838ba7"
overlay0 = "#737994"
surface2 = "#626880"
surface1 = "#51576d"
surface0 = "#414559"
base = "#303446"
mantle = "#292c3c"
crust = "#232634"

[palettes.catppuccin_latte]
rosewater = "#dc8a78"
flamingo = "#dd7878"
pink = "#ea76cb"
mauve = "#8839ef"
red = "#d20f39"
maroon = "#e64553"
peach = "#fe640b"
yellow = "#df8e1d"
green = "#40a02b"
teal = "#179299"
sky = "#04a5e5"
sapphire = "#209fb5"
blue = "#1e66f5"
lavender = "#7287fd"
text = "#4c4f69"
subtext1 = "#5c5f77"
subtext0 = "#6c6f85"
overlay2 = "#7c7f93"
overlay1 = "#8c8fa1"
overlay0 = "#9ca0b0"
surface2 = "#acb0be"
surface1 = "#bcc0cc"
surface0 = "#ccd0da"
base = "#eff1f5"
mantle = "#e6e9ef"
crust = "#dce0e8"

[palettes.catppuccin_macchiato]
rosewater = "#f4dbd6"
flamingo = "#f0c6c6"
pink = "#f5bde6"
mauve = "#c6a0f6"
red = "#ed8796"
maroon = "#ee99a0"
peach = "#f5a97f"
yellow = "#eed49f"
green = "#a6da95"
teal = "#8bd5ca"
sky = "#91d7e3"
sapphire = "#7dc4e4"
blue = "#8aadf4"
lavender = "#b7bdf8"
text = "#cad3f5"
subtext1 = "#b8c0e0"
subtext0 = "#a5adcb"
overlay2 = "#9399b7"
overlay1 = "#8087a2"
overlay0 = "#6e738d"
surface2 = "#5b6078"
surface1 = "#494d64"
surface0 = "#363a4f"
base = "#24273a"
mantle = "#1e2030"
crust = "#181926"
```

#### 切换主题

修改 `palette` 字段即可切换主题：

```toml
# 可选值：catppuccin_mocha（默认）、catppuccin_frappe、catppuccin_latte、catppuccin_macchiato
palette = 'catppuccin_mocha'
```

#### 验证配置

```powershell
# 检查 Starship 版本
starship --version

# 测试配置是否正确
starship config
```

### 完整 Profile 配置

#### PowerShell 7+ Profile

将以下内容完整粘贴到 `$PROFILE` 文件中：

```powershell
# ════════════════════════════════════════════════════════════
#  PowerShell 7+ Profile
#  功能：动态窗口标题 + 智能自动补全 + Starship 集成
# ════════════════════════════════════════════════════════════

# ── 模块导入 ─────────────────────────────────────────────────
Import-Module PSReadLine
Import-Module posh-git  -ErrorAction SilentlyContinue
Import-Module PSFzf     -ErrorAction SilentlyContinue

# ── PSReadLine 配置 ──────────────────────────────────────────
# PS7+ 支持 HistoryAndPlugin（结合历史和插件两种来源预测）
Set-PSReadLineOption -PredictionSource HistoryAndPlugin

# PS7+ 支持 ListView（下拉候选列表，比 InlineView 更直观）
Set-PSReadLineOption -PredictionViewStyle ListView

Set-PSReadLineOption -HistorySearchCursorMovesToEnd
Set-PSReadLineOption -MaximumHistoryCount 10000

Set-PSReadLineOption -Colors @{
    Command          = 'Cyan'
    Parameter        = 'DarkCyan'
    String           = 'Yellow'
    Operator         = 'Magenta'
    Variable         = 'Green'
    Comment          = 'DarkGray'
    InlinePrediction = 'DarkGray'
    ListPrediction   = 'DarkCyan'
}

# ── 快捷键绑定 ───────────────────────────────────────────────
Set-PSReadLineKeyHandler -Key Tab           -Function MenuComplete
Set-PSReadLineKeyHandler -Key Shift+Tab     -Function MenuComplete
Set-PSReadLineKeyHandler -Key Ctrl+Spacebar -Function PossibleCompletions
Set-PSReadLineKeyHandler -Key UpArrow       -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow     -Function HistorySearchForward
Set-PSReadLineKeyHandler -Key Ctrl+r        -Function ReverseSearchHistory
# F2 可在 InlineView 和 ListView 之间实时切换（PS7+ 专属）
Set-PSReadLineKeyHandler -Key F2            -Function SwitchPredictionView

# ── PSFzf 配置 ───────────────────────────────────────────────
if (Get-Module PSFzf -ErrorAction SilentlyContinue) {
    Set-PSFzfOption -PSReadLineChordProvider       'Ctrl+t'
    Set-PSFzfOption -PSReadLineChordReverseHistory 'Ctrl+r'
}

# ── WinGet 补全 ──────────────────────────────────────────────
if (Get-Command winget -ErrorAction SilentlyContinue) {
    Register-ArgumentCompleter -Native -CommandName winget -ScriptBlock {
        param($wordToComplete, $commandAst, $cursorPosition)
        # PS7+ 推荐显式设置编码，避免中文路径乱码
        [Console]::InputEncoding  = [System.Text.Utf8Encoding]::new()
        [Console]::OutputEncoding = [System.Text.Utf8Encoding]::new()
        $word = $wordToComplete.Replace('"', '""')
        $ast  = $commandAst.ToString().Replace('"', '""')
        winget complete --word="$word" --commandline "$ast" --position $cursorPosition |
            ForEach-Object {
                [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
            }
    }
}

# ── 动态窗口标题（Starship 钩子）────────────────────────────
# Starship 会在每次渲染 Prompt 前自动调用此函数
function Invoke-Starship-PreCommand {
    $dirName = Split-Path -Leaf $PWD.Path
    $branch  = ""
    if (Test-Path ".git" -PathType Container) {
        try {
            $b = git branch --show-current 2>$null
            if ($b) { $branch = " [$b]" }
        } catch {}
    }
    $isAdmin = ([Security.Principal.WindowsPrincipal] `
        [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator)
    $adminTag = if ($isAdmin) { " ⚡ADMIN" } else { "" }
    $host.UI.RawUI.WindowTitle = "PS · $dirName$branch$adminTag"
}

# ── PowerToys CommandNotFound ────────────────────────────────
Import-Module -Name Microsoft.WinGet.CommandNotFound
#f45873b3-b655-43a6-b217-97c00aa0db58

# ── Starship 初始化（必须放最后）────────────────────────────
Invoke-Expression (&starship init powershell)
```

#### PowerShell 5.1 Profile

```powershell
# ════════════════════════════════════════════════════════════
#  PowerShell 5.1 Profile
#  功能：动态窗口标题 + 智能自动补全 + Starship 集成
# ════════════════════════════════════════════════════════════

# ── 模块导入 ─────────────────────────────────────────────────
Import-Module PSReadLine
Import-Module posh-git  -ErrorAction SilentlyContinue
Import-Module PSFzf     -ErrorAction SilentlyContinue

# ── PSReadLine 配置 ──────────────────────────────────────────
# PS5.1 仅支持 History，不支持 HistoryAndPlugin
Set-PSReadLineOption -PredictionSource History

# PS5.1 仅支持 InlineView，不支持 ListView
Set-PSReadLineOption -PredictionViewStyle InlineView

Set-PSReadLineOption -HistorySearchCursorMovesToEnd
Set-PSReadLineOption -MaximumHistoryCount 10000

Set-PSReadLineOption -Colors @{
    Command          = 'Cyan'
    Parameter        = 'DarkCyan'
    String           = 'Yellow'
    Operator         = 'Magenta'
    Variable         = 'Green'
    Comment          = 'DarkGray'
    InlinePrediction = 'DarkGray'
}

# ── 快捷键绑定 ───────────────────────────────────────────────
Set-PSReadLineKeyHandler -Key Tab           -Function MenuComplete
Set-PSReadLineKeyHandler -Key Shift+Tab     -Function MenuComplete
Set-PSReadLineKeyHandler -Key Ctrl+Spacebar -Function PossibleCompletions
Set-PSReadLineKeyHandler -Key UpArrow       -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow     -Function HistorySearchForward
Set-PSReadLineKeyHandler -Key Ctrl+r        -Function ReverseSearchHistory

# ── PSFzf 配置 ───────────────────────────────────────────────
if (Get-Module PSFzf -ErrorAction SilentlyContinue) {
    Set-PSFzfOption -PSReadLineChordProvider       'Ctrl+t'
    Set-PSFzfOption -PSReadLineChordReverseHistory 'Ctrl+r'
}

# ── WinGet 补全 ──────────────────────────────────────────────
if (Get-Command winget -ErrorAction SilentlyContinue) {
    Register-ArgumentCompleter -Native -CommandName winget -ScriptBlock {
        param($wordToComplete, $commandAst, $cursorPosition)
        $word = $wordToComplete.Replace('"', '""')
        $ast  = $commandAst.ToString().Replace('"', '""')
        winget complete --word="$word" --commandline "$ast" --position $cursorPosition |
            ForEach-Object {
                [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
            }
    }
}

# ── 动态窗口标题（Starship 钩子）────────────────────────────
function Invoke-Starship-PreCommand {
    $dirName = Split-Path -Leaf $PWD.Path
    $branch  = ""
    if (Test-Path ".git" -PathType Container) {
        try {
            $b = git branch --show-current 2>$null
            if ($b) { $branch = " [$b]" }
        } catch {}
    }
    $isAdmin = ([Security.Principal.WindowsPrincipal] `
        [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator)
    $adminTag = if ($isAdmin) { " ⚡ADMIN" } else { "" }
    $host.UI.RawUI.WindowTitle = "PS · $dirName$branch$adminTag"
}

# ── Starship 初始化（必须放最后）────────────────────────────
Invoke-Expression (&starship init powershell)
```

### 功能说明

#### 动态窗口标题

标题由以下三部分拼接而成：

```
PS · <当前目录名> [<Git分支>] <管理员标识>
```

**示例效果：**

| 场景 | 窗口标题 |
|------|----------|
| 普通目录 | `PS · Downloads` |
| Git 仓库 | `PS · my-project [main]` |
| 管理员身份 | `PS · System32 ⚡ADMIN` |
| 管理员 + Git | `PS · infra [feat/deploy] ⚡ADMIN` |

**实现原理：** 利用 Starship 预留的 `Invoke-Starship-PreCommand` 钩子函数，在每次渲染 Prompt 之前执行，与 Starship 完全兼容，无冲突。

#### 自动补全配置

配置分为四个层次，可按需选择叠加：

| 层次 | 功能 | 说明 |
|------|------|------|
| Layer 1 | PSReadLine 历史预测 | 输入部分命令后，灰色文字实时预测完整命令，按 `→` 接受 |
| Layer 2 | Tab 菜单补全 | 按 `Tab` 弹出候选菜单，上下键选择，`Enter` 确认 |
| Layer 3 | posh-git 补全 | 为 `git` 命令提供子命令、分支名、远程名等补全 |
| Layer 4 | PSFzf 模糊搜索 | `Ctrl+R` 调出交互式历史命令搜索窗口，支持模糊匹配 |

### 快捷键速查

| 快捷键 | 功能 | PS5.1 | PS7+ |
|--------|------|-------|------|
| `→` | 接受行内预测 | ✅ | ✅ |
| `Tab` | 菜单补全，循环切换候选 | ✅ | ✅ |
| `Shift+Tab` | 反向切换候选 | ✅ | ✅ |
| `Ctrl+Space` | 显示所有候选项 | ✅ | ✅ |
| `↑ / ↓` | 按前缀过滤历史记录 | ✅ | ✅ |
| `Ctrl+R` | fzf 模糊历史搜索 | ✅ | ✅ |
| `Ctrl+T` | fzf 模糊文件查找 | ✅ | ✅ |
| `F2` | 切换 InlineView / ListView | ❌ | ✅ |

### 版本功能对照

| 功能 | PS5.1 | PS7+ | 说明 |
|------|-------|------|------|
| `PredictionSource History` | ✅ | ✅ | 基于历史命令预测 |
| `PredictionSource HistoryAndPlugin` | ❌ | ✅ | 额外加入插件预测源 |
| `PredictionViewStyle InlineView` | ✅ | ✅ | 行内灰字预测 |
| `PredictionViewStyle ListView` | ❌ | ✅ | 下拉候选列表 |
| `F2` 切换预测视图 | ❌ | ✅ | 实时切换两种视图 |
| PSReadLine 最高版本 | 2.3.x | 最新版 | 安装时需注意 |
| posh-git | ✅ | ✅ | 版本一致 |
| PSFzf | ✅ | ✅ | 版本一致 |
| WinGet 补全 | ✅ | ✅ | 编码处理略有差异 |
| Starship 钩子 | ✅ | ✅ | 函数名一致 |
| 动态窗口标题 | ✅ | ✅ | 实现方式一致 |

> PS5.1 缺少的 `ListView` 和 `HistoryAndPlugin` 可通过 PSFzf 的 `Ctrl+R` 模糊搜索弥补，日常体验差距不大。

### 常见问题

#### 执行 `. $PROFILE` 报执行策略错误

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 模块安装报 NuGet 错误

```powershell
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
```

#### PSReadLine 安装后不生效

PS5.1 系统自带一个旧版 PSReadLine，新版安装在用户目录下，需确认加载的是新版：

```powershell
Get-Module PSReadLine | Select-Object Name, Version, Path
# Path 应包含 CurrentUser 路径，而非 System32
```

如果仍加载旧版，在 Profile 最顶部显式指定：

```powershell
Remove-Module PSReadLine -ErrorAction SilentlyContinue
Import-Module PSReadLine -RequiredVersion 2.3.4
```

#### fzf / PSFzf 的 Ctrl+R 不弹出窗口

确认 fzf 本体已安装且在 PATH 中：

```powershell
fzf --version
```

如果命令不存在，重新安装并重启终端：

```powershell
winget install junegunn.fzf
```

#### 窗口标题不更新

确认 `Invoke-Starship-PreCommand` 函数定义在 `Invoke-Expression (&starship init powershell)` **之前**，因为 Starship init 会注册对该钩子的调用，函数本身需要提前存在。

#### posh-git 导致启动变慢

posh-git 在大型仓库中可能扫描较慢，可设置跳过未跟踪文件统计：

```powershell
$GitPromptSettings.EnableFileStatus = $false
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
