---
title: Linux用户与权限
date: 2021-04-07 16:04:58
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/00E0F0ED-9F1C-407A-9AA6-545649D919F4.jpeg
tags: [Linux, Shell, 用户管理]
categories: [操作系统, Linux]
---

# Linux用户与权限

## 用户管理

### 查看用户

```shell
# 查看当前用户
who am i

# 查看当前登录用户数量
who --count
```

### 用户组管理

```shell
# 创建用户组
groupadd groupname

# 删除用户组
groupdel groupname
```

### 用户管理

```shell
# 创建用户并指定用户组
useradd username -g usergroup

# 设置用户密码
passwd username

# 切换用户
# 从 root 切换到其他用户不需要输入密码
# 从其他用户切换到 root 需要输入密码
su username

# 退出登录
exit
```

---

## 权限管理

### Linux文件权限

Linux 文件有三种权限：

| 权限 | 说明 |
|-----|------|
| `r` | 可读 |
| `w` | 可写 |
| `x` | 可执行 |

### chmod 命令

修改文件权限。

```shell
# 数字方式设置权限
chmod 755 file
```

**权限数字说明**：

| 数字 | 权限 | 说明 |
|-----|------|------|
| 7 | rwx | 读、写、执行 |
| 6 | rw- | 读、写 |
| 5 | r-x | 读、执行 |
| 4 | r-- | 只读 |
| 0 | --- | 无权限 |

**755 权限含义**：`rwxr-xr-x`
- 所有者：读、写、执行
- 所属组：读、执行
- 其他用户：读、执行

---

## sudo权限

### 开启sudo权限

#### 1. 添加sudoers文件写权限

```shell
chmod u+w /etc/sudoers
```

#### 2. 编辑sudoers文件

```shell
vim /etc/sudoers
```

找到 `root ALL=(ALL) ALL` 这行，在其下面添加：

```
username ALL=(ALL) ALL
```

#### 3. sudoers配置选项

```shell
# 允许用户执行sudo命令（需要输入密码）
username            ALL=(ALL)                ALL

# 允许用户组里的用户执行sudo命令（需要输入密码）
%usergroup          ALL=(ALL)                ALL

# 允许用户执行sudo命令，不需要输入密码
username            ALL=(ALL)                NOPASSWD: ALL

# 允许用户组里的用户执行sudo命令，不需要输入密码
%usergroup          ALL=(ALL)                NOPASSWD: ALL
```

#### 4. 撤销sudoers文件写权限

```shell
chmod u-w /etc/sudoers
```

---

## ACL权限

> ACL（访问控制列表）提供更细粒度的权限控制，允许为特定用户或组设置特定权限。

### 安装ACL工具

```shell
# Ubuntu/Debian
sudo apt install acl -y

# Fedora/AlmaLinux
sudo dnf install acl -y
```

### 设置ACL权限

```shell
# 为指定用户设置读写权限
sudo setfacl -m u:user:rwx /OLAP
```

### 验证ACL权限

```shell
getfacl /OLAP
```

**输出示例**：

```
getfacl: Removing leading '/' from absolute path names
# file: OLAP
# owner: user
# group: user
user::rwx
group::r-x
other::r-x
```

### 设置默认ACL权限

让新创建的文件和子目录自动继承特定权限：

```shell
sudo setfacl -dm u:user:rwx /OLAP
```

---

## 目录权限修改

### 查看目录权限

```shell
sudo ls -ld /OLAP
```

**输出示例**：

```
drwxr-xr-x 5 root root 4096 Aug  5 08:27 /OLAP
```

### 修改目录权限

```shell
# 设置权限为775（rwxrwxr-x）
sudo chmod 775 /OLAP
```

这样目录的所有者和所属组的用户都可以读写，其他用户只有读取和执行权限。

### 将用户加入目录所属组

```shell
# 将用户加入root组（不推荐，root组权限过高）
sudo usermod -aG root user
```

重新登录或重启系统以使组变更生效。

### 更改目录所有者

```shell
# 将目录所有者更改为指定用户
sudo chown user:user /OLAP
```

这样用户将拥有对目录的完全控制权。