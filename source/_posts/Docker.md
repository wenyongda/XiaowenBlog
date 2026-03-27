---
title: Docker
date: 2021-03-23 10:30:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/67239FBB-E15D-4F4F-8EE8-0F1C9F3C4E7C.jpeg
---
# Docker 简介

---

Docker：海豚，身上背着一堆集装箱

场景：

传统的服务器                Docker
1G左右		    几十兆几百兆
CentOS占CPU               Docker CPU引擎占用低
1-2分钟                         几秒
安装软件		    安装方便
部署应用                        部署应用，挂载，数据卷
多个应用放到一起          每个应用服务都是一个容器，相互隔离
一个独立的操作系统       必须依赖于操作系统，推荐使用Linux

# Docker 安装

## CentOS 7

```shell
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
# 另一种方式
curl -sSL https://get.daocloud.io/docker | sh
# 如上述两种方式都不行
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 查看所有可安装版本
yum list docker-ce --showduplicates | sort -r
# 安装
yum install docker-ce-18.03.1.ce
```

## AlmaLinux CentOS 8

```shell
dnf clean all
dnf update
# 添加必要的Docker存储库
dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
# 找到Docker CE的可安装版本
dnf list docker-ce --showduplicates | sort -r
# 安装Docker CE
dnf install docker-ce-3:24.0.7-1.el9 -y
# 镜像源配置
vim /etc/docker/daemon.json
```

## Ubuntu

```shell
# 安装前先卸载操作系统默认安装的docker，
sudo apt-get remove docker docker-engine docker.io containerd runc

# 安装必要支持
sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

# 阿里源（推荐使用阿里的gpg KEY）
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加 apt 源:
# 阿里apt源
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 更新源
sudo apt update
sudo apt-get update

# 安装最新版本的Docker
sudo apt install docker-ce docker-ce-cli containerd.io

# 等待安装完成

# 查看Docker版本
sudo docker version

# 查看Docker运行状态
sudo systemctl status docker

# 可选安装Docker 命令补全工具(bash shell)
sudo apt-get install bash-completion

sudo curl -L https://raw.githubusercontent.com/docker/docker-ce/master/components/cli/contrib/completion/bash/docker -o /etc/bash_completion.d/docker.sh

source /etc/bash_completion.d/docker.sh

```

安装docker后,执行docker ps命令时提示
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json": dial unix /var/run/docker.sock: connect: permission denied

首先查看当前存在的用户组中是否存在 `docker`用户组

```bash
 cat /etc/group | grep docker

docker:x:988:
```

若不存在，则需要使用以下命令添加`docker`用户组

```shell
sudo groupadd docker
```

然后执行以下命令将当前用户加入到`docker`用户组中

```shell
sudo gpasswd -a $USER docker
```

更新用户组

```shell
newgrp docker
```

也可以直接编辑当前Shell环境变量

```shell
vim ~/.zshrc

# 末尾添加 groupadd -f docker
groupadd -f docker
```



1、镜像：image。一个镜像代表一个软件。如：redis镜像，mysql镜像，tomcat镜像。。
	特点：只读
2、容器：container。一个镜像只要一启动，称之为启动了一个容器。
3、仓库：repository。存储docker中的镜像具体位置
	远程仓库：在全球范围内有一个远程仓库
	本地仓库：当前自己机器中下载的镜像存储位置

Docker配置阿里云镜像加速
https://www.cnblogs.com/LUA123/p/11401962.html

# Docker 使用

## 查看 Docker 信息

```shell
docker info
```

## 查看 Docker 镜像 image

```shell
docker images
```

## 查找镜像和下载

### 远程查找镜像

```shell
docker search ubuntu
```

### 查找容器的版本信息

在找到所需要的容器镜像的名称之后，通常需要进一步在docker的镜像源中查找该镜像的版本列表。由于docker本身没有直接提供查看版本的功能，因此在这里我们为大家提供了一个可以查看镜像版本的简单脚本docker-tags。我们生成docker-tags脚本并加入以下内容 ，

```shell
vim docker-tags
# 添加以下内容
curl -s -S "https://registry.hub.docker.com/v2/repositories/library/$1/tags/?page=$2" |
sed -e 's/,/\n/g' -e 's/\[/\\\[\n/g' |
grep -E '"name":|"count":' |
sed -e 's/"//g' -e "s/name:/$1:/g" -e "s/{count:/$1总版本数-/"
```

docker-tags脚本编辑好之后，需要通过chmod修改文件权限才可以执行。在权限修改完成之后，就可以使用docker-tags脚本来查询相关镜像的最近版本信息了。

```shell
chmod 777 docker-tags
./docker-tags ubuntu
```

## Docker 修改镜像源

```shell
# 第一步：新建或编辑daemon.json
vim /etc/docker/daemon.json

# 第二步：daemon.json中编辑如下
{
    "registry-mirrors": [
    			"https://docker.m.daocloud.io",
                "https://docker.imgdb.de",
                "https://docker-0.unsee.tech",
                "https://docker.hlmirror.com",
                "https://docker.1ms.run",
                "https://cjie.eu.org",
                "https://func.ink",
                "https://lispy.org",
                "https://docker.xiaogenban1993.com"
	]
}

# 第三步：重启docker
systemctl restart docker.service

# 第四步：执行docker info查看是否修改成功
docker info

# Registry Mirrors:
#  https://docker.m.daocloud.io/
#  https://docker.imgdb.de/
#  https://docker-0.unsee.tech/
#  https://docker.hlmirror.com/
#  https://docker.1ms.run/
#  https://cjie.eu.org/
#  https://func.ink/
#  https://lispy.org/
#  https://docker.xiaogenban1993.com/

```



## Docker  镜像操作

### 安装镜像

MySQL 5.7

```shell
docker pull mysql:5.7
```

### 删除镜像

若已有镜像用于容器，请先将容器删除

```shell
docker rm -f <CONTAINER ID>
docker image rm <IMAGE ID>
docker rmi <IMAGE ID>
# 强制删除镜像（已经创建容器的镜像）
docker rmi --force <IAMGE ID>
```

### 查看镜像

```shell
docker inspect <IMAGE ID>
```

## Docker 容器操作

### 运行容器

```shell
#	第一个8080是外部海豚上的 第二个8080是内部集装箱上的
docker run -p 8080:8080
```

-a stdin: 指定标准输入输出内容类型，可选 STDIN/STDOUT/STDERR 三项；
-d: 后台运行容器，并返回容器 ID；
-i: 以交互模式运行容器，通常与 -t 同时使用；
-P: 随机端口映射，容器内部端口随机映射到主机的端口
-p: 指定端口映射，格式为：主机 (宿主) 端口：容器端口
-t: 为容器重新分配一个伪输入终端，通常与 -i 同时使用；
--name="nginx-lb": 为容器指定一个名称；
--dns 8.8.8.8: 指定容器使用的 DNS 服务器，默认和宿主一致；
--dns-search example.com: 指定容器 DNS 搜索域名，默认和宿主一致；
-h "mars": 指定容器的 hostname；
-e username="ritchie": 设置环境变量；
--env-file=[]: 从指定文件读入环境变量；
--cpuset="0-2" or --cpuset="0,1,2": 绑定容器到指定 CPU 运行；
-m : 设置容器使用内存最大值；
--net="bridge": 指定容器的网络连接类型，支持 bridge/host/none/container: 四种类型；
--link=[]: 添加链接到另一个容器；
--expose=[]: 开放一个端口或一组端口；
--volume , -v 绑定一个卷
--restart：重启策略：

- **`no`** – 此策略永远不会自动启动容器。这是使用 `docker run` 创建的所有容器的默认策略。
- **`always`** – Docker 将确保容器始终运行。如果容器停止，它将立即重新启动。您仍然可以使用 `docker stop` 手动停止容器，但 Docker 会在下次守护进程重新启动时将其恢复。
- **`on-failure`** – 如果容器因错误而停止，它将重新启动。守护进程重启后，Docker 不会启动容器。

  `on-failure` 重启策略允许您指定应尝试重试的次数。如果连续多次启动失败，Docker 将放弃并让容器处于停止状态。

  ```sql
  docker run httpd:latest --restart on-failure:5
  ```

  在此示例中，Docker 将在失败（非零退出代码）后尝试重新启动容器五次。如果容器在第五次尝试时启动失败，将不再尝试重试。此选项对于在没有手动干预的情况下不太可能解决持续启动错误的容器很有用。
- **`unless-stopped`** – 其功能类似于`always`。不同之处在于，如果容器已被手动停止，Docker 将永远不会重新启动容器。



### 启动容器

```shell
docker start <container id>
```

### 停止容器

```shell
docker stop <container id>
```

### 重启容器

```shell
docker restart <container id>
```

### 删除容器

```shell
docker rm <container id>
```

### 强制删除容器（正在运行的容器）

```shell
docker rm --force <container id>
# 或者
docker rm -f <container id>
```

### 查看容器

```shell
docker inspect <container id>
```



## Docker 镜像保存和加载

### 本地保存

首先可以通过`docker save`命令可以将docker内部的一个或多个镜像导出成文件。下面的命令中先下载nginx，hello-world两个镜像，然后再将镜像导出到images.tar文件中。`docker save的格式为：docker save -o [导出文件名] [需要导出的镜像列表]...`

```shell
docker pull hello-world
docker pull nginx
docker save -o images.tar nginx hello-world
ll images.tar
```

### 从本地加载镜像文件

接下来通过`docker load`命令将`images.tar`中的两个镜像导入回docker内部。即可实现在没有网络访问的情况更新镜像。docker load的格式为：`docker load -i [导入文件名]`。要注意的是：如果docker内部已经存在了相关的镜像，文件中的镜像会被忽略。

在镜像导入完毕之后，可以通过`docker images`进行验证。

```shell
docker load -i images.tar
docker images
```

## Docker 容器快照的导出和导入

### 容器快照的导出

当容器文件修改之后，可以通过`docker export`命令将容器以快照的形式导出到文件。其命令的格式为`docker export 容器名 > 快照文件名`。**导出容器会丢失历史记录和元数据，类似与快照。**

```shell
docker export python-1 > python-snapshot.tar
ll python-snapshot.tar
```

### 容器快照的导入

对于通过`docker export`导出的容器快照文件。可以通过`docker import`命令将其导入到docker中，在这里需要特别注意的是：`docker import是以镜像而不是容器的形式导入快照`。也就是说导入的快照并不能直接运行，而是需要根据此快照镜像再次创建容器才可以使用。`docker import`命令的格式为`docker import 快照文件 导入镜像名称:版本号` **启动export与import命令导出导入的镜像必须加/bin/bash或者其他/bin/sh，否则会报错。**

```shell
docker import python-snapshot.tar python-snapshot:latest
```

## Docker 容器迁移

### 导出容器镜像

A 服务器上

```shell
docker commit container_name new_image_name
docker save new_image_name > image.tar
```

### 导入容器镜像

迁移到 B 服务器上cd

```shell
docker load < image.tar
```

### **检查容器[数据卷](https://zhida.zhihu.com/search?content_id=249112174&content_type=Article&match_order=1&q=数据卷&zhida_source=entity)**

重点查看容器是否有数据卷。使用 `docker inspect` 检查 `Mounts` 部分，确认数据卷绑定信息：

```json
"Mounts": [
    {
        "Type": "bind",
        "Source": "/path/on/host",
        "Destination": "/path/in/container",
        "Mode": "rw",
        "RW": true,
        "Propagation": "rprivate"
    }
]
```

将A服务器宿主机的目录备份到B服务器上

## Docker 网络 network



## Docker 容器与宿主机时间不同步

对于已创建的容器:

```shell
docker cp /usr/share/zoneinfo/Asia/Shanghai <containername>:/etc/localtime
```

创建容器前

```shell
docker run -d -p 8080:80 -v /etc/localtime:/etc/localtime -v /etc/timezone:/etc/timezone <containername>
```

## 修改运行中的 Docker 容器的端口映射和挂载目录

方法一：删除原有容器，重建新容器

参考以上移除容器，启动容器

方法二：修改配置文件，重启docker服务

容器配置文件路径：

/var/lib/docker/containers/[[hash_of_the_container]/hostconfig.json]

其中的hashofthecontainer是docker镜像的hash值，可以通过docker ps或者docker inspect containername查看。（CONTAINER ID就可以看出来）

可以到/var/lib/docker/containers目录下，ls -l

```json
{"Binds":["/usr/docker/redis/redis-slave2.conf:/usr/local/etc/redis/redis.conf"],"ContainerIDFile":"","LogConfig":{"Type":"json-file","Config":{}},"NetworkMode":"default","PortBindings":{"6379/tcp":[{"HostIp":"","HostPort":"6381"}]},"RestartPolicy":{"Name":"no","MaximumRetryCount":0},"AutoRemove":false,"VolumeDriver":"","VolumesFrom":null,"CapAdd":null,"CapDrop":null,"Dns":[],"DnsOptions":[],"DnsSearch":[],"ExtraHosts":null,"GroupAdd":null,"IpcMode":"shareable","Cgroup":"","Links":null,"OomScoreAdj":0,"PidMode":"","Privileged":false,"PublishAllPorts":false,"ReadonlyRootfs":false,"SecurityOpt":null,"UTSMode":"","UsernsMode":"","ShmSize":67108864,"Runtime":"runc","ConsoleSize":[0,0],"Isolation":"","CpuShares":0,"Memory":0,"NanoCpus":0,"CgroupParent":"","BlkioWeight":0,"BlkioWeightDevice":[],"BlkioDeviceReadBps":null,"BlkioDeviceWriteBps":null,"BlkioDeviceReadIOps":null,"BlkioDeviceWriteIOps":null,"CpuPeriod":0,"CpuQuota":0,"CpuRealtimePeriod":0,"CpuRealtimeRuntime":0,"CpusetCpus":"","CpusetMems":"","Devices":[],"DeviceCgroupRules":null,"DiskQuota":0,"KernelMemory":0,"MemoryReservation":0,"MemorySwap":0,"MemorySwappiness":null,"OomKillDisable":false,"PidsLimit":0,"Ulimits":null,"CpuCount":0,"CpuPercent":0,"IOMaximumIOps":0,"IOMaximumBandwidth":0}
```

重启docker服务，再启动容器服务就可以了。

```shell
systemctl restart docker
docker ps -a
docker start <container id>
```

## Docker 动态修改 --restart 参数

--restart参数

- no 不自动重启
- on-failure:重启次数 指定自动重启的失败次数,到达失败次数后不再重启
- always 自动重启

修改线上容器--restart参数值

```shell
docker update --restart=no [容器名]
docker update --restart=always [容器名]
docker update --restart=on-failure:3 [容器名]
```



## Docker 的镜像迁移到另一台服务器

```shell
# 找到想要移动的docker容器ID
dockerCONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                    NAMES
58ac9237b040        redis:4.0.11                 "docker-entrypoint.s…"   5 hours ago         Up 2 hours          0.0.0.0:6380->6379/tcp   redis-slave1
454bb484f90a        redis:4.0.11                 "docker-entrypoint.s…"   5 hours ago         Up 2 hours          0.0.0.0:6379->6379/tcp   redis-master
ps -a

# 提交变更，并且把容器保存成镜像，命名为redis-master
docker commit 454bb484f90a redis-master
# 把redis-master镜像保存成tar文件
docker save redis-master > /root/mysoftware/docker-file/redis/redis-master.tar
# 拷贝到新的机器，执行load命令
docker load < ./redis-master.tar
```

## Docker中 `<none>`镜像的来历及快速删除操作

```shell
docker rmi -f $(docker images | grep "none" | awk '{print $3}')
```

来历：在docker反复build一个Dockerfile，并且使用相同tag（或者不用tag)会存留很多none镜像。第一次build生成一个image id, 再次build后，会重新生成一个image id, 命名和上一个一样，所以上一个镜像的tag和名字就会自动变成 `<none>`。

## 实时查看日志

```shell
docker logs -f <CONTAINER ID>
```

## 解决Linux 下普通用户执行docker命令权限问题

```shell
sudo groupadd docker #添加用户组
sudo gpasswd -a username docker #将当前用户添加至用户组
newgrp docker #更新用户组
```

## Docker Dockerfile

### 什么是 Dockerfile?

Dockerfile 是一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明。

### 使用 Dockerfile 定制镜像

1. 定制一个 nginx 镜像（构建好的镜像内会有一个 /usr/share/nginx/html/index.html 文件）
   在一个空目录下，新建一个名为 Dockerfile 文件，并在文件内添加以下内容：

   ```dockerfile
   FROM nginx
   RUN echo '这是一个本地构建的nginx镜像' > /usr/share/nginx/html/index.html
   ```

2. FROM 和 RUN 指令的作用
   **FROM**: 定制的镜像都是基于 FROM 的镜像，这里的 nginx 就是定制需要的基础镜像。后续的操作都是基于 nginx。
   **RUN**: 用于执行后面跟着的命令行命令。有以下俩种格式：
   shell 格式：

   ```dockerfile
   RUN <命令行命令>
   # <命令行命令> 等同于，在终端操作的 shell 命令。
   ```

   exec 格式：

   ```dockerfile
   RUN ["可执行文件", "参数1", "参数2"]
   # 例如：
   # RUN ["./test.php", "dev", "offline"] 等价于 RUN ./test.php dev offline
   ```

   **注意**: Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大。例如：

   ```dockerfile
   FROM centos
   RUN yum -y install wget
   RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
   RUN tar -xvf redis.tar.gz
   ```

   以上执行会创建 3 层镜像。可简化为以下格式：

   ```dockerfile
   FROM centos
   RUN yum -y install wget \
       && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
       && tar -xvf redis.tar.gz
   ```

   如上，以 **&&** 符号连接命令，这样执行后，只会创建 1 层镜像。

### 开始构建镜像

在 Dockerfile 文件的存放目录下，执行构建动作。

以下示例，通过目录下的 Dockerfile 构建一个 nginx:v3（镜像名称:镜像标签）。

**注**: 最后的`.`代表本次执行的上下文路径，下一节会介绍。

```shell
docker build -t nginx:v3 .
```

![img](Docker/dockerfile2.png)

### 上下文路径

上一节中，有提到指令最后一个 **.** 是上下文路径，那么什么是上下文路径呢？

```shell
docker build -t nginx:v3 .
```

上下文路径，是指 docker 在构建镜像，有时候想要使用到本机的文件（比如复制），docker build 命令得知这个路径后，会将路径下的所有内容打包。

**解析**：由于 docker 的运行模式是 C/S。我们本机是 C，docker 引擎是 S。实际的构建过程是在 docker 引擎下完成的，所以这个时候无法用到我们本机的文件。这就需要把我们本机的指定目录下的文件一起打包提供给 docker 引擎使用。

如果未说明最后一个参数，那么默认上下文路径就是 Dockerfile 所在的位置。

**注意**：上下文路径下不要放无用的文件，因为会一起打包发送给 docker 引擎，如果文件过多会造成过程缓慢。

### 指令详解

| Dockerfile 指令 | 说明                                                               |
| --------------- | ------------------------------------------------------------------ |
| FROM            | 指定基础镜像，用于后续的指令构建。                                 |
| MAINTAINER      | 指定Dockerfile的作者/维护者。（已启用，推荐使用LABEL指令）         |
| LABEL           | 添加镜像的元数据，使用键值对的形式。                               |
| RUN             | 在构建过程中在镜像中执行命令。                                     |
| CMD             | 指定容器创建时的默认命令。（可以被覆盖）                           |
| ENTRYPOINT      | 设置容器创建时的主要命令。（不可被覆盖）                           |
| EXPOSE          | 声明容器运行时监听的特定网络端口。                                 |
| ENV             | 在容器内部设置环境变量。                                           |
| ADD             | 将文件、目录或远程URL复制到镜像中。                                |
| COPY            | 将文件或目录复制到镜像中。                                         |
| VOLUME          | 为容器创建挂载点或声明卷。                                         |
| WORKDIR         | 设置后续指令的工作目录。                                           |
| USER            | 指定后续指令的用户上下文。                                         |
| ARG             | 定义在构建过程中传递给构建器的变量，可使用"docker build"命令设置。 |
| ONBUILD         | 当该镜像被用作另一个构建过程的基础时，添加触发器。                 |
| STOPSIGNAL      | 设置发送给容器以退出的系统调用信号。                               |
| HEALTHCHECK     | 定义周期性检查容器健康状态的命令。                                 |
| SHELL           | 覆盖Docker中默认的shell，用于RUN、CMD和ENTRYPOINT。                |

#### COPY

复制指令，从上下文目录中复制文件或者目录到容器里指定路径。

格式：

```dockerfile
COPY [--chown=<user>:<group>] <源路径1>...  <目标路径>
COPY [--chown=<user>:<group>] ["<源路径1>",...  "<目标路径>"]
```

**[--chown=<user>:<group>]**：可选参数，用户改变复制到容器内文件的拥有者和属组。

**<源路径>**：源文件或者源目录，这里可以是通配符表达式，其通配符规则要满足 Go 的 filepath.Match 规则。例如：

```dockerfile
COPY hom* /mydir/
COPY hom?.txt /mydir/
```

**<目标路径>**：容器内的指定路径，该路径不用事先建好，路径不存在的话，会自动创建。

#### ADD

ADD 指令和 COPY 的使用格类似（同样需求下，官方推荐使用 COPY）。功能也类似，不同之处如下：

- ADD 的优点





### networks

#### 使用已经存在的网络

```shell
docker network create flink-network
```

```yaml
version: "2.2"
services:
  jobmanager:
    image: flink:scala_2.12-java8
    container_name: jobmanager-1
    expose:
      - "6123"
    ports:
      - "8081:8081"
    command: jobmanager
    volumes:
      - /usr/local/flink-docker/jobmanager/conf:/opt/flink/conf
      - /usr/local/flink-docker/jobmanager/lib:/opt/flink/lib
      - /usr/local/flink-docker/jobmanager/log:/opt/flink/log
    environment:
      - |
        FLINK_PROPERTIES=
        jobmanager.rpc.address: jobmanager
        parallelism.default: 2
        web.upload.dir: /opt/flink/target
    networks:
      - flink-network
  taskmanager:
    image: flink:scala_2.12-java8
    container_name: taskmanager-1
    depends_on:
      - jobmanager
    command: taskmanager
    scale: 1
    volumes:
      - /usr/local/flink-docker/taskmanager/conf:/opt/flink/conf
      - /usr/local/flink-docker/taskmanager/lib:/opt/flink/lib
      - /usr/local/flink-docker/taskmanager/log:/opt/flink/log
    environment:
      - |
        FLINK_PROPERTIES=
        jobmanager.rpc.address: jobmanager
        taskmanager.numberOfTaskSlots: 2
        parallelism.default: 2
    networks:
      - flink-network
networks:
  flink-network:
    external: true
```

### 构建 Dockerfile 时打印RUN命令的输出

```shell
 # 在docker build命令最后加上此命令 --no-cache 不缓存
 --progress=plain --no-cache
```

# Docker 磁盘占用清理

## docker system 命令

它可以用于管理磁盘空间

**docker system df** 命令，类似于 Linux 上的 **df**命令，用于查看 Docker 的磁盘使用情况：

```shell
docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          22        5         14.54GB   10.6GB (72%)
Containers      6         3         2.14GB    696.8MB (32%)
Local Volumes   53        5         6.317GB   5.935GB (93%)
Build Cache     12        0         0B        0B

```

可知，Docker 镜像占用了 14.5GB 磁盘，Docker 容器占用了 2.14GB 磁盘，Docker 数据卷占用了 6.317GB 磁盘。

**docker system prune** 命令可以用于清理磁盘，删除关闭的容器、无用的数据卷和网络，以及 dangling 镜像（即无 tag 的镜像）。docker system prune -a 命令清理得更加彻底，可以将没有容器使用 Docker 镜像都删掉。注意，这两个命令会把你暂时关闭的容器，以及暂时没有用到的 Docker镜像都删掉了

执行 **docker system prune -a** 命令之后，Docker 占用的磁盘空间减少了很多

```shell
du -sh /var/lib/docker/containers/* | sort -rh | head -5
cd /var/lib/docker/containers/eb52fa7d62ce52ab7a6153636a0ec89c7c8dce6f1a94dc86b2fbf0702368e82

truncate -s 0 *-json.log
```



## 手动清理 Docker 镜像/容器/数据卷

对于旧版的 Docker(版本 1.13 之前)，是没有 docker system 命令的，因此需要进行手动清理。这里给出几个常用的命令

**删除所有关闭的容器**

```shell
docker ps -a | grep Exit | cut -d ' ' -f 1 | xargs docker rm
```

**删除所有 dangling 镜像(即无 tag 的镜像)**

```shell
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")
```

**删除所有 dangling 数据卷(即无用的 volume)**

```shell
docker volume rm $(docker volume ls -qf dangling=true)
```

## 限制容器的日志大小

防止它再次爆满

配置 Docker 全局日志轮转策略

**编辑/新建 Docker 配置文件**：`/etc/docker/daemon.json`

**添加 log-opts 配置**： (限制每个容器日志最大 100MB，最多保留 3 个文件)

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
```

(注意：如果文件里已有其他配置，请确保 JSON 格式正确，不要漏掉逗号)

**重启 Docker 服务**：

```shell
systemctl daemon-reload
systemctl restart docker
```

注意：此配置只对**新建**的容器生效。对于现有的 `1a28bcc...` 容器，你需要将其删除并重新运行 (`docker rm` -> `docker run`) 才能应用新策略。

## 清理容器日志

Docker 的所有相关文件，包括镜像、容器等都保存在 **/var/lib/docker** 目录中:

```shell
du -sh /var/lib/docker/
29G     /var/lib/docker/
```

使用**du**命令继续查看，可以定位到真正占用这么多磁盘的目录

使用**truncate**命令，可以将 nginx 容器的日志文件“清零”：

```shell
truncate -s 0 /var/lib/docker/containers/a376aa694b22ee497f6fc9f7d15d943de91c853284f8f105ff5ad6c7ddae7a53/*-json.log
```

也可以清空文件内容，需要root权限

```shell
# 方法 1：使用 echo 重定向（推荐）
sh -c "echo '' > /var/lib/docker/containers/1a28bcc2e01033a9d83df7ac183cb128cdd81e40852befbb218459d04a054189/1a28bcc2e01033a9d83df7ac183cb128cdd81e40852befbb218459d04a054189-json.log"

# 或者 方法 2：使用 cat /dev/null
sh -c "cat /dev/null > /var/lib/docker/containers/1a28bcc2e01033a9d83df7ac183cb128cdd81e40852befbb218459d04a054189/1a28bcc2e01033a9d83df7ac183cb128cdd81e40852befbb218459d04a054189-json.log"
```

**原理：** 这会将文件的大小截断为 0，但保持文件的 inode（文件句柄）不变。Docker 进程可以继续向这个文件写入新日志，而你立即获得释放的空间。

## 重启 Docker

当我清理了镜像、容器以及数据卷之后，发现磁盘空间并没有减少。根据[Docker disk usage](https://github.com/moby/moby/issues/12265)提到过的建议，我重启了 Docker，发现**磁盘使用率从 83%降到了 19%**。根据高手[指点](https://github.com/moby/moby/issues/12265#issuecomment-316303769)，这应该是与内核 3.13 相关的 BUG，导致 Docker 无法清理一些无用目录：

> it's quite likely that for some reason when those container shutdown, docker couldn't remove the directory because the shm device was busy. This tends to happen often on 3.13 kernel. You may want to update it to the 4.4 version supported on trusty 14.04.5 LTS.

> The reason it disappeared after a restart, is that daemon probably tried and succeeded to clean up left over data from stopped containers.

我查看了一下内核版本，发现真的是 3.13:

```bash
uname -r
3.13.0-86-generic
```

如果你的内核版本也是 3.13，而且清理磁盘没能成功，不妨重启一下 Docker。当然，这个晚上操作比较靠谱。

# Docker 迁移

## 从Docker迁移到Podman

```bash
# 迁移步骤概要
# 1. 安装Podman
sudo apt-get install podman

# 2. 迁移Docker配置
podman system migrate

# 3. 迁移镜像（如需要）
docker save myimage | podman load

# 4. 创建别名（可选）
echo "alias docker=podman" >> ~/.zshrc
source ~/.zshrc

# 5. 验证功能等效性
podman run --rm hello-world
```

## 从Docker迁移到nerdctl

```bash
# 迁移步骤概要
# 1. 安装containerd和nerdctl
sudo apt-get install containerd.io
sudo nerdctl install

# 2. 配置nerdctl
sudo cp /etc/docker/daemon.json /etc/nerdctl/nerdctl.toml

# 3. 迁移镜像（如需要）
docker save myimage | sudo nerdctl load

# 4. 更新脚本和CI/CD流程
# 将所有'docker'命令替换为'nerdctl'

# 5. 验证功能等效性
nerdctl run --rm hello-world
```



# Docker 实例

## Docker 启动 MariaDB

拉取mariadb镜像

```shell
docker pull mariadb:10.2
docker images
docker run --name mariadb10.2 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mariadb:10.2
```

## Docker Redis 主从复制集群搭建

拉取redis4.0.11镜像

```shell
docker pull redis:4.0.11
```

编辑redis.conf

redis-master.conf

```shell
vim /root/mysoftware/docker-file/redis/redis-master.conf
bind 0.0.0.0 #让redis可以被任意ip访问
daemonize yes #让redis服务后台运行
# 如需设定密码
requirepass masterpassword # 设定密码
```

redis-slave1.conf

```shell
vim /root/mysoftware/docker-file/redis/redis-slave1
bind 0.0.0.0 #让redis可以被任意ip访问
daemonize yes #让redis服务后台运行
# 如需设定密码
requirepass masterpassword # 设定密码
# 设置主机地址端口 redis5.0以上为 replicaof <master-IP> <master-port>
slaveof <master-IP> <master-port>
# 查看master ip
docker inspect <container id>
# 主库有密码必需要配置，<master-password>代表主库的访问密码
masterauth <master-password>
```

运行redis容器

redis-master

```shell
# 运行服务
docker run -it --name redis-master -v /usr/docker/redis/redis-master.conf:/usr/etc/redis/redis.conf -v /usr/docker/redis/data/:/data -d -p 35379:6379 redis:4.0.11 /bin/bash
# 进入容器
docker exec -it redis-master bash
# 加载配置
redis-server /usr/local/etc/redis/redis.conf
# 如报错
mkdir -p /usr/redis/bin
# 测试连接
redis-cli -a <master-password>
```

redis-slave1

```shell
# 运行服务
docker run -it --name redis-slave1 -v /usr/docker/redis/redis-slave1.conf:/usr/etc/redis/redis.conf -v /usr/docker/redis/data/:/data -d -p 35380:6379 redis:4.0.11 /bin/bash
# 进入容器
docker exec -it redis-slave1 bash
# 加载配置
redis-server /usr/local/etc/redis/redis.conf
# 如报错  Can't chdir to '/usr/redis/bin': No such file or directory
mkdir -p /usr/redis/bin
# 测试连接
redis-cli
# 查看主从信息
info Replication
# 密码认证
auth <slave-password>
```

## Docker Redis 哨兵高可用集群搭建

## Docker 安装 code-server

```shell
# 拉取镜像
docker pull codercom/code-server
# 创建宿主机目录
mkdir /usr/docker/codeserver
# 创建配置文件
vim /usr/docker/codeserver/config.yaml

bind-addr: 127.0.0.1:8080
auth: password
password: 123456
cert: false

# 创建并启动容器 # -u 表示以 root用户运行
docker run -d -u root -p 8088:8080 --name code-server -v /usr/docker/codeserver/config.yaml:/root/.config/code-server/config.yaml -v /usr/docker/codeserver:/home/code codercom/code-server
```

## Docker 安装 Jenkins

搜索Jenkins镜像

```shell
docker search jenkins
```

![image-20221121125608385](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221121125608385.png)

拉取镜像

```shell
docker pull jenkins/jenkins
```

查看镜像

```shell
docker images
```

![image-20221121131216876](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221121131216876.png)

启动镜像

```shell
cd /usr/local
mkdir jenkins_home
docker run -d -uroot -p 8889:8080 -p 50000:50000 --name jenkins -v /usr/bin/docker:/usr/bin/docker -v /var/run/docker.sock:/var/run/docker.sock -v /etc/sysconfig/docker:/etc/sysconfig/docker -v /usr/local/jenkins_home:/var/jenkins_home -v /etc/localtime:/etc/localtime 
-u root jenkins/jenkins
```

启动后查看日志

```shell
docker logs jenkins
```

![image-20221121131635658](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221121131635658.png)可以找到初始密码

## Docker 安装 Nginx

```shell
docker pull nginx

docker run -d \
-p 80:80 \
-p 443:443 \
--name nginx \
--privileged=true \
--restart=always \
-v /usr/local/docker/nginx/html:/usr/share/nginx/html \
-v /usr/local/docker/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /usr/local/docker/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /usr/local/docker/nginx/logs:/var/log/nginx nginx:1.25.2


ps aux | grep "nginx: worker process" | awk '{print $1}'
```

## Docker 安装 SQL Server

```shell
mkdir /etc/sqlserver_data
chmod -R 777 /etc/sqlserver_data
docker pull mcr.microsoft.com/mssql/server
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Wyd210213" -p 1433:1433 --memory 2000M --name sqlserver2022 --restart=always -v /etc/sqlserver_data:/var/opt/mssql -d mcr.microsoft.com/mssql/server
```

### 安装破解内存限制

建立构建自定义镜像文件夹

```shell
mkdir crack-tiny-mssqlserver
cd crack-tiny-mssqlserver
```

新建python2脚本

```shell
vim crack.py
```

```python
oldfile = open("sqlservr.old", "rb").read()
newfile = oldfile.replace("\x00\x94\x35\x77", "\x00\x80\x84\x1e")
open("sqlservr", "wb").write(newfile)
exit()
```

新建Dockerfile文件

```shell
vim Dockerfile
```

```dockerfile
FROM mcr.microsoft.com/mssql/server:2022-latest
USER root
RUN cd /opt/mssql/bin/ && mv sqlservr sqlservr.old
COPY crack.py /opt/mssql/bin/
WORKDIR /opt/mssql/bin/
RUN apt-get update && apt-get install -y python2
RUN ls && python2 /opt/mssql/bin/crack.py && chmod -R 777 /opt/mssql/bin/sqlservr
```

在 **crack-tiny-mssqlserver** 目录下执行构建镜像

```shell
docker build -t linux-sqlserver:2022 .
```


```shell
mkdir /usr/local/docker/linux-sqlserver2022
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Wyd210213" -e "MSSQL_COLLATION=Chinese_PRC_CI_AS" -p 11433:1433 --name linux-sqlserver2022 --restart=always -v /usr/local/docker/linux-sqlserver2022:/var/opt/mssql -v /etc/localtime:/etc/localtime:ro -e TZ="Asia/Shanghai" -d linux-sqlserver:2022
```

## Docker 安装 PostgreSQL

```shell
docker pull postgres:latest
docker run -d --name=pgsql -p 5432:5432 -e POSTGRES_PASSWORD=Wyd210213 postgres:latest

docker run -d -p 15432:5432 --name postgres16 --restart=always -v /usr/local/docker/postgres16/pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=Wyd210213 postgres:16.8

```

## Docker 安装 Timescaledb

```shell
docker run -d -p 15433:5432 --name timescaledb-pg16 --restart=always -v /usr/local/docker/timescaledb-pg16/pgdata/data:/var/lib/postgresql/data -v /etc/localtime:/etc/localtime:ro -e POSTGRES_PASSWORD=Wyd210213 -e TZ=Asia/Shanghai timescale/timescaledb:latest-pg16
```



## Docker 安装 MySQL 8

```shell
docker run \
-p 3306:3306 \
--name mysql \
--restart=always \
-v /usr/local/docker/mysql/mysql-files:/var/lib/mysql-files \
-v /usr/local/docker/mysql/conf:/etc/mysql \
-v /usr/local/docker/mysql/logs:/var/log/mysql \
-v /usr/local/docker/mysql/data:/var/lib/mysql \
-v /etc/localtime:/etc/localtime \
-e MYSQL_ROOT_PASSWORD=Wyd210213 \
-e TZ=Asia/Shanghai \
-d mysql:8.0.21 \
--lower_case_table_names=1
```

## Docker 安装 MySQL 5.7

```shell
mkdir -p /usr/local/docker/mysql57
# 宿主机创建配置文件目录映射到容器
mkdir -p /usr/local/docker/mysql57/conf #(需要在此目录下创建"conf.d"、"mysql.conf.d"两个目录)
mkdir -p /usr/local/docker/mysql57/conf/conf.d # (建议在此目录创建my.cnf文件并进行相关MySQL配置)
mkdir -p /usr/local/docker/mysql57/conf/mysql.conf.d

docker run \
-p 3306:3306 \
--name mysql57 \
--restart=always \
-v /usr/local/docker/mysql57/mysql-files:/var/lib/mysql-files \
-v /usr/local/docker/mysql57/conf:/etc/mysql \
-v /usr/local/docker/mysql57/logs:/var/log/mysql \
-v /usr/local/docker/mysql57/data:/var/lib/mysql \
-v /etc/localtime:/etc/localtime \
-e MYSQL_ROOT_PASSWORD=Wyd210213 \
-e TZ=Asia/Shanghai \
-d mysql:5.7.43 \
--lower_case_table_names=1
```

进入容器内 登录mysql

```shell
docker exec -it mysql57 /bin/bash
mysql -uroot -p
# 若出现 mysql: [Warning] World-writable config file '/etc/mysql/my.cnf' is ignored.
# 查看 /etc/mysql/my.cnf 文件权限
ls -l /etc/mysql/my.cnf
# 如果看到以下输出
# -rwxrwxrwx 1 root root 1234 Jan 1 00:00 /etc/mysql/my.cnf
# 那么说明该配置文件确实是对所有人开放了读、写和执行权利。
# 接着我们需要修改这个文件的权限，使其只有root用户有读写权，其他用户只有读的权限：
chmod 644 /etc/mysql/my.cnf
# 再次使用 ls -l命令查看'/etc/mysql/my.cnf'的权限
ls -l /etc/mysql/my.cnf
# 看到以下输出，则修改成功
# -rw-r--r-- 1 root root 1234 Jan 1 00:00 /etc/mysql/my.cnf
```

## Docker 安装 Redis 7

```shell
# 首先得需要redis.conf，否则会映射成文件夹
docker run --restart=always \
-p 6379:6379 \
--name redis \
-v /usr/local/docker/redis/redis.conf:/etc/redis/redis.conf \
-v /usr/local/docker/redis/data:/data \
-v /etc/localtime:/etc/localtime \
-d redis:7.0.13 redis-server /etc/redis/redis.conf
```

## Docker 安装 SeaweedFS

```shell
docker run -itd  -p 9333:9333 -p 19333:19333 -v /opt/seaweed/mdir:/data --name weed_master chrislusf/seaweedfs master -defaultReplication=001

docker run -itd -p 9334:8080 -v /opt/seaweed/vdir1:/data --name weed_volume1 --link weed_master chrislusf/seaweedfs volume -max=30 -mserver="weed_master:9333" -port=8080  -dataCenter=dc1 -rack=rack1

docker run -itd -p 9335:8080 -v /opt/seaweed/vdir2:/data --name weed_volume2 --link weed_master chrislusf/seaweedfs volume -max=30 -mserver="weed_master:9333" -port=8080  -dataCenter=dc1 -rack=rack1

curl -X PUT -F file=@/home/back.png http://volume1.tonisf.com:88/4,01eea6857d

docker run -itd -p 18080:8080 -p 8333:8333 -p 18888:8888 -p 9333:9333 -p 19333:19333 -v /opt/seaweed/mdir:/data --name weed_server chrislusf/seaweedfs server filter  -defaultReplication=001 -s3


```

## Docker 安装 Subversion

拉取镜像

```shell
docker pull elleflorio/svn-server

mkdir /usr/local/docker/svn
cd /usr/local/docker/svn
```

创建脚本启动临时容器

```shell
vim start.sh

docker stop svn-test
docker rm svn-test
docker run --restart always --name svn-test -d -p 3690:3690 -p 18080:80 \
       -v /usr/local/docker/svn:/tmp/svn elleflorio/svn-server

chmod +x start.sh
./start.sh
```

创建脚本进入容器

```shell
vim enter.sh

docker exec -it svn-test /bin/sh

chmod +x enter.sh
./enter.sh
```

进入容器

```shell
# 查看仓库配置文件
cat /etc/apache2/conf.d/dav_svn.conf
#LoadModule dav_svn_module /usr/lib/apache2/mod_dav_svn.so
#LoadModule authz_svn_module /usr/lib/apache2/mod_authz_svn.so
#<Location /svn>
#     DAV svn
#     SVNParentPath /home/svn
#     SVNListParentPath On
#     AuthType Basic
#     AuthName "Subversion Repository"
#     AuthUserFile /etc/subversion/passwd
#     AuthzSVNAccessFile /etc/subversion/subversion-access-control
#     Require valid-user
# 拷贝相关文件到tmp，同步到挂载点
mkdir /tmp/svn/config /tmp/svn/svnadmin_data
cp /etc/subversion/*  /tmp/svn/config
cp /opt/svnadmin/data/* /tmp/svn/svnadmin_data
exit
```

退出容器，再次编辑启动容器脚本

```shell
vim start.sh

# 3690是svn server的默认端口，80是apache的默认端口
docker stop svn-test
docker rm svn-test
docker run --restart always --name svn-test -d -p 3690:3690 -p 18080:80 \
       -v /usr/local/docker/svn/repo:/home/svn \
       -v /usr/local/docker/svn/config:/etc/subversion \
       -v /usr/local/docker/svn/svnadmin_data:/opt/svnadmin/data elleflorio/svn-server
# 更改挂载点后，重启容器
./start.sh
./enter.sh
# 创建一个示例项目
mkdir -p /home/svn/myrep
ls /home/svn/
# myrepo
# 添加用户访问权限
vi /etc/subversion/subversion-access-control

[groups]
[/]
* = r
# 添加admin的读写权限
admin = rw

# 添加用户账号
htpasswd -b /etc/subversion/passwd admin admin123
# Adding password for user admin
exit
# 授予权限
sudo chmod -R a+w /usr/local/docker/svn/config/*
sudo chmod -R a+w /usr/local/docker/svn/repo/*
sudo chmod -R a+w /usr/local/docker/svn/svnadmin_data/*

# 访问Apache HTTP Server
http://ip:18080/
# 服务器开放18080端口
# 在浏览器地址后面加上svn, 即http://ip:18080/svn，会弹出提示框输入用户名和密码，登录成功后可查看项目目录

```

配置svnadmin(一个php写的svn管理工具)

访问 http://ip:18080/svnadmin/

```
Error: Could not copy configuration file template. Require write permission (777) to "data" folder and all containing files.

#0 /opt/svnadmin/index.php(20): include_once()
#1 {main}
```

配置文件权限

```shell
chmod 777 /usr/local/docker/svn/svnadmin_data/
```

刷新以下

按照 上面步骤里提到的`/etc/apache2/conf.d/dav_svn.conf的内容去填写，并点击test按钮验证，如下图，然后点击Save Configuration`

```shell
LoadModule dav_svn_module /usr/lib/apache2/mod_dav_svn.so
LoadModule authz_svn_module /usr/lib/apache2/mod_authz_svn.so

<Location /svn>
     DAV svn
     SVNParentPath /home/svn
     SVNListParentPath On
     AuthType Basic
     AuthName "Subversion Repository"
     AuthUserFile /etc/subversion/passwd
     AuthzSVNAccessFile /etc/subversion/subversion-access-control
     Require valid-user
```

![image-20231121123737636](Docker/image-20231121123737636.png)

- Subversion 授权文件: /etc/subversion/subversion-access-control

- 用户身份验证文件 (SVNUserFile): /etc/subversion/passwd

- 代码仓库的父目录 (SVNParentPath): /home/svn

  > 需要授予权限
  >
  > 进入容器内
  >
  > 执行
  >
  > ```chmodshell
  > chmod -R a+w /home/svn/
  > ```

- 'svn.exe' 或 'svn'可执行文件：/usr/bin/svn

- 'svnadmin.exe' 或 'svnadmin' 可执行文件：/usr/bin/svnadmin

保存设置就可以登录了

### 可修改日志信息及作者

```shell
./enter.sh

cd /home/svn/myrepo
cd hooks
mv pre-revprop-change.tmpl pre-revprop-change
vi pre-revprop-change

REPOS="$1"
REV="$2"
USER="$3"
PROPNAME="$4"
ACTION="$5"

# 日志信息
if [ "$ACTION" = "M" -a "$PROPNAME" = "svn:log" ]; then exit 0; fi
# 作者
if [ "$ACTION" = "M" -a "$PROPNAME" = "svn:author" ]; then exit 0; fi
echo "Changing revision properties %PROPNAME% is prohibited" >&2
exit 1

```

## Docker 安装 Lucky

首先创建挂载目录

```shell
mkdir /usr/local/docker/lucky
```

创建目录 lucky

```shell
mkdir lucky
cd lucky
```

创建 docker-compose.yml 文件

```shell
touch docker-compose.yml
vim docker-compose.yml
```

编辑内容

```yaml
version: '3'
services:
  lucky:
    image: gdy666/lucky:latest
    container_name: lucky
    ports:
      - "16601:16601"
    volumes:
      - /usr/local/docker/lucky:/goodluck
    restart: always
    network_mode: host

```

保存并在当前目录下 运行

```shell
docker compose up -d
```

## Docker 安装 VaultWarden

首先创建挂载目录

```shell
mkdir -p /usr/local/docker/vaultwarden/data
```

创建目录 bitwarden-docker

```shell
mkdir bitwarden-docker
cd bitwarden-docker
```

创建 docker-compose.yml 文件

```shell
touch docker-compose.yml
vim docker-compose.yml
```

编辑内容

```yaml
version: '3'

services:
  # 服务名称
  bitwarden:
    # 镜像名称
    image: bitwardenrs/server:latest
    # 容器名称
    container_name: vaultwarden
    # 开机自动启动
    restart: always
    # 指定容器内的 /data 目录挂载到宿主机的当前目录下的 /usr/local/docker/bitwarden/data 目录，这样你可以在宿主机上执行数据库的备份操作
    volumes:
      - /usr/local/docker/vaultwarden/data:/data
    # bitwarden 配置
    environment:
      # 开启网页访问
      WEB_VAULT_ENABLED: 'true'
      # 开启新用户注册，我们注册后关闭即可
      SIGNUPS_ALLOWED: 'true'
      # 开启/关闭长连接
      WEBSOCKET_ENABLED: 'true'
      # 日志文件
      LOG_FILE: /data/vaultwarden.log
      # 数据库 mysql://bitwarden:password@172.17.0.1:3306/bitwarden
      # mysql://<数据库用户名>:<数据库用户密码>@<数据库公网地址>:<数据库端口>/<数据库名称>
      DATABASE_URL: mysql://bitwarden:password@172.17.0.1:3306/bitwarden
      #自行决定是否配置smtp邮件服务
      # SMTP_HOST: 'smtp.163.com'
      # SMTP_FROM: 'test@163.com'
      # SMTP_PORT: '465'
      # SMTP_SSL: 'true'
      # SMTP_USERNAME: 'test@163.com'
      # SMTP_PASSWORD: 'password'
      # SMTP_EXPLICIT_TLS: 'true'
    ports:
      - 7006:80
      - 7007:3012
    network_mode: "bridge"
# networks:
#   bridge:
#     external: true
#     name: bridge

```

保存并在当前目录下 运行

```shell
docker compose up -d
```

## Docker 安装 Minio

```shell
docker run -p 9000:9000 -p 9001:9001 \
-d --restart=always \
--name minio \
-e "MINIO_ACCESS_KEY=admin" \
-e "MINIO_SECRET_KEY=Wyd210213" \
-v /usr/local/docker/minio/data:/data \
-v /usr/local/docker/minio/config:/root/.minio \
minio/minio server \
/data \
--console-address ":9001"

```

## Docker 安装 Tomcat 9

```shell
docker run -d -p 8080:8080 --name tomcat9 \
-v /usr/local/docker/tomcat9/webapps:/usr/local/tomcat/webapps \
-v /usr/local/docker/tomcat9/logs:/usr/local/tomcat/logs \
tomcat:9.0.41-jdk8-corretto
```

### Tomcat默认文档查看

进入容器

```shell
docker exec -it tomcat9 /bin/bash

cd /usr/local/tomcat/
ls
cp -r ./webapps.dist/* ./webapps
exit
```

