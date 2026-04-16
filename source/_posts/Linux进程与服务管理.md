---
title: Linux进程与服务管理
date: 2021-04-07 16:04:58
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/00E0F0ED-9F1C-407A-9AA6-545649D919F4.jpeg
tags: [Linux, Shell, 进程管理]
categories: [操作系统, Linux]
---

# Linux进程与服务管理

## 进程管理

### ps 命令

查看进程状态。

```shell
# 查看前台进程
ps

# 查看所有进程详细信息
ps -aux

# 查看所有进程详细信息（含父进程ID）
ps -ef
```

**输出字段说明**：

| 字段 | 说明 |
|-----|------|
| UID | 用户 |
| PID | 进程ID |
| PPID | 父进程ID |

> 父进程ID为1表示系统进程。

### top 命令

动态显示进程状态。

```shell
top
```

### 查找特定进程

```shell
# 查看所有进程并搜索指定进程
ps -aux | grep network
```

### kill 命令

根据 PID 终止进程。

```shell
# 终止进程
kill PID

# 强制终止进程
kill -9 PID
```

---

## 服务管理

### systemctl 命令

操作系统服务。

**基本语法**：

```shell
systemctl [操作] 服务名
```

**常用操作**：

| 操作 | 说明 |
|-----|------|
| `status` | 查看服务状态 |
| `stop` | 终止服务 |
| `start` | 启动服务 |
| `restart` | 重启服务 |
| `enable` | 设置开机自启 |
| `disable` | 禁用开机自启 |

**示例**：

```shell
# 查看MySQL服务状态
systemctl status mysqld

# 启动网络服务
systemctl start network

# 设置服务开机自启
systemctl enable mysqld

# 启动并设置开机自启
systemctl enable --now mysqld
```

### 常见服务名称

| 服务 | 服务名 |
|-----|------|
| 网络服务 | `network` |
| 防火墙服务 | `firewalld` |
| MySQL | `mysqld` |
| Containerd | `containerd` |
| BuildKit | `buildkit` |

---

## 网络状态

### netstat 命令

查看网络连接状态。

```shell
# 查看监听中的端口
netstat -lnp | grep 8080
```

**参数说明**：

| 参数 | 说明 |
|-----|------|
| `-l` | 显示监控中的服务器的 Socket |
| `-n` | 直接使用 IP 地址，不通过域名服务器 |
| `-p` | 显示正在使用 Socket 的程序识别码和名称 |

---

## Shell脚本

### shebang 说明

Shell 脚本开头通常包含 `#!/bin/bash`，这行称为 **shebang** 或 **hashbang**。

```shell
#!/bin/bash

echo 'Hello, World!'
```

**作用**：告诉系统使用 `bash` 作为脚本的解释器，无需在运行时指定。

**注意事项**：
- `#!` 和 `/bin/bash` 之间的空格无关紧要
- 使用 `#!/bin/zsh` 表示使用 zsh 解释器