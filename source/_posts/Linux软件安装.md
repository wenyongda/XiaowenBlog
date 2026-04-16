---
title: Linux软件安装
date: 2021-04-07 16:04:58
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/00E0F0ED-9F1C-407A-9AA6-545649D919F4.jpeg
tags: [Linux, Shell, 软件安装]
categories: [操作系统, Linux]
---

# Linux软件安装

## 包管理器

### rpm 命令

本地安装软件包。

```shell
# 安装rpm包
rpm -ivh package.rpm

# 卸载rpm包
rpm -e package
```

---

### yum 命令

CentOS 软件包管理器，需要配置源。

#### 常用命令

```shell
# 安装软件
yum install -y package

# 更新软件
yum update package

# 删除软件
yum remove package

# 搜索软件
yum search package

# 清理缓存
yum clean all

# 生成缓存
yum makecache
```

#### 更换阿里源

```shell
yum install -y wget &&
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup &&
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo &&
yum clean all &&
yum makecache
```

---

### dnf 命令

Fedora/AlmaLinux 软件包管理器（yum 的替代）。

#### 常用命令

```shell
# 安装软件
dnf install -y package

# 更新系统
dnf update

# 删除软件
dnf remove package

# 搜索软件
dnf search package

# 清理缓存
dnf clean all
```

---

## wget 下载工具

### 基本语法

```shell
wget [参数] [URL地址]
```

### 基本示例

```shell
# 下载文件
wget https://example.com/file.zip

# 指定保存文件名
wget -O 图片名.png https://www.baidu.com/img/bd_logo1.png
```

### 记录和输入文件参数

| 参数 | 说明 |
|-----|------|
| `-o` | 把记录写到文件中 |
| `-a` | 把记录追加到文件中 |
| `-d` | 打印调试输出 |
| `-q` | 安静模式（没有输出） |
| `-v` | 冗长模式（缺省设置） |
| `-nv` | 关掉冗长模式 |
| `-i` | 下载文件中出现的 URLs |
| `-F` | 把输入文件当作 HTML 格式 |

### 下载参数

| 参数 | 说明 |
|-----|------|
| `-t` | 设定最大尝试链接次数（0 表示无限制） |
| `-O` | 把文档写到文件中 |
| `-nc` | 不要覆盖存在的文件 |
| `-c` | 接着下载没下载完的文件 |
| `-N` | 不要重新下载文件除非比本地文件新 |
| `-S` | 打印服务器的回应 |
| `-T` | 设定响应超时的秒数 |
| `-w` | 两次尝试之间间隔秒数 |
| `-Q` | 设置下载的容量限制 |
| `--limit-rate` | 限定下载速率 |

---

## 常用软件安装

### 安装 Vim 编辑器

```shell
yum install -y vim
```

### 安装 screenFetch

```shell
# 下载安装包
wget https://github.com/KittyKatt/screenFetch/archive/master.zip

# 安装 unzip
yum install unzip

# 解压
unzip master.zip

# 移动到系统目录
mv screenFetch-master/screenfetch-dev /usr/bin/screenfetch
```

---

## 环境变量配置

### 配置 Java 环境变量

#### 1. 解压并移动 JDK

```shell
mv jdk1.8.0_301/ /usr/
```

#### 2. 编辑 profile 文件

```shell
vim /etc/profile
```

在文件末尾添加：

```shell
export JAVA_HOME=/usr/jdk1.8.0_301
export PATH=$PATH:$JAVA_HOME/bin
```

#### 3. 重新加载配置

```shell
source /etc/profile
```