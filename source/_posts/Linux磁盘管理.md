---
title: Linux磁盘管理
date: 2021-04-07 16:04:58
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/00E0F0ED-9F1C-407A-9AA6-545649D919F4.jpeg
tags: [Linux, Shell, 磁盘管理]
categories: [操作系统, Linux]
---

# Linux磁盘管理

## 磁盘空间查看

### df 命令

查看磁盘整体情况。

```shell
# 统计磁盘整体情况
df -lh
```

### du 命令

查看目录占用空间。

```shell
# 查看根目录下文件夹大小
du -sh /*
```

---

## 安装与分区

### Linux分区顺序

1. **boot 分区**：引导启动分区，通常 200-500M
2. **swap 分区**：缓存分区，通常为物理内存的 2 倍
3. **根分区（/）**：剩余空间分配给根分区
4. **home 分区**：可选

---

## LVM扩容

### 旧有卷扩容

将 `/home` 部分空间合并至 `/` 下。

#### 1. 查看当前分区

```shell
df -h
```

#### 2. 查看卷的文件系统类型

```shell
mount | grep home
```

#### 3. 安装备份工具

```shell
dnf install -y xfsdump
```

#### 4. 备份 /home

```shell
xfsdump -f ~/sdb_dump/ /home -M sdb_home -L sdb_home_1
```

#### 5. 卸载 /home

```shell
umount /home/
df -h
```

#### 6. 移除逻辑卷

> ⚠️ 删除前请确保重要文件已备份！

```shell
lvremove /dev/mapper/almalinux-home
```

#### 7. 扩展根分区

```shell
# 扩展根分区增加8.7G
lvresize -L +8.7G /dev/mapper/almalinux-root
lsblk
```

#### 8. 扩展文件系统

```shell
xfs_growfs /
df -h
```

#### 9. 重新创建 home 逻辑卷

```shell
lvcreate -L 9G -n home almalinux
lsblk
```

#### 10. 扩展剩余空间给 home

```shell
lvextend -l +100%FREE -n /dev/mapper/almalinux-home
lsblk
```

#### 11. 格式化并挂载

```shell
# 格式化
mkfs.xfs /dev/mapper/almalinux-home

# 挂载（因lv名称和挂载点不变，无需修改/etc/fstab）
mount -a
df -Th
```

#### 12. 还原数据

```shell
xfsrestore -f sdb_dump /home/
```

---

### 新加卷扩容

#### 1. 查看现有分区大小

```shell
df -Th
```

#### 2. 查看扩容后磁盘大小

```shell
lsblk
```

#### 3. 创建分区

```shell
fdisk /dev/sda
```

**fdisk 操作步骤**：
- 输入 `n` 创建新分区
- 选择分区类型（主分区/扩展分区）
- 设置分区大小
- 输入 `w` 保存更改

#### 4. 刷新分区并创建物理卷

```shell
partprobe /dev/sda
pvcreate /dev/sda4
```

#### 5. 查看卷组

```shell
vgdisplay
```

#### 6. 将物理卷扩展到卷组

```shell
vgextend rl /dev/sda4
```

#### 7. 查看逻辑卷

```shell
lvdisplay
```

#### 8. 扩展根分区逻辑卷

```shell
lvextend -l +100%FREE /dev/rl/root
```

#### 9. 刷新根分区

```shell
xfs_growfs /dev/rl/root
```

---

## 分区格式转换

### Microsoft 基本数据 → Linux 文件系统

#### 1. 查看当前分区类型

```shell
fdisk -l
```

#### 2. 转换分区类型

```shell
fdisk /dev/sdb
# 输入 t 命令（转换分区类型）
t
# 输入 20（Linux file system）
20
# 输入 w（写入更改）
w
```

#### 3. 手动挂载硬盘

```shell
mkdir /sdb
mount -t ext3 /dev/sdb1 /sdb
```

#### 4. 查看挂载结果

```shell
df -Th
```

#### 5. 设置自动挂载

查看硬盘UUID：

```shell
blkid /dev/sdb1
```

编辑 `/etc/fstab`：

```shell
vim /etc/fstab
# 添加以下行
UUID=7d592b46-68dc-41c2-bdb3-7ee410f0bb33 /sdb ext3 defaults 0 0
```

重载配置：

```shell
systemctl daemon-reload
```

---

### ext3 升级 ext4

#### 1. 确认当前文件系统类型

```shell
df -Th | grep /dev/sdb1
```

#### 2. 卸载目标分区

> ⚠️ 不能对正在使用的根分区操作

```shell
umount /dev/sdb1
```

#### 3. 检查并修复文件系统

```shell
e2fsck -f /dev/sdb1
```

#### 4. 将 ext3 转换为 ext4

```shell
tune2fs -O has_journal,extent,huge_file,flex_bg,uninit_bg,dir_nlink,extra_isize /dev/sdb1
```

#### 5. 查看转换是否成功

```shell
dumpe2fs -h /dev/sdb1 | grep features
```

确认输出中包含：`extent`、`huge_file`、`flex_bg`、`uninit_bg`、`dir_nlink`、`extra_isize`

#### 6. 再次检查文件系统

```shell
e2fsck -f /dev/sdb1
```

#### 7. 挂载并验证

```shell
mount -t ext4 /dev/sdb1 /sdb
df -Th | grep /dev/sdb1
```

#### 8. 修改 /etc/fstab

```shell
/dev/sdb1 /sdb ext4 defaults 0 0
```

---

### NTFS → ext4

#### 1. 确认目标分区

```shell
lsblk -f
```

#### 2. 卸载分区

```shell
sudo umount /dev/sda1
```

#### 3. 格式化为 ext4

```shell
sudo mkfs.ext4 /dev/sda1
```

#### 4. 验证结果

```shell
lsblk -f
```

---

## 挂载卷

### Windows 网络共享位置

#### 1. 创建挂载目录

```shell
mkdir -p /mnt/wdshare/
```

#### 2. 安装依赖

```shell
dnf install -y cifs-utils
```

#### 3. 挂载

```shell
mount -t cifs -o username=user,password=backup //192.168.0.1/备份 /mnt/wdshare/
```

#### 4. 永久挂载

编辑 `/etc/fstab`：

```shell
//192.168.0.1/备份 /mnt/wdshare/ cifs username=user,password=backup 0 0
```

重载配置：

```shell
sudo systemctl daemon-reload
sudo mount -a
```

---

### NTFS 分区

#### 1. 识别NTFS分区

```shell
sudo parted -l
```

#### 2. 创建挂载点

```shell
sudo mkdir /mnt/ntfs1
```

#### 3. 安装依赖

```shell
sudo apt update
sudo apt install fuse -y
sudo apt install ntfs-3g -y
```

#### 4. 挂载分区

```shell
sudo mount -t ntfs-3g /dev/sda1 /mnt/ntfs1/
```

#### 5. 验证挂载

```shell
df -Th
```

#### 6. 永久挂载

编辑 `/etc/fstab`：

```shell
/dev/sda1 /mnt/ntfs1 fuseblk defaults 0 0
```

重载配置：

```shell
sudo systemctl daemon-reload
```

---

## Swap配置

### 创建Swap分区

#### 1. 查看当前Swap大小

```shell
free -h
```

#### 2. 创建Swap文件

```shell
# 创建4G的swap文件
dd if=/dev/zero of=/home/swap bs=1024 count=4194304
```

> `count` 值 = 大小(M) × 1024

#### 3. 格式化Swap分区

```shell
mkswap /home/swap
```

#### 4. 启用Swap

```shell
swapon /home/swap
```

#### 5. 设置自动挂载

编辑 `/etc/fstab`：

```shell
/home/swap swap swap default 0 0
```

---

### 关闭Swap

```shell
swapoff /home/swap
```

---

### 修改Swap使用率

`swappiness` 值表示使用 swap 的倾向：
- `0`：最大限度使用物理内存
- `100`：积极使用 swap

#### 1. 查看当前值

```shell
cat /proc/sys/vm/swappiness
```

#### 2. 临时修改

```shell
sysctl vm.swappiness=60
```

#### 3. 永久修改

编辑 `/etc/sysctl.conf`：

```shell
vm.swappiness=60
```

应用更改：

```shell
sysctl -p
```

---

## 内核升级

### CentOS 7.9 内核升级

#### 1. 查看当前内核版本

```shell
uname -a
```

#### 2. 查看系统版本

```shell
cat /etc/redhat-release
```

#### 3. 导入公钥

```shell
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
```

#### 4. 安装ELRepo

```shell
yum install -y https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
```

#### 5. 安装新内核

```shell
yum --enablerepo=elrepo-kernel install kernel-ml -y &&
sed -i s/saved/0/g /etc/default/grub &&
grub2-mkconfig -o /boot/grub2/grub.cfg
```

#### 6. 重启系统

```shell
reboot
```

#### 7. 验证内核版本

```shell
uname -a
```