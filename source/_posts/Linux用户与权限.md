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

### 收回用户 Shell 权限

限制用户登录系统，禁止其使用交互式 Shell。

#### 设置禁止登录的 Shell

```shell
# 方法一：使用 /sbin/nologin（推荐）
usermod -s /sbin/nologin username

# 方法二：使用 /bin/false
usermod -s /bin/false username
```

#### 查看用户当前 Shell

```shell
grep username /etc/passwd

# 或
getent passwd username
```

输出示例：

```
username:x:1001:1001::/home/username:/sbin/nologin
```

#### 各 Shell 对比

| Shell | 效果 |
| --- | --- |
| `/bin/bash` | 正常登录，可执行命令 |
| `/sbin/nologin` | 拒绝登录，提示 `This account is currently not available` |
| `/bin/false` | 拒绝登录，无提示，退出码为 1 |
| `/usr/sbin/nologin` | 与 `/sbin/nologin` 相同（部分系统软链接） |

> **适用场景**：数据库用户、服务专用账户、FTP 账户等只需运行服务不需要登录系统的用户。

#### 恢复登录权限

```shell
usermod -s /bin/bash username
```

#### 批量收回

```shell
# 读取用户列表文件，批量设置
while read user; do
    usermod -s /sbin/nologin "$user"
done < userlist.txt
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

修改文件或目录权限。

#### 基本语法

```shell
chmod [选项] 模式 文件
```

#### 符号模式

通过 `u`（所有者）、`g`（所属组）、`o`（其他用户）、`a`（所有人）配合 `+`、`-`、`=` 操作权限。

**操作符区别**：

| 操作符 | 作用 | 说明 |
|--------|------|------|
| `+` | 添加权限 | 在原有权限基础上增加，不影响已有权限 |
| `-` | 移除权限 | 从现有权限中移除，不影响未指定的权限 |
| `=` | 直接设置 | 覆盖为指定权限，其余位清零 |

```shell
# + 添加权限（累加，不影响其他位）
chmod u+x script.sh      # 所有者添加执行权限
chmod a+r file.txt       # 所有人添加读权限
chmod g+w,o+r file.txt   # 组添加写，其他添加读

# - 移除权限（仅移除指定位，其余保留）
chmod o-w file.txt       # 其他用户移除写权限
chmod g-x script.sh      # 组移除执行权限
chmod a-w file.txt       # 所有人移除写权限

# = 直接设置（覆盖，未指定的位全部清零）
chmod u=r file.txt       # 所有者只有读权限（写和执行被清除）
chmod g=r file.txt       # 组只有读权限
chmod o= file.txt        # 其他用户无任何权限
chmod u=rwx,g=rx,o= file.txt  # 精确控制每位权限

# + 重复添加已有权限不会报错，保持不变
chmod u+x file.txt       # 如果已有执行权限，不变
chmod a+r file.txt       # 如果所有人已有读权限，不变
```

> **注意**：`+` 是幂等操作，重复添加已有权限不会产生任何变化，也不会报错。`-` 同理，移除不存在的权限也不会报错。

**示例对比**：

```shell
# 假设文件当前权限为 rw-r--r--（644）

chmod u+x file.txt      # 结果：rwxr--r--（654）只给所有者加了执行
chmod u-x file.txt      # 结果：rw-r--r--（644）移除执行（本来就没有，不变）
chmod u=r file.txt      # 结果：r--r--r--（444）所有者变成只读，写被清掉
chmod u=rw file.txt     # 结果：rw-r--r--（644）所有者读写
chmod u=rwx,g=rx,o= file.txt  # 结果：rwxr-x---（750）
```

#### 数字模式

用三位八进制数表示权限，每位对应 `u`、`g`、`o`。

| 数字 | 权限 | 说明 |
|-----|------|------|
| 7 | rwx | 读、写、执行 |
| 6 | rw- | 读、写 |
| 5 | r-x | 读、执行 |
| 4 | r-- | 只读 |
| 0 | --- | 无权限 |

```shell
# rwxr-xr-x（所有者全权限，组和其他用户读执行）
chmod 755 file.txt

# rw-r--r--（所有者读写，组和其他用户只读）
chmod 644 file.txt

# rw-rw----（所有者和组读写，其他用户无权限）
chmod 660 file.txt

# rwx------（仅所有者有全部权限）
chmod 700 file.txt

# rw-rw-rw-（所有人可读写）
chmod 666 file.txt
```

#### 常用权限参考

| 权限值 | 含义 | 适用场景 |
|--------|------|----------|
| `755` | rwxr-xr-x | 可执行脚本、程序，公开目录 |
| `644` | rw-r--r-- | 普通文件，所有人可读 |
| `700` | rwx------ | 私有目录，仅所有者可访问 |
| `600` | rw------- | 私有文件，如 SSH 密钥 |
| `640` | rw-r----- | 服务配置文件，组可读 |
| `777` | rwxrwxrwx | 所有人可读写执行（不推荐） |

#### 常用选项

```shell
# 递归修改目录及子目录下所有文件
chmod -R 755 /var/www/html

# 仅修改目录本身的权限
chmod 755 /var/www/html

# 修改符号链接的权限（不常用）
chmod -h 755 link_file

# 显示修改过程
chmod -v 755 file.txt
```

#### 设置特殊权限

```shell
# SUID（4）：执行时以文件所有者身份运行
chmod 4755 /usr/bin/passwd

# SGID（2）：执行时以文件所属组身份运行
chmod 2755 /shared_dir

# Sticky Bit（1）：目录内文件只有所有者能删除
chmod 1777 /tmp
```

**特殊权限数字对照**：

| 数字 | 权限 | 说明 |
|------|------|------|
| 4 | SUID | 执行时以所有者身份运行 |
| 2 | SGID | 执行时以组身份运行 |
| 1 | Sticky | 仅文件所有者可删除目录内文件 |

```shell
# 同时设置特殊权限和普通权限
chmod 4755 file    # SUID + rwxr-xr-x
chmod 2755 dir     # SGID + rwxr-xr-x
chmod 1777 /tmp    # Sticky + rwxrwxrwx
```

#### 通过八进制运算理解权限

```
用户(u)    组(g)    其他(o)
rwx        r-x      r--
4+2+1      4+0+1    4+0+0
  7          5        4    = 754
```

---

### chown 命令

修改文件或目录的所有者和所属组。

#### 基本语法

```shell
chown [选项] 所有者[:所属组] 文件
```

#### 常用操作

```shell
# 修改文件所有者
chown user file.txt

# 修改文件所有者和所属组
chown user:group file.txt

# 修改文件所属组
chown :group file.txt

# 递归修改目录及子文件
chown -R user:group /var/www/html

# 仅修改所有者
chown -R user /var/www/html

# 仅修改所属组
chown -R :group /var/www/html

# 显示修改过程
chown -v user file.txt
```

#### 常用选项

| 选项 | 说明 |
|------|------|
| `-R` | 递归修改目录及子目录下所有文件 |
| `-v` | 显示修改过程 |
| `-c` | 仅显示更改的文件 |
| `-f` | 静默模式，忽略错误 |
| `-h` | 修改符号链接本身而非链接目标 |

#### 与 chgrp 的区别

```shell
# chown 可同时修改所有者和所属组
chown user:group file.txt

# chgrp 只能修改所属组
chgrp group file.txt
```

#### 实用场景

```shell
# 部署 Web 项目
chown -R nginx:nginx /var/www/html

# 将目录交给特定用户管理
chown -R user:user /home/user/projects

# 修改 SSH 密钥权限
chmod 600 ~/.ssh/id_rsa
chown root:root ~/.ssh
chmod 700 ~/.ssh
```

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