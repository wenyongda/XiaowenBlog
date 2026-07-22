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

##### Rocky Linux

```shell
sed -e 's|^mirrorlist=|#mirrorlist=|g' \
    -e 's|^#baseurl=http://dl.rockylinux.org/$contentdir|baseurl=https://mirrors.aliyun.com/rockylinux|g' \
    -i.bak \
    /etc/yum.repos.d/[Rr]ocky*.repo
    # 注意 8 系列 Rocky R 大些，9 系列 r 小写 (sysin)
    # 阿里云文档有误无法匹配：https://developer.aliyun.com/mirror/rockylinux

# 恢复
sed -e 's|^#mirrorlist=|mirrorlist=|g' \
    -e 's|^baseurl=https://mirrors.aliyun.com/rockylinux|#baseurl=http://dl.rockylinux.org/$contentdir|g' \
    -i.bak \
    /etc/yum.repos.d/[Rr]ocky*.repo

dnf makecache
```

##### AlmaLinux

```shell
sed -e 's|^mirrorlist=|#mirrorlist=|g' \
    -e 's|^#baseurl=https://repo.almalinux.org|baseurl=https://mirrors.aliyun.com/almalinux|g' \
    -i.bak \
    /etc/yum.repos.d/almalinux*.repo

# 恢复
sed -e 's|^#mirrorlist=|mirrorlist=|g' \
    -e 's|^baseurl=https://mirrors.aliyun.com/almalinux|#baseurl=https://repo.almalinux.org|g' \
    -i.bak \
    /etc/yum.repos.d/almalinux*.repo

dnf makecache
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

### yum / dnf / dnf5 区别

| 特性 | yum | dnf | dnf5 |
| --- | --- | --- | --- |
| 语言 | Python | Python (C 底层) | C++ |
| 默认版本 | CentOS 7 | CentOS 8 / Fedora 22~38 | Fedora 39+ / RHEL 10 |
| 依赖解析 | 速度慢 | 速度快，libsolv 引擎 | 更快，Rust 重写核心 |
| 事务历史 | 支持 | 支持 | 支持，API 更强 |
| 插件体系 | 旧 | 兼容 yum 插件 | 全新插件架构 |
| 向后兼容 | — | `dnf` 命令兼容 `yum` | `dnf` 指向 `dnf5`（软链接） |

> **简单理解**：`dnf` 是 `yum` 的现代替代，`dnf5` 是 `dnf` 的下一代重写。三者命令行语法基本一致，日常使用无需区分。

---

### yum.repos.d 配置详解

#### 目录结构

```shell
/etc/yum.repos.d/
├── CentOS-Base.repo          # 基础源
├── CentOS-AppStream.repo     # 应用流
├── CentOS-PowerTools.repo    # 扩展工具
├── epel.repo                 # EPEL 扩展源
├── nginx.repo                # 自定义第三方源
└── ...
```

> 所有 `.repo` 文件都会被自动加载，文件名任意，关键是 `.repo` 后缀。

#### .repo 文件结构

```ini
[repo-id]              # 仓库唯一标识，同一文件内不能重复
name=Repository Name   # 仓库描述名称
baseurl=               # 仓库地址（三选一或组合）
# mirrorlist=          # 镜像列表 URL（与 baseurl 二选一）
# metalink=            # 元数据校验 URL
enabled=1              # 是否启用（1 启用，0 禁用）
gpgcheck=1             # 是否校验包 GPG 签名
repo_gpgcheck=0        # 是否校验仓库元数据 GPG 签名
gpgkey=                # GPG 公钥地址
metadata_expire=24h    # 元数据缓存过期时间（24h / 6h / 1d / 1h）
countme=1              # 是否上报系统架构统计（1 开启，0 关闭）
priority=              # 优先级（需安装 dnf-plugins-core）
module_hotfixes=true   # 是否跳过模块过滤（DNF 专用）
```

#### baseurl 支持的协议

| 协议 | 示例 |
| --- | --- |
| http/https | `baseurl=https://mirrors.aliyun.com/centos/8/BaseOS/x86_64/os/` |
| file (本地) | `baseurl=file:///mnt/cdrom/` |
| ftp | `baseurl=ftp://mirror.example.com/pub/centos/` |

> 多个地址可用 `$releasever`、`$basearch` 等变量自动替换版本和架构。

#### 常用变量

| 变量 | 说明 | 示例值 |
| --- | --- | --- |
| `$releasever` | 系统主版本号 | `8` / `9` |
| `$basearch` | CPU 架构 | `x86_64` / `aarch64` |
| `$contentdir` | 内容目录 | `os` / `repo` |
| `$infra` | 基础设施类型 | `stock` / `container` |

#### 常用操作

```shell
# 列出所有已启用的仓库
dnf repolist

# 列出所有仓库（含禁用的）
dnf repolist all

# 临时禁用某个仓库
dnf --disablerepo=epel install package

# 临时启用某个仓库
dnf --enablerepo=cr install package

# 查看仓库详细信息
dnf repoinfo epel

# 清理并重建缓存
dnf clean all && dnf makecache
```

#### 自定义仓库配置示例

创建 `/etc/yum.repos.d/custom.repo`：

```ini
[custom-repo]
name=Custom Repository
baseurl=https://mirror.example.com/centos/8/AppStream/x86_64/os/
enabled=1
gpgcheck=1
gpgkey=https://mirror.example.com/RPM-GPG-KEY-custom
```

#### 优先级配置

安装 `dnf-plugins-core` 后可设置优先级：

```shell
dnf install dnf-plugins-core
```

在 `.repo` 文件中添加 `priority`：

```ini
[base]
name=CentOS Base
baseurl=https://mirrors.aliyun.com/centos/$releasever/BaseOS/$basearch/os/
enabled=1
gpgcheck=1
priority=1              # 优先级：1 最高，99 最低

[epel]
name=EPEL
baseurl=https://mirrors.aliyun.com/epel/8/Everything/$basearch/
enabled=1
gpgcheck=1
priority=10
```

> 建议：官方源 `priority=1`，EPEL 等第三方源 `priority=10`，避免覆盖系统核心包。

#### 忽略仓库

```shell
# 临时忽略单个仓库
dnf --disablerepo=epel install package

# 永久禁用
# 编辑 .repo 文件，将 enabled=1 改为 enabled=0
```

#### GPG 签名管理

```shell
# 导入 GPG 密钥
rpm --import https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official

# 查看已导入的密钥
rpm -qa gpg-pubkey*

# 删除密钥
rpm -e gpg-pubkey-xxxxxxxx-xxxxxxxx
```

#### 备份与恢复

```shell
# 备份所有 repo 文件
cp -r /etc/yum.repos.d/ /etc/yum.repos.d.bak/

# 恢复
cp -r /etc/yum.repos.d.bak/* /etc/yum.repos.d/
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

| 参数  | 说明                     |
| ----- | ------------------------ |
| `-o`  | 把记录写到文件中         |
| `-a`  | 把记录追加到文件中       |
| `-d`  | 打印调试输出             |
| `-q`  | 安静模式（没有输出）     |
| `-v`  | 冗长模式（缺省设置）     |
| `-nv` | 关掉冗长模式             |
| `-i`  | 下载文件中出现的 URLs    |
| `-F`  | 把输入文件当作 HTML 格式 |

### 下载参数

| 参数           | 说明                                 |
| -------------- | ------------------------------------ |
| `-t`           | 设定最大尝试链接次数（0 表示无限制） |
| `-O`           | 把文档写到文件中                     |
| `-nc`          | 不要覆盖存在的文件                   |
| `-c`           | 接着下载没下载完的文件               |
| `-N`           | 不要重新下载文件除非比本地文件新     |
| `-S`           | 打印服务器的回应                     |
| `-T`           | 设定响应超时的秒数                   |
| `-w`           | 两次尝试之间间隔秒数                 |
| `-Q`           | 设置下载的容量限制                   |
| `--limit-rate` | 限定下载速率                         |

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

---

## MySQL 安装

### CentOS 安装（yum方式）

#### 1. 卸载 MariaDB

有些 Linux 会自带 MariaDB 数据库，需要先卸载。

```shell
# 列出已安装的 MariaDB 包
rpm -qa | grep mariadb

# 卸载 MariaDB
rpm -e --nodeps mariadb-libs-5.5.68-1.el7.x86_64
```

#### 2. 下载并安装 MySQL yum 库

```shell
cd /home/
yum install wget -y
wget https://repo.mysql.com//mysql80-community-release-el7-1.noarch.rpm
rpm -Uvh mysql80-community-release-el7-1.noarch.rpm
```

#### 3. 选择 MySQL 版本

编辑 `/etc/yum.repos.d/mysql-community.repo`：

```shell
vim /etc/yum.repos.d/mysql-community.repo
```

选择要安装的 MySQL 版本：

```shell
[mysql57-community]
name=MySQL 5.7 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/7/$basearch/
enabled=0  # 安装5.7时改为1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

[mysql80-community]
name=MySQL 8.0 Community Server
baseurl=http://repo.mysql.com/yum/mysql-8.0-community/el/7/$basearch/
enabled=1  # 安装5.7时改为0
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
```

> `enabled=0` 为禁用，`enabled=1` 为启用。

#### 4. 安装并启动 MySQL

```shell
yum install mysql-community-server
service mysqld start
```

如果出现 GPG 错误，导入密钥：

```shell
# CentOS
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022

# Ubuntu
wget -q -O - https://repo.mysql.com/RPM-GPG-KEY-mysql-2022 | apt-key add -

yum install mysql-community-server
```

#### 5. 配置 MySQL

```shell
# 查看初始密码
sudo grep 'temporary password' /var/log/mysqld.log

# 登录 MySQL
mysql -u root -p

# 设置密码验证强度等级
set global validate_password_policy=LOW;

# 设置密码长度为 6 位
set global validate_password_length=6;

# 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';

# 开启远程登录
use mysql;
select user,host from user;
update user set host = '%' where user = 'root';
flush privileges;
```

---

### AlmaLinux 安装（dnf方式）

#### 1. 更新系统

```shell
sudo dnf clean all
sudo dnf update
sudo dnf groupinstall "Development Tools"
```

#### 2. 安装 MySQL

```shell
sudo dnf install mysql mysql-server
```

#### 3. 设置表名不区分大小写

编辑 `/etc/my.cnf.d/mysql-server.cnf`：

```shell
vim /etc/my.cnf.d/mysql-server.cnf

# 在 [mysqld] 中添加
lower_case_table_names=1
```

初始化后验证：

```mysql
show global variables like '%lower_case%';
# lower_case_table_names 应为 1
```

#### 4. 启动并设置开机自启

```shell
sudo systemctl enable --now mysqld
sudo systemctl status mysqld
```

确认安装版本：

```shell
mysql --version
```

#### 5. 安全配置

```shell
mysql_secure_installation
```

按提示操作：

```shell
Enter current password for root (enter for none): 直接按 Enter
Set root password? [Y/n]: Y
New password: 输入密码
Re-enter new password: 再次输入密码
Remove anonymous users? [Y/n]: Y
Disallow root login remotely? [Y/n]: Y
Remove test database and access to it? [Y/n]: Y
Reload privilege tables now? [Y/n]: Y
```

#### 6. 创建数据库和用户

```shell
sudo mysql -u root -p
```

```mysql
CREATE DATABASE test_db;
CREATE USER 'test_user'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL ON test_db.* TO 'test_user'@'localhost';
FLUSH PRIVILEGES;
EXIT
```

---

### AlmaLinux 安装（rpm手动方式）

#### 1. 下载并解压安装包

```shell
mkdir mysql_install
cd mysql_install
wget https://cdn.mysql.com/archives/mysql-5.7/mysql-5.7.41-1.el7.x86_64.rpm-bundle.tar
tar -xvf mysql-5.7.41-1.el7.x86_64.rpm-bundle.tar
```

#### 2. 安装依赖

```shell
rpm -ivh mysql-community-common-5.7.41-1.el7.x86_64.rpm

rpm -ivh mysql-community-libs-5.7.41-1.el7.x86_64.rpm

rpm -ivh mysql-community-libs-compat-5.7.41-1.el7.x86_64.rpm
```

如果出现依赖错误：

```shell
# 缺少 libcrypto.so.10
dnf install -y https://repo.almalinux.org/almalinux/8/AppStream/x86_64/os/Packages/compat-openssl10-1.0.2o-4.el8_6.x86_64.rpm
```

```shell
rpm -ivh mysql-community-devel-5.7.41-1.el7.x86_64.rpm
```

如果出现依赖错误：

```shell
# 缺少 pkg-config
dnf install openssl-devel -y
```

```shell
rpm -ivh mysql-community-client-5.7.41-1.el7.x86_64.rpm
```

如果出现依赖错误：

```shell
# 缺少 libncurses
dnf install libncurses* -y
dnf install epel-release -y
dnf install ncurses-compat-libs -y
```

```shell
rpm -ivh mysql-community-server-5.7.41-1.el7.x86_64.rpm
```

如果出现提示：

```shell
# 修改 /usr/lib/tmpfiles.d/mysql.conf
vim /usr/lib/tmpfiles.d/mysql.conf
# 将 /var/run/mysqld 改为 /run/mysqld

# 缺少 libcrypt
dnf install -y libxcrypt-compat

# 缺少 perl
dnf install -y perl.x86_64

# 缺少 net-tools
dnf install net-tools -y
```

```shell
rpm -ivh mysql-community-embedded-compat-5.7.41-1.el7.x86_64.rpm
```

#### 3. 编辑配置文件

```shell
vim /etc/my.cnf
```

配置示例：

```shell
[client]
port = 3306
user = mysql

[mysqld]
basedir=/usr/local/mysql
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
symbolic-links=0
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
max_connections = 400
character-set-server = utf8mb4
explicit_defaults_for_timestamp = true
lower_case_table_names = 1
```

#### 4. 初始化并启动

```shell
mysqld --defaults-file=/etc/my.cnf --initialize-insecure --user=mysql

# 给 mysql 用户添加数据目录权限
chown mysql:mysql /var/lib/mysql -R

systemctl start mysqld
systemctl enable mysqld

# 查看随机密码（如果有）
grep 'temporary password' /var/log/mysqld.log

# 若没有提示密码，可直接登录
mysql -uroot
```

---

## Redis 安装

### dnf 方式

#### 1. 更新软件包缓存

```shell
sudo dnf makecache
```

#### 2. 安装 Redis

```shell
sudo dnf install redis
```

#### 3. 启动并设置开机自启

```shell
sudo systemctl start redis
sudo systemctl enable redis
```

#### 4. 验证服务状态

```shell
sudo systemctl is-enabled redis
sudo systemctl status redis
redis-server
```

#### 5. 配置 Redis

编辑配置文件：

```shell
sudo vim /etc/redis.conf
```

#### 6. Redis-CLI 使用

```shell
redis-cli
auth <password>
```

### 源码编译方式

#### 1. 下载并解压

```shell
wget https://download.redis.io/releases/redis-6.2.14.tar.gz
tar -zxvf redis-6.2.14.tar.gz
cd redis-6.2.14
```

#### 2. 编译安装

```shell
# 编译并安装，默认安装在 /usr/local/bin/
make && make install

# 编译并指定安装目录
make && make PREFIX=/test/www/server/redis-6.2.14 install

# 测试
make test
```

---

## Node.js 安装

### AlmaLinux dnf 方式

```shell
dnf update -y
dnf install nodejs -y
```

### 编译包方式（Prebuilt Binaries）

#### 1. 解压并移动

```shell
tar -xf node-v16.20.2-linux-x64.tar.xz
mv node-v16.20.2-linux-x64 /var/lib
```

#### 2. 创建软链接

```shell
ln -s /var/lib/node-v16.20.2-linux-x64/bin/node /usr/bin/node
ln -s /var/lib/node-v16.20.2-linux-x64/bin/npm /usr/bin/npm
ln -s /var/lib/node-v16.20.2-linux-x64/bin/npx /usr/bin/npx
```

### 手动安装方式

#### 1. 解压并移动

```shell
tar -xvf node-v18.12.1-linux-x64.tar.xz
mv node-v18.12.1-linux-x64 nodejs
mv nodejs /usr/local
```

#### 2. 配置环境变量

**方式一：软链接**

```shell
ln -s /usr/local/nodejs/bin/npm /usr/local/bin/
ln -s /usr/local/nodejs/bin/node /usr/local/bin/
```

**方式二：环境变量**

```shell
vim /etc/profile
# 添加以下行
export PATH=$PATH:/usr/local/nodejs/bin
```

#### 3. 验证安装

```shell
node -v
npm -v
```

---

## .Net SDK 安装

### CentOS 7

```shell
sudo rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm
sudo yum install dotnet-sdk-6.0
dotnet --info
```

---

## 7zip 安装

```shell
# 更新系统数据库
sudo dnf update -y

# 启用 Epel repository
sudo dnf install epel-release

# 安装 7-Zip
sudo dnf install p7zip p7zip-plugins

# 检验是否安装成功
7z
```

### 使用方法

```shell
# 创建压缩文件（选项 a 用于压缩）
7z a data.7z data.txt

# 显示存档文件详细信息列表
7z l data.7z

# 解压缩
# 注意：-o 用来指定解压缩目录，-o 后没有空格，直接接目录
7z x data.7z -r -o./data
```

---

## Supervisor 安装

Supervisor 是进程守护工具，用于管理和监控进程。

### 安装

```shell
sudo dnf update -y
sudo dnf install epel-release -y
sudo dnf install supervisor -y
```

### 配置

编辑 `/etc/supervisord.conf`：

```shell
sudo vim /etc/supervisord.conf

# 开启 web 服务管理界面
# 修改 port 中的 ip 为 0.0.0.0，以允许任何 ip 访问
# 修改用户名密码
# 去掉行首的 ; 以使配置生效
[inet_http_server]
port=0.0.0.0:9001
username=user
password=123

# 修改包含子配置文件，文件类型为 .conf，默认为 .ini
[include]
files = supervisord.d/*.conf
```

### 常用命令

```shell
# 启动 supervisord
sudo systemctl start supervisord

# 开机启动
sudo systemctl enable supervisord

# 检查是否开机启动
sudo systemctl is-enabled supervisord

# 检查状态
sudo systemctl status supervisord

# 更新新配置（不会重启原来已运行的程序）
sudo supervisorctl update

# 载入所有配置并重启所有进程
sudo supervisorctl reload

# 启动某个进程
sudo supervisorctl start xxx

# 重启某个进程
sudo supervisorctl restart xxx

# 停止某个进程
sudo supervisorctl stop xxx

# 停止全部进程
sudo supervisorctl stop all

# 查看服务状态
sudo supervisorctl status
```

### 程序配置示例

创建 `/etc/supervisord.d/ckadminnetcore.conf`：

```conf
[program:ckadminnetcore]
command=dotnet CK.Admin.WebApi.dll --urls http://[*]:8888
directory=/root/www/ckadminnetcore/publish
environment=ASPNETCORE_ENVIRONMENT=Production
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/ckadminnetcore/err.log
stdout_logfile=/var/log/ckadminnetcore/out.log
stopasgroup=true
```
---

## starship

### 安装

首先需确认安装zsh，如何安装参考 ohmyzsh 安装

#### 官方脚本

```bash
curl -sS https://starship.rs/install.sh | sh
```

#### 包管理器

- RHEL

  ```bash
  dnf copr enable atim/starship
  dnf install starship
  ```

- ubuntu

  ```bash
  apt install starship
  ```

#### 设置 Shell 启用

编辑 `~/.zshrc`，在文件末尾添加以下内容：

```bash
# ===== History 配置 =====
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
setopt HIST_IGNORE_DUPS        # 忽略连续重复命令
setopt HIST_IGNORE_ALL_DUPS    # 忽略所有重复命令
setopt HIST_FIND_NO_DUPS       # 搜索时忽略重复
setopt HIST_IGNORE_SPACE       # 忽略以空格开头的命令
setopt HIST_SAVE_NO_DUPS       # 保存时忽略重复
setopt SHARE_HISTORY           # 共享 history
setopt APPEND_HISTORY          # 追加 history
setopt INC_APPEND_HISTORY      # 立即追加


# ===== 补全系统初始化（必须在插件之前） =====
fpath=(~/.zsh/zsh-completions/src $fpath)
autoload -Uz compinit
compinit -C  # 使用缓存，跳过安全检查，加快启动
zstyle ':completion:*' menu select


# ===== 插件（顺序重要） =====
source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
source ~/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh


# starship start
eval "$(starship init zsh)"
# starship end


autoload -Uz history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end history-search-end
```

#### 安装 zsh-completions 补全插件

[zsh-completions](https://github.com/zsh-users/zsh-completions) 提供额外的补全定义，增强 Tab 补全功能。

```bash
git clone https://github.com/zsh-users/zsh-completions ~/.zsh/zsh-completions

# 国内镜像
git clone https://gitee.com/mirrors/zsh-completions.git ~/.zsh/zsh-completions
```

#### 安装 zsh-autosuggestions 和 zsh-syntax-highlighting

这两个插件也可以独立于 oh-my-zsh 安装到 `~/.zsh/` 目录：

```bash
# zsh-autosuggestions（命令提示）
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions

# zsh-syntax-highlighting（语法高亮）
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.zsh/zsh-syntax-highlighting
```

> 如果已安装 oh-my-zsh，也可以使用其插件方式安装，详见 [ohmyzsh 推荐插件](#推荐插件)。

在文件末尾添加以下内容

```bash
# starship start
eval "$(starship init zsh)"
# starship end
```

### 配置

先创建 `~/.config/starship.toml`

```bash
mkdir -p ~/.config && touch ~/.config/starship.toml
```

内容

```bash
"$schema" = 'https://starship.rs/config-schema.json'

format = """
[](red)\
$os\
$username\
[](bg:peach fg:red)\
$directory\
[](bg:yellow fg:peach)\
$git_branch\
$git_status\
[](fg:yellow bg:green)\
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
[](fg:green bg:sapphire)\
$conda\
[](fg:sapphire bg:lavender)\
$time\
[ ](fg:lavender)\
$cmd_duration\
$line_break\
$character"""

palette = 'catppuccin_mocha'

[os]
disabled = false
style = "bg:red fg:crust"

[os.symbols]
Windows = ""
Ubuntu = "󰕈"
SUSE = ""
Raspbian = "󰐿"
Mint = "󰣭"
Macos = "󰀵"
Manjaro = ""
Linux = "󰌽"
Gentoo = "󰣨"
Fedora = "󰣛"
Alpine = ""
Amazon = ""
Android = ""
AOSC = ""
Arch = "󰣇"
Artix = "󰣇"
CentOS = ""
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
"Downloads" = " "
"Music" = "󰝚 "
"Pictures" = " "
"Developer" = "󰲋 "

[git_branch]
symbol = ""
style = "bg:yellow"
format = '[[ $symbol $branch ](fg:crust bg:yellow)]($style)'

[git_status]
style = "bg:yellow"
format = '[[($all_status$ahead_behind )](fg:crust bg:yellow)]($style)'

[nodejs]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[bun]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[c]
symbol = " "
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[rust]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[golang]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[php]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[java]
symbol = " "
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[kotlin]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[haskell]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version) ](fg:crust bg:green)]($style)'

[python]
symbol = ""
style = "bg:green"
format = '[[ $symbol( $version)(\(#$virtualenv\)) ](fg:crust bg:green)]($style)'

[docker_context]
symbol = ""
style = "bg:sapphire"
format = '[[ $symbol( $context) ](fg:crust bg:sapphire)]($style)'

[conda]
symbol = "  "
style = "fg:crust bg:sapphire"
format = '[$symbol$environment ]($style)'
ignore_base = false

[time]
disabled = false
time_format = "%R"
style = "bg:lavender"
format = '[[  $time ](fg:crust bg:lavender)]($style)'

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
format = " in $duration "
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
overlay2 = "#939ab7"
overlay1 = "#8087a2"
overlay0 = "#6e738d"
surface2 = "#5b6078"
surface1 = "#494d64"
surface0 = "#363a4f"
base = "#24273a"
mantle = "#1e2030"
crust = "#181926"


```

## ohmyzsh 安装

ohmyzsh 是一个管理 Zsh 配置的框架，提供丰富的主题和插件。

### 安装 Zsh

```shell
dnf install -y zsh
```

### 安装 ohmyzsh

| 方式             | 命令                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| curl             | `sh -c "$(curl -fsSL https://install.ohmyz.sh/)"`                                    |
| wget             | `sh -c "$(wget -O- https://install.ohmyz.sh/)"`                                      |
| 国内镜像（curl） | `sh -c "$(curl -fsSL https://gitee.com/pocmon/ohmyzsh/raw/master/tools/install.sh)"` |
| 国内镜像（wget） | `sh -c "$(wget -O- https://gitee.com/pocmon/ohmyzsh/raw/master/tools/install.sh)"`   |

> 注意：同意使用 oh-my-zsh 的配置模板覆盖已有的 `.zshrc`。

### 从 .bashrc 迁移配置（可选）

```shell
# 查看 bash 配置文件
cat ~/.bashrc

# 编辑 zsh 配置文件并粘贴自定义配置
vim ~/.zshrc

# 启动新的 zsh 配置
source ~/.zshrc
```

### 配置主题

```shell
vim ~/.zshrc

# 修改主题
ZSH_THEME='agnoster'

source ~/.zshrc
```

### 切换为默认 Shell

```shell
dnf install util-linux-user -y
chsh -s /bin/zsh

# 查看默认 Shell
echo $SHELL
```

### 推荐主题

#### Powerlevel10K

```shell
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# 中国用户可以使用 gitee 镜像
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

在 `~/.zshrc` 设置：

```shell
ZSH_THEME="powerlevel10k/powerlevel10k"
```

若是 AlmaLinux minimal 系统，需先安装 `"Development Tools"`：

```shell
dnf groupinstall "Development Tools" -y
```

### 推荐插件

#### zsh-autosuggestions

命令提示插件，按下右键可快速采用建议。

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 国内镜像
git clone https://gitee.com/mirrors/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

#### zsh-syntax-highlighting

命令语法校验插件，合法命令显示绿色，非法显示红色。

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 国内镜像
git clone https://gitee.com/mirror-luyi/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

#### fzf

[Fzf](https://github.com/junegunn/fzf) 是一个命令行模糊查找工具，支持文件、历史命令、进程等搜索。

安装

- RHEL

  ```bash
  dnf install epel-release
  dnf install fzf
  ```

- Ubuntu

  ```bash
  apt install fzf
  ```

#### z（内置）

文件夹快捷跳转插件，输入目标文件夹名称即可快速跳转。

#### extract（内置）

解压任何压缩文件，使用 `x` 命令即可。

#### web-search（内置）

在命令行中使用搜索引擎搜索。

### 启用插件

修改 `~/.zshrc`：

```shell
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search fzf)
```

执行 `source ~/.zshrc` 生效。

### 卸载

> 卸载后，会把 ~/.zshrc 重命名为 .zshrc.omz-uninstalled-时间戳，此为 oh my zsh 的备份功能

```shell
uninstall_oh_my_zsh
```

### 手动更新

```shell
upgrade_oh_my_zsh
```

---

## ElasticSearch 安装

### 创建仓库文件

```shell
cd /etc/yum.repos.d
vim elasticsearch.repo
```

内容：

```shell
[elasticsearch]
name=Elasticsearch repository for 8.x packages
baseurl=https://artifacts.elastic.co/packages/8.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=0
autorefresh=1
type=rpm-md
```

### 安装

```shell
dnf install --enablerepo=elasticsearch elasticsearch -y
```

---

## Jenkins 安装

### 安装 Java

Jenkins 需要 Java JRE v11 或 v17：

```shell
sudo dnf install java-17-openjdk
java -version
```

### 添加 Jenkins 仓库

```shell
wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
```

### 安装 Jenkins

```shell
sudo dnf makecache
sudo dnf install fontconfig
sudo dnf install jenkins
```

### 启动并验证

```shell
sudo systemctl start jenkins
sudo systemctl status jenkins
```

### 修改端口

编辑 `/usr/lib/systemd/system/jenkins.service`：

```shell
Environment="JENKINS_PORT=16060"

# 重新加载配置
systemctl daemon-reload
```

### 修改用户及用户组

```shell
User=root
Group=root

systemctl daemon-reload
```

### 解决汉化不全问题

添加 `-Duser.language=C.UTF-8`：

```shell
Environment="JAVA_OPTS=-Djava.awt.headless=true -Duser.language=C.UTF-8"

systemctl daemon-reload
```

### 解决 Jenkins 无法拉取 TLS 1.0 的老旧 SVN 项目

Java JDK 禁用了 TLS 1.0 协议，需修改 `java.security` 配置文件开启。

找到启动 Jenkins 的 Java JDK 目录下的 `conf/security/java.security` 文件：

```shell
vim /etc/java-17-openjdk/conf/security/java.security
```

找到 `jdk.tls.disabledAlgorithms` 配置项，删除 `TLSv1`、`TLSv1.1`、`3DES_EDE_CBC`：

```shell
# 原配置：
jdk.tls.disabledAlgorithms=SSLv3, TLSv1, TLSv1.1, DTLSv1.0, RC4, DES, \
    MD5withRSA, DH keySize < 1024, EC keySize < 224, 3DES_EDE_CBC, anon, NULL, \
    ECDH

# 修改为：
jdk.tls.disabledAlgorithms=SSLv3, DTLSv1.0, RC4, DES, \
    MD5withRSA, DH keySize < 1024, EC keySize < 224, anon, NULL, \
    ECDH
```

保存后重启 Jenkins：

```shell
systemctl restart jenkins
```

### 升级

升级前备份配置文件：

```shell
cp -r /usr/lib/systemd/system/jenkins.service /usr/lib/systemd/system/jenkins.service.bak
dnf upgrade jenkins
```

---

## Certbot 安装

Certbot 是用于自动化管理 Let's Encrypt SSL 证书的工具。

### 安装 snapd

#### 1. 添加 EPEL 仓库

```shell
dnf install epel-release
dnf upgrade
```

#### 2. 安装 snapd

```shell
dnf install snapd
```

#### 3. 启用 systemd 单元

```shell
systemctl enable --now snapd.socket
```

#### 4. 创建符号链接

```shell
ln -s /var/lib/snapd/snap /snap
```

退出并重新登录或重启系统。

### 安装 Certbot

```shell
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
```

---

## frp 安装

frp 是内网穿透工具，用于将内网服务暴露到公网。

### 配置服务端 (frps)

在公网服务器上部署。

#### 1. 创建服务文件

```shell
sudo vim /etc/systemd/system/frps.service
```

#### 2. 写入配置

```toml
[Unit]
Description=FRP Server Daemon
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
ExecStart=/usr/local/frp/frps -c /usr/local/frp/frps.toml
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

#### 3. 启动并设置开机自启

```shell
sudo systemctl daemon-reload
sudo systemctl start frps
sudo systemctl enable frps
sudo systemctl status frps
```

### 配置客户端 (frpc)

在内网机器上部署。

#### 1. 创建服务文件

```shell
sudo vim /etc/systemd/system/frpc.service
```

#### 2. 写入配置

```toml
[Unit]
Description=FRP Client Daemon
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
ExecStart=/usr/local/frp/frpc -c /usr/local/frp/frpc.toml
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

#### 3. 启动并设置开机自启

```shell
sudo systemctl daemon-reload
sudo systemctl start frpc
sudo systemctl enable frpc
sudo systemctl status frpc
```

---

## 字体安装

### 查看已安装字体

```shell
fc-list
```

### 下载字体

```shell
git clone https://gitee.com/mirrors/nerd-fonts.git --depth 1
```

### 系统级安装

#### 1. 导航到字体目录

```shell
cd /usr/share/fonts
# 若不存在则创建
sudo mkdir /usr/share/fonts
```

#### 2. 复制字体

```shell
sudo cp -r ~/nerd-fonts/patched-fonts/Hack /usr/share/fonts
```

#### 3. 更新字体缓存

```shell
sudo fc-cache -f -v
```

### 用户级安装

#### 1. 创建用户字体目录

```shell
mkdir ~/.fonts
```

#### 2. 复制字体

```shell
cp -r ~/nerd-fonts/patched-fonts/Hack ~/.fonts
```

#### 3. 更新字体缓存

```shell
fc-cache -f -v
```

---

## Neofetch / Fastfetch 安装

系统信息展示工具。

### Neofetch

```shell
dnf install epel-release
dnf install neofetch
neofetch
```

### Fastfetch

```shell
dnf update -y
wget https://github.com/fastfetch-cli/fastfetch/releases/download/2.49.0/fastfetch-linux-amd64.rpm -O fastfetch.rpm
dnf install -y fastfetch.rpm
```

### Screenfetch

```shell
dnf install git
git clone https://github.com/KittyKatt/screenFetch.git
cp screenFetch/screenfetch-dev /usr/bin/screenfetch
chmod +x /usr/bin/screenfetch
screenfetch
```

---

## Edge / Chrome 安装

### Microsoft Edge

#### 1. 更新源

```shell
sudo dnf update -y
```

#### 2. 添加 Edge 源

```shell
sudo dnf config-manager --add-repo https://packages.microsoft.com/yumrepos/edge
```

#### 3. 再次更新源

```shell
sudo dnf update -y
```

#### 4. 安装 Edge

```shell
sudo dnf install microsoft-edge-stable -y
```

### Google Chrome

#### 1. 下载安装文件

```shell
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
```

#### 2. 安装

```shell
sudo dnf install ./google-chrome-stable_current_x86_64.rpm -y
```

---

## FastGithub 安装

GitHub 加速工具。

```shell
wget https://gitee.com/chcrazy/FastGithub/releases/download/2.1.4/fastgithub_linux-x64.zip
dnf install -y libicu

# 配置系统代理
vim /etc/profile
# 添加以下行
export http_proxy="http://127.0.0.1:38457"
export https_proxy="http://127.0.0.1:38457"

# 生效
source /etc/profile

# 解压并运行
unzip fastgithub_linux-x64.zip
cd fastgithub_linux-x64
./fastgithub
```

---

## Rsync 安装

文件同步工具。

### 安装

```shell
dnf install rsync -y
```

### 配置

编辑 `/etc/rsyncd.conf`：

```shell
uid = root
gid = root
ignore errors
hosts allow = 10.0.3.0/24
secrets file = /etc/rsyncd.secrets

[syncwspswwwroot]
path = /root/wwwroot
log file = /var/log/rsync.log
read only = yes

[mysql_bakup]
path = /root/mysql_bakup
read only = yes
```

---

## Nginx 安装

### RHEL/CentOS 安装（官方仓库）

适用于 Red Hat Enterprise Linux 及其衍生版本（CentOS、Oracle Linux、Rocky Linux、AlmaLinux）。

#### 1. 安装前置依赖

```shell
sudo dnf install dnf-utils
```

#### 2. 创建仓库文件

创建 `/etc/yum.repos.d/nginx.repo`：

```shell
sudo vim /etc/yum.repos.d/nginx.repo
```

写入以下内容：

```ini
[nginx-stable]
name=nginx stable repo
baseurl=https://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=https://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```

> 默认使用 stable 稳定版仓库。如需使用 mainline 主线版，执行：
> ```shell
> sudo dnf config-manager --enable nginx-mainline
> ```

#### 3. 安装 Nginx

```shell
sudo dnf install nginx
```

安装时会提示接受 GPG 密钥，确认指纹为 `573B FD6B 3D8F BC64 1079 A6AB ABF5 BD82 7BD9 BF62` 后接受。

#### 4. 启动并验证

```shell
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

#### 5. 防火墙放行

```shell
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

### 源码编译安装

```shell
tar -zxvf nginx-1.21.4.tar.gz
cd nginx-1.21.4/
./configure
make
make install
```

### AlmaLinux源 dnf 安装

```shell
# 确保软件是最新的
sudo dnf clean all
sudo dnf update
sudo dnf groupinstall "Development Tools"

# 安装
sudo dnf install nginx

# 启动并设置开机自启
sudo systemctl restart nginx
sudo systemctl status nginx
sudo systemctl enable nginx

# 防火墙放行 HTTP 和 HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 目录结构

| 目录/文件                    | 说明                            |
| ---------------------------- | ------------------------------- |
| `/etc/nginx`                 | 包含所有 Nginx 配置文件的主目录 |
| `/etc/nginx/nginx.conf`      | 主要的 Nginx 配置文件           |
| `/etc/nginx/sites-available` | 定义各个网站的目录              |
| `/etc/nginx/sites-enabled`   | Nginx 积极服务的网站列表        |
| `/var/log/nginx`             | Nginx 日志目录                  |