---
title: Podman
date: 2025-11-26 13:38:42
tags:

---

# Podman命令

Podman 是一个无守护进程（Daemonless）的容器引擎，它在大致功能上与 Docker 兼容。这意味着**大多数 Docker 命令你可以直接把 `docker` 换成 `podman` 来使用**。

---

## 基础与别名 (Tips)

如果你习惯了 Docker，可以直接在 Shell 中设置别名，这样你就不用改变肌肉记忆了：

```bash
alias docker=podman
```

## 容器生命周期管理 (Container Lifecycle)

这些命令用于创建、启动、停止和删除容器。

- 运行容器 (最常用)
  ```bash
  # -d: 后台运行, -p: 端口映射, --name: 指定名称
  podman run -d --name my-nginx -p 8080:80 nginx:latest
  ```

- 查看容器列表
  ```bash
  podman ps       # 仅查看正在运行的容器
  podman ps -a    # 查看所有容器（包括已停止的）
  ```

- 启动/停止/重启
  ```bash
  podman start <容器ID或名称>
  podman stop <容器ID或名称>
  podman restart <容器ID或名称>
  ```

- 进入容器内部
  ```bash
  #以交互模式进入容器的 bash/sh
  podman exec -it <容器ID或名称> /bin/bash
  ```

- 删除容器
  ```bash
  podman rm <容器ID或名称>
  podman rm -f <容器ID或名称>  # 强制删除正在运行的容器
  ```

- 查看日志
  ```bash
  podman logs -f <容器ID或名称>  # -f 实时跟踪日志输出
  ```

## 镜像管理 (Image Management)

- 拉取镜像
  ```bash
  podman pull <镜像名>
  # 例如: podman pull docker.io/library/alpine:latest
  ```

- 查看本地镜像
  ```bash
  podman images
  ```

- 删除镜像
  ```bash
  podman rmi <镜像ID或名称>
  ```

- 构建镜像
  ```bash
  # 在当前目录根据 Dockerfile 构建
  podman build -t my-app:v1 .
  ```

- 给镜像打标签 (Tag)
  ```bash
  podman tag <源镜像ID> <新名称>:<标签>
  ```

##  Pod 管理 (Podman 特色)

Podman 的一大特色是支持 **Pod**（类似于 Kubernetes 的 Pod 概念），即一个 Pod 里可以包含多个共享网络和存储的容器。

- 创建一个空 Pod
  ```bash
  # 创建一个带有端口映射的 Pod
  podman pod create --name my-pod -p 8080:80
  ```

- 在 Pod 中运行容器
  ```bash
  # 将容器加入到上面创建的 pod 中
  podman run -d --pod my-pod --name container-in-pod nginx
  ```

- 查看 Pod 列表
  ```bash
  podman pod ps
  ```

- 停止/删除 Pod
  ```bash
  podman pod stop <Pod名称>
  podman pod rm <Pod名称>
  ```

## 高级功能与系统集成 (Advanced)

这是 Podman 最强大的地方，特别适合运维管理。

- **生成 Systemd 配置文件** (非常实用) Podman 可以直接生成 systemd unit 文件，让普通用户也能通过 `systemctl` 管理容器自启。

  ```bash
  # 为正在运行的容器生成 service 文件
  podman generate systemd --name <容器名称> --files --new
  ```

- **Kubernetes 互操作性**

  - **导出 YAML:** 将现有容器导出为 K8s 的 YAML 定义。

    ```bash
    podman generate kube <容器或Pod名称> > my-pod.yaml
    ```

  - **运行 YAML:** 直接在 Podman 中运行 K8s 的 YAML 文件。

    ```bash
    podman play kube my-pod.yaml
    ```

- 清理系统
  ```bash
  # 删除所有停止的容器、未使用的网络和悬空的镜像
  podman system prune
  ```

- 查看系统信息
  ```bash
  podman info    # 查看详细的存储、运行环境信息
  podman version # 查看版本
  ```


# Podman换源

> Podman 是一个无守护进程的容器引擎，用于在 Linux 系统上开发、管理和运行 OCI 容器。与 Docker 类似，Podman 也支持配置镜像源来加速容器镜像的拉取。

##  Linux 系统配置

### 方法一：全局配置（推荐）

创建或编辑 Podman 的全局配置文件：

```shell
sudo mkdir -p /etc/containers
sudo tee /etc/containers/registries.conf <<-'EOF'
unqualified-search-registries = ["docker.io"]
[[registry]]
prefix = "docker.io"
location = "docker.io"
[[registry.mirror]]
location = "docker.1ms.run"
[[registry.mirror]]
location = "docker.1panel.live"
[[registry.mirror]]
location = "docker.m.ixdev.cn"
[[registry.mirror]]
location = "hub.rat.dev"
[[registry.mirror]]
location = "docker.xuanyuan.me"
[[registry.mirror]]
location = "dockerproxy.net"
[[registry.mirror]]
location = "docker-registry.nmqu.com"
[[registry.mirror]]
location = "hub.amingg.com"
[[registry.mirror]]
location = "docker.amingg.com"
[[registry.mirror]]
location = "docker.hlmirror.com"
[[registry.mirror]]
location = "hub1.nat.tf"
[[registry.mirror]]
location = "hub2.nat.tf"
[[registry.mirror]]
location = "hub3.nat.tf"
[[registry.mirror]]
location = "hub4.nat.tf"
[[registry.mirror]]
location = "docker.m.daocloud.io"
[[registry.mirror]]
location = "docker.kejilion.pro"
[[registry.mirror]]
location = "hub.1panel.dev"
[[registry.mirror]]
location = "docker.apiba.cn"
[[registry.mirror]]
location = "proxy.vvvv.ee"
EOF
```

### 方法二：用户级配置

为当前用户创建配置文件：

```shell
mkdir -p ~/.config/containers
tee ~/.config/containers/registries.conf <<-'EOF'
unqualified-search-registries = ["docker.io"]
[[registry]]
prefix = "docker.io"
location = "docker.io"
[[registry.mirror]]
location = "docker.1ms.run"
[[registry.mirror]]
location = "docker.1panel.live"
[[registry.mirror]]
location = "docker.m.ixdev.cn"
[[registry.mirror]]
location = "hub.rat.dev"
[[registry.mirror]]
location = "docker.xuanyuan.me"
[[registry.mirror]]
location = "dockerproxy.net"
[[registry.mirror]]
location = "docker-registry.nmqu.com"
[[registry.mirror]]
location = "hub.amingg.com"
[[registry.mirror]]
location = "docker.amingg.com"
[[registry.mirror]]
location = "docker.hlmirror.com"
[[registry.mirror]]
location = "hub1.nat.tf"
[[registry.mirror]]
location = "hub2.nat.tf"
[[registry.mirror]]
location = "hub3.nat.tf"
[[registry.mirror]]
location = "hub4.nat.tf"
[[registry.mirror]]
location = "docker.m.daocloud.io"
[[registry.mirror]]
location = "docker.kejilion.pro"
[[registry.mirror]]
location = "hub.1panel.dev"
[[registry.mirror]]
location = "docker.apiba.cn"
[[registry.mirror]]
location = "proxy.vvvv.ee"
EOF
```

# Docker 迁移

## Docker Desktop

