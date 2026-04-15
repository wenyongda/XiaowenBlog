---
title: ArchLinux
date: 2025-07-28 10:26:05
tags: [ArchLinux, Linux, WSL, 操作系统]
categories: [操作系统, Linux]
---

# WSL

## 安装

### 在线安装

```powershell
wsl --install archlinux
```

# 包管理器 pacman

> [pacman - Arch Linux 中文维基](https://wiki.archlinuxcn.org/wiki/Pacman)

## 安装软件

```shell
pacman -S fastfetch
```

## 更新库

```shell
pacman -Syyu
```

# Vim设置

编辑当前用户下的vim配置文件`~/.vimrc`

```shell
if has('mouse')
         set mouse-=a
endif

set number
syntax on
set ignorecase
set t_Co=256
```

# Containerd + Nerdctl

## 安装

**1. 更新系统**

首先，确保你的 Arch Linux 系统是最新的：

```Bash
sudo pacman -Syu
```

**2. 安装 Containerd**

Containerd 是一个核心的容器运行时。它作为 `containerd` 包在官方仓库中提供。

```Bash
sudo pacman -S containerd
```

安装完成后，你需要启动并启用 Containerd 服务，以便它在系统启动时自动运行：

```Bash
sudo systemctl enable --now containerd
```

你可以通过以下命令检查 Containerd 的运行状态：

```Bash
sudo systemctl status containerd
```

确保它显示为 `active (running)`。

**3.安装Nerdctl**

```bash
sudo pacman -S nerdctl
```

**4.安装CNI Plugin**

> [Releases · containernetworking/plugins (github.com)](https://github.com/containernetworking/plugins/releases)

从Github上下载

```bash
wget https://github.com/containernetworking/plugins/releases/download/v1.7.1/cni-plugins-linux-amd64-v1.7.1.tgz
```

解压到指定目录`/opt/cni/bin`

```bash
tar -zxvf cni-plugins-linux-amd64-v1.7.1.tgz -C /opt/cni/bin
```

即可完成安装

可以验证下

```bash
nerdctl run -it hello-world
```

不报错，并且输出了结果，说明已经安装好了 CNI Plugin。

![image-20250729101402474](https://rustfs.wenyongdalucky.club:443/hexo/image-20250729101402474.png)

**5.安装Buildkit**

> [Release v0.23.2 · moby/buildkit (github.com)](https://github.com/moby/buildkit/releases/tag/v0.23.2)

下载 BuildKit 二进制文件：

```bash
wget https://github.com/moby/buildkit/releases/download/v0.23.2/buildkit-v0.23.2.linux-amd64.tar.gz
```

解压到临时目录下

```bash
tar -zxvf 
```

安装 `buildctl` 和 `buildkitd`

将解压后的 `bin` 目录中的 `buildctl` 和 `buildkitd` 可执行文件移动到系统 `$PATH` 中的某个目录，例如 `/usr/local/bin`。

```bash
sudo mv /tmp/bin/buildctl /usr/local/bin/
sudo mv /tmp/bin/buildkitd /usr/local/bin/
```

验证 `buildctl` 是否在 `$PATH` 中

```bash
which buildctl
buildctl version
```

如果显示路径和版本信息，说明 `buildctl` 已经正确安装并可执行。

启动 BuildKit 守护进程 (`buildkitd`)

配置为 Systemd 服务

创建一个 systemd service 文件，例如 `/etc/systemd/system/buildkit.service`

```toml
[Unit]
Description=BuildKit Daemon
Documentation=https://github.com/moby/buildkit

[Service]
ExecStart=/usr/local/bin/buildkitd --addr unix:///run/buildkit/buildkitd.sock
Type=notify
Delegate=yes
KillMode=process
# 在某些环境中，可能需要调整用户和组
# User=buildkit
# Group=buildkit

[Install]
WantedBy=multi-user.target
```

保存后，重载 systemd 并启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable buildkit  # 设置开机自启
sudo systemctl start buildkit
```

检查 BuildKit 状态

```bash
sudo systemctl status buildkit
```

![image-20250729103241234](https://rustfs.wenyongdalucky.club:443/hexo/image-20250729103241234.png)

配置buildkitd镜像加速，解决构建时的镜像拉取问题

**BuildKit Daemon 的配置文件 (`buildkitd.toml`)：** BuildKit 守护进程 (buildkitd) 可以通过配置文件进行更高级的配置，通常是 `/etc/buildkit/buildkitd.toml`（或 rootless 模式下的 `~/.config/buildkit/buildkitd.toml`）。在这个文件中，可以配置：

- **Registry Mirrors (镜像加速器/代理)：** 为特定仓库定义镜像源，例如将 `docker.io` 的请求重定向到私有加速器。

  ```bash
  mkdir -p /etc/buildkit
  vim /etc/buildkit/buildkitd.toml
  ```

  添加以下内容
  ```toml
  # registry configures a new Docker register used for cache import or output.
  [registry."docker.io"]
    # mirror configuration to handle path in case a mirror registry requires a /project path rather than just a host:port
    mirrors = ["https://docker.m.daocloud.io",
                  "https://docker.imgdb.de",
                  "https://docker-0.unsee.tech",
                  "https://docker.hlmirror.com",
                  "https://docker.1ms.run",
                  "https://cjie.eu.org",
                  "https://func.ink",
                  "https://lispy.org",
                  "https://docker.xiaogenban1993.com"]
    # Use plain HTTP to connect to the mirrors.
    http = true
  ```

  保存后，重启服务生效

  ```bash
  systemctl restart buildkit
  ```

  

## Containerd的config.toml实现镜像加速

> [containerd/docs/cri/config.md at main · containerd/containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md#registry-configuration)

如果没有`/etc/containerd/config.toml`，执行以下命令生成默认配置

```bash
sudo containerd config default | sudo tee /etc/containerd/config.toml
```

编辑Containerd的配置文件，添加以下镜像配置

```toml
 # 找到[plugins.'io.containerd.grpc.v1.cri']配置处
[plugins.'io.containerd.grpc.v1.cri']
    disable_tcp_service = true
    stream_server_address = '127.0.0.1'
    stream_server_port = '0'
    stream_idle_timeout = '4h0m0s'
    enable_tls_streaming = false

    [plugins.'io.containerd.grpc.v1.cri'.x509_key_pair_streaming]
      tls_cert_file = ''
      tls_key_file = ''

    [plugins."io.containerd.grpc.v1.cri".containerd]
      [plugins."io.containerd.grpc.v1.cri".containerd.runtimes]
        [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
          runtime_type = "io.containerd.runc.v2"
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
          SystemdCgroup = true

    [plugins."io.containerd.grpc.v1.cri".registry] #在这里增加
      config_path = "/etc/containerd/certs.d"
```

创建目录`/etc/containerd/certs.d/docker.io`

```shell
mkdir -p /etc/containerd/certs.d/docker.io
```

进入到创建好的目录下，编辑文件`hosts.toml`

```toml
server = "https://docker.io"

[host."https://docker.m.daocloud.io"]
  capabilities = ["pull", "resolve"]

[host."https://docker.imgdb.de"]
  capabilities = ["pull", "resolve"]
```

然后重启`containerd`服务即可

```shell
systemctl restart containerd
```

## containerd管理命令介绍

使用docker作为容器运行时需要经过多层转换（kubelet <-> dockershim <-> docker <-> containerd），这会导致连接不稳定和性能下降。K8s从v1.24版本开始，不再支持docker容器运行时，而是默认使用containerd

切换到containerd之后，有以下几种替代docker的管理命令：

使用k8s自带的crictl命令。crictl是一个符合CRI接口规范的命令行工具，可以用它来检查和管理kubelet节点上的容器运行时和镜像。
使用containerd自带的ctr命令。ctr是一个本地CLI工具，可以用它来管理镜像、容器、任务、快照等。因为containerd支持多个命名空间，所以ctr命令需要指定命名空间。要管理k8s创建的容器，需要使用k8s.io名字空间，即ctr -n k8s.io。
使用containerd额外提供的nerdctl工具。nerdctl是一个与docker兼容的containerd的命令行工具，需要额外安装。它支持一些docker没有的功能，比如延迟拉取镜像、镜像加密等。
使用其他第三方管理容器的开源工具。

## docker、crictl和ctr命令对比

| 命令                | docker            | crictl（k8s）                    | ctr（containerd）            | nerdctl（containerd） |
| ------------------- | ----------------- | -------------------------------- | ---------------------------- | --------------------- |
| 查看运行的容器      | docker ps         | crictl ps                        | ctr task ls/ctr container ls | nerdctl ps            |
| 查看镜像            | docker images     | crictl images                    | ctr image ls                 | nerdctl images        |
| 查看容器日志        | docker logs       | crictl logs                      | 无                           | nerdctl logs          |
| 查看容器信息        | docker inspect    | crictl inspect                   | ctr container info           | nerdctl inspect       |
| 查看容器资源使用    | docker stats      | crictl stats                     | 无                           | nerdctl stats         |
| 启动/关闭已有的容器 | docker start/stop | crictl start/stop                | ctr task start/kill          | nerdctl start/stop    |
| 运行一个新的容器    | docker run        | 比较麻烦，因为它的最小单元为 Pod | ctr run                      | nerdctl run           |
| 创建一个新的容器    | docker create     | 比较麻烦，因为它的最小单元为 Pod | ctr container create         | nerdctl create        |
| 在容器内部执行命令  | docker exec       | crictl exec                      | 无                           | nerdctl exec          |
| 删除容器            | docker rm         | crictl rm                        | ctr container rm             | nerdctl rm            |
| 删除镜像            | docker rmi        | crictl rmi                       | ctr image rm                 | nerdctl rmi           |
| 导入镜像            | docker load       | 无                               | ctr image import             | nerdctl load          |
| 导出镜像            | docker save       | 无                               | ctr image export             | nerdctl save          |
| 拉取镜像            | docker pull       | crictl pull                      | ctr image pull               | nerdctl pull          |
| 给镜像打标签        | docker tag        | 无                               | ctr image tag                | nerdctl tag           |
| 推送镜像            | docker push       | 无                               | ctr image push               | nerdctl push          |
| 构建镜像            | docker build      | 无                               | 无                           | nerdctl build         |

（需要额外安装buildkit服务）
注意：ctr和nerdctl命令需要指定名字空间，管理k8s创建的容器，需要使用k8s.io名字空间，即ctr/nerdctl -n k8s.io。
