---
title: Linux系统监控
date: 2021-04-07 16:04:58
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/00E0F0ED-9F1C-407A-9AA6-545649D919F4.jpeg
tags: [Linux, Shell, 系统监控]
categories: [操作系统, Linux]
---

# Linux系统监控

## CPU信息

### lscpu 命令

查看 CPU 的统计信息。

```shell
lscpu
```

**输出示例**：

```
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                40
On-line CPU(s) list:   0-39
Thread(s) per core:    2
Core(s) per socket:    10
Socket(s):             2
NUMA node(s):          2
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 85
Model name:            Intel(R) Xeon(R) Silver 4210 CPU @ 2.20GHz
Stepping:              7
CPU MHz:               999.963
CPU max MHz:           3200.0000
CPU min MHz:           1000.0000
BogoMIPS:              4400.00
Virtualization:        VT-x
L1d cache:             32K
L1i cache:             32K
L2 cache:              1024K
L3 cache:              14080K
```

### 查看 CPU 详细信息

```shell
cat /proc/cpuinfo
```

**输出示例**：

```
processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 85
model name      : Intel(R) Xeon(R) Silver 4210 CPU @ 2.20GHz
stepping        : 7
microcode       : 0x5003303
cpu MHz         : 999.963
cache size      : 14080 KB
physical id     : 0
siblings        : 20
core id         : 0
cpu cores       : 10
```

---

## 内存信息

### free 命令

概要查看内存情况。

```shell
free -m
```

**输出示例**（单位：MB）：

```
              total        used        free      shared  buff/cache   available
Mem:          31595       14770        3182         253       13643       16150
Swap:         65535           0       65535
```

### 查看内存详细使用

```shell
cat /proc/meminfo
```

**输出示例**：

```
MemTotal:       32354112 kB
MemFree:         3377564 kB
MemAvailable:   16657484 kB
Buffers:          725916 kB
Cached:         12127832 kB
SwapCached:            0 kB
Active:         21031256 kB
Inactive:        5694748 kB
```

---

## 硬盘信息

### lsblk 命令

查看硬盘和分区分布。

```shell
lsblk
```

**输出示例**：

```
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0 447.1G  0 disk
├─sda1   8:1    0   200M  0 part /boot/efi
├─sda2   8:2    0     1G  0 part /boot
├─sda3   8:3    0   380G  0 part /
└─sda4   8:4    0    64G  0 part [SWAP]
sdb      8:16   0   2.2T  0 disk
└─sdb1   8:17   0   2.2T  0 part /test
```

### fdisk 命令

查看硬盘和分区的详细信息。

```shell
fdisk -l
```

**输出示例**：

```
磁盘 /dev/sda：480.1 GB, 480103981056 字节，937703088 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 4096 字节
I/O 大小(最小/最佳)：4096 字节 / 4096 字节
磁盘标签类型：gpt
Disk identifier: F6E9395D-610B-4BB3-B289-8F6A96811113

#         Start          End    Size  Type            Name
 1         2048       411647    200M  EFI System      EFI System Partition
 2       411648      2508799      1G  Microsoft basic
 3      2508800    799426559    380G  Microsoft basic
 4    799426560    933644287     64G  Linux swap
```

---

## 网卡信息

### 查看网卡硬件信息

```shell
lspci | grep -i 'eth'
```

**输出示例**：

```
04:00.0 Ethernet controller: Broadcom Inc. and subsidiaries NetXtreme BCM5720 2-port Gigabit Ethernet PCIe
04:00.1 Ethernet controller: Broadcom Inc. and subsidiaries NetXtreme BCM5720 2-port Gigabit Ethernet PCIe
```

### 查看所有网络接口

```shell
ifconfig -a
```

**输出示例**：

```
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:66:fe:52:a2  txqueuelen 0  (Ethernet)

em1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.6.20  netmask 255.255.255.0  broadcast 192.168.6.255
        ether 2c:ea:7f:a9:fc:76  txqueuelen 1000  (Ethernet)
```

---

## 综合监控

### top 命令

动态显示进程和系统资源使用情况。

```shell
top
```

### htop 命令

更友好的交互式进程查看器（需安装）。

```shell
# 安装
yum install -y htop

# 运行
htop
```