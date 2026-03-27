---
title: Visual Studio
date: 2018-09-30 18:23:38
type: "tags"
layout: "tags"
---

# 快捷键

## 注释：Ctrl+K+C

## 取消注释：Ctrl+K+U

## 设置断点调试：F9

## 撤销：Ctrl+Z

## 反撤销：Ctrl+Y

## 定位到当前行的行首：Home

## 定位到当前行的行尾：End

## 选中从光标起到航首间的代码：Shift+Home

## 选中从光标起到行尾间的代码：Shift+End

## 定位到当前文本编辑器的首行：Ctrl+Home

## 定位到当前文本编辑器的末行：Ctrl+End

## 逐过程调试：F10

## 逐语句调试：F11

## 跳出调试：Shift+F11

## 调用智能提示：Alt+→

## 快速隐藏或显示当前代码段：Ctrl+M*2

## 跳转到指定某一行：Ctrl+G

## 转小写：Ctrl+U

## 转大写：Ctrl+Shift+U

## 快速切换窗口：Ctrl+Tab

## 回到上一个光标的位置：Ctrl+—

## 前进到下一个光标的位置：Ctrl+Shift+—

## 删除整行代码：Ctrl+L

# 滚动条缩略预览

工具—>选项—>文本编辑器—>所有语言—>滚动条—>行为—>使用垂直滚动条的缩略图模式—>源代码概述—>宽

# 扩展

## Viasfora

## File Icons

# IDE 智能提示汉化

工具以`dotnet cli`发布，使用`dotnet tool`进行安装

```shell
dotnet tool install -g islocalizer
```

工具会自动从`github`下载对应的包进行安装（可能需要访问加速）。
也可以通过`-cc`参数指定内容对照类型

- `OriginFirst`: 原始内容在前
- `LocaleFirst`: 本地化内容在前
- `None`: 没有对照

```shell
islocalizer install auto -m net6.0 -l zh-cn -cc OriginFirst
```

## 自定义生成

如下示例生成`.net6`的原始内容在前的`zh-cn`本地化包，并使用 `---------` 分隔原文和本地化内容，生成完成后的`包路径`会输出到控制台。

```shell
islocalizer build -m net6.0 -l zh-cn -cc OriginFirst -sl '---------'
```

可以通过 `islocalizer build -h` 查看更多的构建参数信息。

**首次构建过程可能非常缓慢（需要爬取所有的页面），相关文件会被缓存（单zh-cn内容大小约3.5G），再次构建时会比较快；**

## 安装

```shell
islocalizer install {包路径}
```

`包路径`为build命令完成后输出的路径。

------

可以通过 `islocalizer -h` 查看更多的命令帮助。

