---
title: Windows注册表和组策略
date: 2026-05-21 08:43:37
tags:
---

# Windows注册表和组策略

## 如何在Windows隐藏安装的程序

### 目的

由于维护人员或用户可能无意中通过"程序和功能"选项删除对业务至关重要的软件，这导致服务中断或安全风险。为了防止此类情况发生，确保只有授权的用户才能访问和管理系统中的程序。通过隐藏特定的安装程序，可以减少误操作的风险，同时保持系统管理的灵活性和安全性。

### 注册表键位置

Windows 根据以下注册表键中的条目生成在设置或控制面板中看到的已安装程序列表：

| 注册表路径 | 说明 |
|------------|------|
| `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall` | 所有设备用户的程序的通用列表 |
| `HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall` | x64 Windows 上安装的 x86 应用程序 |
| `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall` | 当前用户安装的应用程序 |

### 操作步骤

1. 打开注册表编辑器（`regedit`）
2. 导航到上述三个注册表键之一
3. 找到要隐藏的应用程序的注册表键
4. 创建一个新的 32 位 DWORD 注册表参数：
   - 名称：`SystemComponent`
   - 值：`1`
5. 刷新程序和功能列表

### 效果

设置后，程序将从以下位置隐藏：
- 控制面板的"程序和功能"列表
- 现代设置界面（设置 -> 应用 -> 安装的应用）

### 注意事项

- 修改注册表前建议备份
- 需要管理员权限
- 隐藏后程序仍可正常使用
- 只是隐藏显示，不会卸载程序
