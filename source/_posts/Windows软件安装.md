---
title: Windows软件安装
date: 2026-05-21 08:42:59
tags:
---

# Windows软件安装

## 包管理器

### winget 命令

Windows 程序包管理器，可从命令行安装应用程序和其他程序包。

#### 常用命令

```powershell
# 安装程序包
winget install <package>

# 显示包信息
winget show <package>

# 搜索程序包
winget search <package>

# 列出已安装的程序包
winget list

# 升级程序包
winget upgrade <package>

# 卸载程序包
winget uninstall <package>

# 导出已安装程序包列表
winget export -o export.json

# 从文件导入程序包
winget import -i import.json

# 查看版本
winget --version

# 查看帮助
winget --help
```

#### 命令详解

| 命令 | 说明 |
|------|------|
| `install` | 安装给定的程序包 |
| `show` | 显示包的相关信息 |
| `source` | 管理程序包的来源 |
| `search` | 查找并显示程序包的基本信息 |
| `list` | 显示已安装的程序包 |
| `upgrade` | 显示并执行可用升级 |
| `uninstall` | 卸载给定的程序包 |
| `hash` | 哈希安装程序的帮助程序 |
| `validate` | 验证清单文件 |
| `settings` | 打开设置或设置管理员设置 |
| `features` | 显示实验性功能的状态 |
| `export` | 导出已安装程序包的列表 |
| `import` | 安装文件中的所有程序包 |
| `pin` | 管理包钉 |
| `configure` | 将系统配置为所需状态 |
| `download` | 从给定的程序包下载安装程序 |
| `repair` | 修复所选包 |
| `dscv3` | DSC v3 资源命令 |
| `mcp` | MCP 信息 |

#### 常用选项

```powershell
# 显示工具版本
winget --version

# 显示工具信息
winget --info

# 显示帮助信息
winget --help

# 等待用户按键后退出
winget --wait

# 打开日志位置
winget --logs

# 启用详细日志记录
winget --verbose

# 禁止显示警告
winget --nowarn

# 禁用交互式提示
winget --disable-interactivity

# 设置代理
winget --proxy <url>

# 禁用代理
winget --no-proxy
```

