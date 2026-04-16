---
title: Linux文件操作
date: 2021-04-07 16:04:58
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/00E0F0ED-9F1C-407A-9AA6-545649D919F4.jpeg
tags: [Linux, Shell, 文件管理]
categories: [操作系统, Linux]
---

# Linux文件操作

## 文件查看

### cat 命令

显示文本文件内容的一部分。

```shell
cat filename
```

适用于查看小型文件：`.java`、`.py`、`.xml`、`.html`、`.js`、`.css` 等。

### more 命令

分页显示文本文件内容，只能向下查看，不能向上翻页。

```shell
more filename
```

### less 命令

分页显示文本文件内容，支持上下翻页。

```shell
less filename
```

**操作方式**：

| 按键 | 功能 |
|-----|------|
| `PgUp` / `PgDn` | 上下翻页 |
| `↑` / `↓` | 一行一行查看 |
| `q` | 退出查看 |

### head 命令

查看文本文件的前 N 行。

```shell
# 查看前10行
head -n 10 filename
```

### tail 命令

查看文本文件的后 N 行，或实时监控文件变化。

```shell
# 查看后10行
tail -n 10 filename

# 实时监控文件变化
tail -f filename
```

---

## 文件查找

### find 命令

**基本语法**：

```shell
find 路径 表达式
```

#### 按文件名查找

```shell
# 在根目录下查找文件（整个硬盘）
find / -name httpd.conf

# 在指定目录下查找
find /etc -name httpd.conf

# 使用通配符模糊查找
find /etc -name '*srm*'
```

#### 按文件特征查找

```shell
# 查找最后10分钟访问的文件
find / -amin -10

# 查找最后48小时访问的文件
find / -atime -2

# 查找空文件或空目录
find / -empty

# 查找属于指定组的文件
find / -group cat

# 查找最后5分钟修改的文件
find / -mmin -5

# 查找最后24小时修改的文件
find / -mtime -1

# 查找属于指定用户的文件
find / -user fred

# 查找大于10000字节的文件
find / -size +10000c

# 查找小于1000KB的文件
find / -size -1000k
```

**文件大小单位**：`c`（字节）、`w`（双字）、`k`（KB）、`M`（MB）、`G`（GB）

#### 混合查找

```shell
# 大于10000字节且最后2分钟内修改的文件
find /tmp -size +10000c -and -mtime +2

# 用户是fred或george的文件
find / -user fred -or -user george

# 不属于panda用户的文件
find /tmp ! -user panda
```

**逻辑参数**：`!`（非）、`-and` 或 `-a`（与）、`-or` 或 `-o`（或）

### du 命令

查看磁盘空间使用情况，查找占用空间较多的文件。

```shell
# 查找/root下5个最大的文件
du -ah /root | sort -nr | head -n5

# 查找当前目录下最大的5个目录
du -ah | sort -nr | head -n5

# 查找根目录下最大的目录/文件（包括子文件夹）
du -Sh / | sort -rh | head -n10

# 只看大小在GB范围内的文件
du -ah / | grep "[0-9]G\b"

# 查看各目录占用
du -sh /* 2>/dev/null | sort -rh | head -20

# 重点查看/var目录
du -sh /var/* 2>/dev/null | sort -rh | head -20
```

### 快速查找大文件

```shell
# 查找用户目录下大于100M的文件
find ~ -type f -size +100M | xargs ls -lhS

# 只显示文件大小和路径
find ~ -type f -size +100M | xargs du -h | sort -hr
```

---

## 文件压缩

### 压缩概念

1. **打包**：把多个文件打成一个包
2. **压缩**：把文件占用的大小进行压缩

### tar 命令

**基本语法**：

```shell
tar [选项] 文件名
```

**常用参数**：

| 参数 | 说明 |
|-----|------|
| `-c` | 建立压缩文件（打包） |
| `-x` | 解开压缩文件（解包） |
| `-z` | 使用 gzip 压缩 |
| `-v` | 显示压缩过程日志 |
| `-f` | 指定文件名 |

**常用组合**：

| 命令 | 说明 |
|-----|------|
| `tar -cf` | 只打包，不压缩，不显示日志 |
| `tar -xf` | 解压文件，不显示日志 |
| `tar -cvf` | 只打包，不压缩，显示日志 |
| `tar -xvf` | 解压文件，显示日志 |
| `tar -zcvf` | 打包压缩，显示日志 |
| `tar -zxvf` | 解压（最常用） |

**示例**：

```shell
# 打包压缩
tar -zcvf wwwroot.tar.gz wwwroot/

# 解压
tar -zxvf wwwroot.tar.gz
```

### tar.gz 与 tgz

两者本质相同，只是扩展名不同。都是通过 `tar` 打包后使用 `gzip` 压缩。

---

## 文件权限

### 权限说明

Linux 文件有三种权限：

| 权限 | 说明 |
|-----|------|
| `r` | 可读 |
| `w` | 可写 |
| `x` | 可执行 |

### chmod 命令

修改文件权限。

```shell
# 设置权限为755（rwxr-xr-x）
chmod 755 file
```

**权限数字说明**：

| 数字 | 权限 |
|-----|------|
| 7 | rwx |
| 6 | rw- |
| 5 | r-x |
| 4 | r-- |
| 0 | --- |

### 查看目录权限

```shell
sudo ls -ld /OLAP
```

输出示例：

```
drwxr-xr-x 5 root root 4096 Aug  5 08:27 /OLAP
```

### 修改目录权限

```shell
# 设置权限为775
sudo chmod 775 /OLAP
```

### 更改目录所有者

```shell
# 将目录所有者更改为指定用户
sudo chown user:user /OLAP
```

---

## 路径获取

```shell
# 获取文件绝对路径
readlink -f sample.txt

# 获取文件绝对路径（不解析符号链接）
realpath -s sample.txt

# 在当前目录查找文件并显示完整路径
find $(pwd) -name sample.txt

# 显示当前目录下文件的完整路径
ls -l $PWD/sample.txt
```

---

## 文件目录大小统计

```shell
# 列出当前目录下所有文件的大小及统计总和
ls -lht
```