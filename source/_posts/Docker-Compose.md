---
title: Docker-Compose
date: 2024-04-01 11:02:56
tags:
---

# 安装

## Linux

### 在线安装

首先从github 上下载 https://github.com/docker/compose/releases

下载 docker-compose-linux-x86_64

上传到linux中

```shell
mv docker-compose-linux-x86_64 /usr/local/bin/
cd /usr/local/bin/
mv docker-compose-linux-x86_64 docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

检查是否安装成功

```shell
docker-compose version
```

### 离线安装 - 可能会出现下载问题

运行以下命令以下载 Docker Compose 的当前稳定版本：

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/v2.2.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose


```

将可执行权限应用于二进制文件：

```shell
sudo chmod +x /usr/local/bin/docker-compose
```

创建软链：

```shell
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

测试是否安装成功：

```shell
docker-compose version
```

# 命令

### 运行

```shell
# 默认以所在目录名，为Name -d 为后台运行
docker compose up -d
# 指定Name运行
docker compose --project-name dify-docker up -d
```

## 停止并清理容器

默认情况下不会清理挂载卷，除非额外指定 -v

```shell
# 进入到之前启动容器的所在目录
docker compose down
# 指定Name
docker compose --project-name dify-docker down
```

## 修改Dockerfile后，通过Docker Compose重新构建镜像

1. **修改 `Dockerfile`**。

2. 进入到 `Dockerfile` 和 `docker-compose.yml` 所在的目录。

3. **构建新镜像：**

   Bash

   ```
   docker-compose build jenkins
   ```

   （如果遇到问题或想完全重来，可以加 `--no-cache`：`docker-compose build --no-cache jenkins`）

4. **使用新镜像启动容器：**

   Bash

   ```
   docker-compose up -d --force-recreate jenkins
   ```

执行这些步骤后，你的 Jenkins 容器就会运行在新修改并构建的 Docker 镜像上，其中包含了你所有新增的工具和配置。



# 集群搭建

## Flink 集群

1. 首先启动flink 容器 JobManager、TaskManager 两个容器将配置文件复制出来方便挂载
   ```shell
   docker network create flink-network
   
   docker run \
     -itd \
     --name=jobmanager \
     --publish 8081:8081 \
     --network flink-network \
     --env FLINK_PROPERTIES="jobmanager.rpc.address: jobmanager" \
     flink:1.16.0-scala_2.12-java8 jobmanager 
   
   docker run \
     -itd \
     --name=taskmanager \
     --network flink-network \
     --env FLINK_PROPERTIES="jobmanager.rpc.address: jobmanager" \
     flink:1.16.0-scala_2.12-java8 taskmanager 
     
   
   ```

   

2. 创建本地卷挂载目录，拷贝文件
   ```shell
    mkdir -p /usr/local/flink-docker/jobmanager
    mkdir -p /usr/local/flink-docker/taskmanager
   docker cp jobmanager:/opt/flink/lib /usr/local/flink-docker/jobmanager
   docker cp jobmanager:/opt/flink/log /usr/local/flink-docker/jobmanager
   docker cp jobmanager:/opt/flink/conf /usr/local/flink-docker/jobmanager
   
   docker cp taskmanager:/opt/flink/lib /usr/local/flink-docker/taskmanager
   docker cp taskmanager:/opt/flink/log /usr/local/flink-docker/taskmanager
   docker cp taskmanager:/opt/flink/conf /usr/local/flink-docker/taskmanager
   ```

3. 搭建集群
   docker-compose.yaml 文件

   ```yaml
   version: "2.2"
   services:
     jobmanager:
       image: flink:1.16.0-scala_2.12-java8
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
             #web.upload.dir: /opt/flink/target
       networks:
         - flink-network
     taskmanager:
       image: flink:1.16.0-scala_2.12-java8
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
           taskmanager.numberOfTaskSlots: 8
           parallelism.default: 2
       networks:
         - flink-network
   networks:
     flink-network:
       external: true
   ```

4. 启动集群
   ```shell
   docker-compose up -d
   ```

   

## Kafka 集群

```shell
docker network create kfk-network
```



docker -compose.yaml

```yaml
services:
  kafka1:
    image: 'bitnami/kafka:3.6.1'
    ports:
      - '19092:19092'
    environment:
      - KAFKA_KRAFT_CLUSTER_ID=EX5bq5NfRe2IX1nhxrSO6g
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_LISTENERS=INTERNAL://:9092, EXTERNAL://:19092, CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka1:9092, EXTERNAL://<宿主机IP>:19092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT, EXTERNAL:PLAINTEXT, CONTROLLER:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka1:9093, 2@kafka2:9093, 3@kafka3:9093
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    networks:
      - kfk-network
  kafka2:
    image: 'bitnami/kafka:3.6.1'
    ports:
      - '29092:19092'
    environment:
      - KAFKA_KRAFT_CLUSTER_ID=EX5bq5NfRe2IX1nhxrSO6g
      - KAFKA_CFG_NODE_ID=2
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_LISTENERS=INTERNAL://:9092, EXTERNAL://:19092, CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka2:9092, EXTERNAL://<宿主机IP>:29092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT, EXTERNAL:PLAINTEXT, CONTROLLER:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka1:9093, 2@kafka2:9093, 3@kafka3:9093
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    networks:
      - kfk-network
  kafka3:
    image: 'bitnami/kafka:3.6.1'
    ports:
      - '39092:19092'
    environment:
      - KAFKA_KRAFT_CLUSTER_ID=EX5bq5NfRe2IX1nhxrSO6g
      - KAFKA_CFG_NODE_ID=3
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_LISTENERS=INTERNAL://:9092, EXTERNAL://:19092, CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka3:9092, EXTERNAL://<宿主机IP>:39092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT, EXTERNAL:PLAINTEXT, CONTROLLER:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka1:9093, 2@kafka2:9093, 3@kafka3:9093
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    networks:
      - kfk-network
  kafka-ui:
    image: provectuslabs/kafka-ui:master
    container_name: kafka-ui
    ports:
      - "38080:8080"
    restart: always
    environment:
      - KAFKA_CLUSTERS_0_NAME=local
      - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka1:9092,kafka2:9092,kafka3:9092
      - KAFKA_CLUSTERS_0_READONLY=true
    depends_on:
      - kafka1
      - kafka2
      - kafka3
    networks:
      - kfk-network
networks:
  kfk-network:
    external: true
```

# 容器搭建

## Gitea

docker-compose.yaml

```yaml
networks:
  gitea:
    external: false

services:
  server:
    image: gitea/gitea:1.23
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - DB_TYPE=mysql
      - DB_HOST=<ip>:33061
      - DB_NAME=gitea
      - DB_USER=gitea
      - DB_PASSWD=Wyd210213
    restart: always
    networks:
      - gitea
    volumes:
      - /usr/local/docker/gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
       - "3000:3000"
       - "222:22"

```

## Oracle-12C

docker-compose.yaml

```yaml
services:
  server:
    image: truevoly/oracle-12c
    container_name: oracle-12c
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /etc/timezone:/etc/timezone:ro
      - /var/oracle:/u01/app/oracle
    ports:
      - "2122:22"
      - "1521:1521"
      - "9090:8080"
```

首先创建挂载目录，并赋予权限

```bash
mkdir -p /var/oracle && chmod 777 /var/oracle
```

启动

```bash
docker compose up -d
```

连接Oracle数据库

```yml
hostname: localhost #主机名
port: 1521 #端口号
sid: xe 
service name: xe #服务名
username: system #用户名
password: oracle #密码
```

```bash
sqlplus system/oracle@localhost:1521/xe

sqlplus /nolog
conn sys/oracle@localhost:1521/xe as sysdba
```

使用 `sqlplus / as sysdba`登录

```bash
su - oracle
export ORACLE_HOME=/u01/app/oracle/product/12.1.0/xe
export ORACLE_SID=xe
export PATH=$ORACLE_HOME/bin:$PATH
sqlplus / as sysdba
```

环境变量永久生效

```bash
echo 'export ORACLE_HOME=/u01/app/oracle/product/12.1.0/xe' >> ~/.bashrc
echo 'export ORACLE_SID=xe' >> ~/.bashrc
echo 'export PATH=$ORACLE_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```



