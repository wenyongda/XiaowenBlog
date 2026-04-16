---
title: Linux
date: 2021-04-07 16:04:58
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/00E0F0ED-9F1C-407A-9AA6-545649D919F4.jpeg
tags: [Linux, Shell, 命令行, 操作系统]
categories: [操作系统, Linux]
---

# Linux

Linux 是一个开源的操作系统内核，广泛应用于服务器、嵌入式设备和桌面环境。本文档将 Linux 知识按主题进行了拆分，方便查阅和学习。

---

## 文档导航

以下是将原文章拆分后的独立主题文档：

### 基础入门

| 文章 | 内容简介 |
|-----|---------|
| {% post_link Linux基础命令 %} | Linux简介、文件结构、目录操作、文件操作（ls、cd、cp、mv、rm等）、快捷键 |
| {% post_link Linux文件操作 %} | 文件查看（cat、more、less）、查找（find、du）、压缩解压（tar）、权限管理 |

### 系统管理

| 文章 | 内容简介 |
|-----|---------|
| {% post_link Linux进程与服务管理 %} | 进程管理（ps、top、kill）、服务管理（systemctl）、Shell脚本shebang |
| {% post_link Linux网络配置 %} | 网络配置文件、端口映射（iptables）、防火墙（firewall-cmd）、网卡信息 |
| {% post_link Linux磁盘管理 %} | 磁盘空间查看、分区、LVM扩容、格式转换、挂载卷、Swap配置、内核升级 |

### 运维工具

| 文章 | 内容简介 |
|-----|---------|
| {% post_link Linux软件安装 %} | 包管理器（rpm、yum、dnf）、wget下载工具、环境变量配置 |
| {% post_link Linux系统监控 %} | CPU、内存、硬盘、网卡信息查看（lscpu、free、lsblk、lspci） |
| {% post_link Linux用户与权限 %} | 用户管理、sudo权限配置、ACL权限控制 |

---

## 相关主题

以下是其他 Linux 相关的专题文档：

| 文章 | 内容简介 |
|-----|---------|
| {% post_link ArchLinux %} | Arch Linux 安装、pacman包管理器、Containerd/Nerdctl配置 |
| {% post_link ubuntu %} | Ubuntu 系统相关 |
| {% post_link Vim %} | Vim 编辑器详细教程 |
| {% post_link Docker %} | Docker 容器技术 |
| {% post_link Nginx %} | Nginx Web服务器 |

---

## 快速参考

### 常用命令速查

```shell
# 文件操作
ls -la          # 列出所有文件详情
cd /path        # 切换目录
cp -r src dst   # 复制目录
mv src dst      # 移动/重命名
rm -rf dir      # 删除目录（慎用）

# 查找
find / -name "*.log"    # 按名称查找
grep -r "keyword" .     # 搜索内容

# 进程
ps -aux         # 查看所有进程
top             # 动态监控
kill -9 PID     # 强制终止进程

# 服务
systemctl status service   # 查看服务状态
systemctl start service    # 启动服务

# 网络
ip addr         # 查看IP
netstat -lnp    # 查看端口
firewall-cmd --list-all    # 查看防火墙规则

# 磁盘
df -h           # 查看磁盘空间
du -sh *        # 查看目录大小
lsblk           # 查看分区
```

---

> 💡 **提示**：如需深入了解某个主题，请点击上方导航链接访问对应的详细文档。