---
title: Linux网络配置
date: 2021-04-07 16:04:58
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/00E0F0ED-9F1C-407A-9AA6-545649D919F4.jpeg
tags: [Linux, Shell, 网络配置]
categories: [操作系统, Linux]
---

# Linux网络配置

## 配置网络

### 编辑网络配置文件

```shell
cd /etc/sysconfig/network-scripts
vi ifcfg-ens33
```

### 配置文件示例

```shell
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=dhcp
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=08913b58-0bc2-42c5-8b59-6782e0029d7b
DEVICE=ens33
ONBOOT=yes
```

> **重要**：修改 `ONBOOT=yes` 以启用网络。

### 重启网络服务

```shell
systemctl restart network
```

### 查看IP地址

```shell
ip addr
```

---

## 端口映射

### 使用 iptables 映射端口

```shell
# 将80端口映射到8080端口
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j REDIRECT --to-port 80
```

**参数说明**：
- `--dport`：目标端口
- `--to-port`：来源端口

### 查看 iptables 规则

```shell
iptables -t nat -L -n -v
```

输出示例：

```
Chain PREROUTING (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
12925 4377K DOCKER     all  --  *      *       0.0.0.0/0            0.0.0.0/0
    0     0 REDIRECT   tcp  --  *      *       0.0.0.0/0            0.0.0.0/0  tcp dpt:8080 redir ports 80
```

---

## 防火墙配置

### firewall-cmd 命令

CentOS 7 防火墙管理工具。

#### 放行端口

```shell
# 放行特定端口（永久生效）
firewall-cmd --add-port=6379/tcp --permanent
```

#### 移除端口

```shell
# 移除已放行的端口
firewall-cmd --permanent --remove-port=8080/tcp
```

#### 查询端口

```shell
# 查询端口是否开放
firewall-cmd --query-port=8080/tcp
```

#### 查看开放端口

```shell
# 查看所有开放的端口
firewall-cmd --list-all
```

#### 重载防火墙

```shell
# 修改配置后需重载生效
firewall-cmd --reload
```

#### 指定作用域放行

```shell
# 在public作用域放行端口
firewall-cmd --zone=public --add-port=3306/tcp --permanent
```

**参数说明**：

| 参数 | 说明 |
|-----|------|
| `--zone` | 作用域 |
| `--add-port` | 添加端口，格式为端口/协议 |
| `--permanent` | 永久生效，无此参数重启后失效 |

---

## 网络状态查看

### netstat 命令

```shell
# 查看监听中的端口
netstat -lnp | grep 8080
```

**参数说明**：

| 参数 | 说明 |
|-----|------|
| `-l` | 显示监控中的服务器的 Socket |
| `-n` | 直接使用 IP 地址 |
| `-p` | 显示程序识别码和名称 |

---

## 网卡信息查看

### 查看网卡硬件信息

```shell
lspci | grep -i 'eth'
```

输出示例：

```
04:00.0 Ethernet controller: Broadcom Inc. and subsidiaries NetXtreme BCM5720 2-port Gigabit Ethernet PCIe
04:00.1 Ethernet controller: Broadcom Inc. and subsidiaries NetXtreme BCM5720 2-port Gigabit Ethernet PCIe
```

### 查看所有网络接口

```shell
ifconfig -a
```