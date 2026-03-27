---
title: Jenkins
date: 2022-11-09 10:30:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/B18FCBB3-67FD-48CC-B4F3-457BA145F17A.jpeg
---
# Jenkins

```powershell
# 删除文件夹
rmdir /q /s C:\Program" "Files\nginx-1.23.2\html\dist
# 复制文件夹到指定目录
xcopy /y /e /i C:\Users\Administrator\Documents\source\XiaoDaERP-Vben\dist C:\Program" "Files\nginx-1.23.2\html\dist
# 发送文件（文件夹）到Linux远程服务器上
pscp -r -l root -pw Wyd210213 C:\Users\Administrator\Documents\source\XiaoDaERP-Vben\dist 8.140.174.251:/usr/local/nginx/html
```

```shell
docker run -d -p 80:80 -p 443:443 --name nginxweb --privileged=true
-v /usr/local/nginx/html/:/usr/share/nginx/html 
-v /usr/local/nginx/conf/nginx.conf:/etc/nginx/nginx.conf 
-v /usr/local/nginx/conf/conf.d:/etc/nginx/conf.d 
-v /usr/local/nginx/logs:/var/log/nginx nginx


ps aux | grep "nginx: worker process" | awk '{print $1}'
```

## 部署.Net Core 至 IIS

新建Item

![image-20221108224600422](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221108224600422.png)

配置Git

![image-20221108224810869](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221108224810869.png)

添加Git账户

![image-20221108224709242](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221108224709242.png)

指定Jenkins从Git拉取代码目录

![image-20221108224910785](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221108224910785.png)

![image-20221108224935821](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221108224935821.png)

指定Jenkins定时获取Git

时间设置成：H/2 * * * *

意思是每2分钟检查Git是否有变化，如果有变化就会重新构建和部署

![image-20221108225020629](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221108225020629.png)

构建步骤

因为Jenkins在Windows环境下所以使用 Execute Windows batch command

![image-20221108225404450](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221108225404450.png)

命令:

```powershell
c:
// 切换到Git拉取代码目录
cd C:\Users\Administrator\Documents\source\XiaodaERP
// 构建.Net Core应用
dotnet build
 // 停止应用程序池 saas
C:\Windows\System32\inetsrv\appcmd.exe stop apppool /apppool.name:saas
 // 发布.Net Core应用 需指定发布文件目录
dotnet publish -o D:\subendong\release\saas
 // 启动应用程序池 saas
C:\Windows\System32\inetsrv\appcmd.exe start apppool /apppool.name:saas
```

IIS服务器应用程序池必须为无代码托管

为防止生产环境Swagger无法使用，需在构建后的文件夹中编辑web.conf文件

![image-20221108230704528](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221108230704528.png)

添加如下代码

```xml
<environmentVariables>
    <environmentVariable name="ASPNETCORE_ENVIRONMENT" value="Development" />
</environmentVariables>
```

![1668787835347](http://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/1668787835347.png)

在模块中删除WebDAVModule

## Jenkins安装NodeJS环境

在Jenkins 系统管理中 插件管理 可用插件中安装`NodeJS Plugin`

并在系统管理中 全局工具配置中配置NodeJS

![image-20221122094753314](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221122094753314.png)

## 部署.Net Core 至 Docker容器

## Windows Server 部署Vue

### 本地Nginx

```shell
yarn
yarn build
# 删除文件夹
rmdir /q /s C:\Program" "Files\nginx-1.23.2\html\dist
# 复制文件夹到指定目录
xcopy /y /e /i C:\Users\Administrator\Documents\source\XiaoDaERP-Vben\dist C:\Program" "Files\nginx-1.23.2\html\dist
```

Linux远程服务器

```shell
# 发送文件（文件夹）到Linux远程服务器上
pscp -r -l root -pw Wyd210213 C:\Users\Administrator\Documents\source\XiaoDaERP-Vben\dist 8.140.174.251:/usr/local/nginx/html
```

## Jenkins部署Hexo博客

配置NodeJS环境

![image-20221122140826369](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221122140826369.png)

构建步骤

```shell
npm install hexo-cli -g
yarn
hexo clean
hexo g --debug
docker stop xiaodablog
docker rm xiaodablog
docker images
docker image rm xiaodablog
docker build -t xiaodablog:latest .
docker image rm -f $(docker images | grep "none" | awk '{print $3}')
docker images
docker run --name xiaodablog -p 80:80 -p 443:443 -d --privileged=true -v /usr/local/nginx/logs/xiaodablog:/var/log/nginx xiaodablog:latest
```

需要注意的是刚clone下来的项目，需要现在本地构建docker镜像并启动容器

否则会报错

## Jenkins部署Vue VbenAdmin

增加参数化构建过程

![image-20221122145043478](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221122145043478.png)

配置NodeJS环境

![image-20221122145109235](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221122145109235.png)

构建过程

```shell
pwd
npm config get registry
npm config set registry http://registry.npm.taobao.org/
npm install -g yarn
yarn
yarn build
echo "npm finish"
echo $version
docker build -t xiaodaerp/vbenvue:$version .
docker stop xiaodaerpvbenvue
docker rmi -f $(docker images | grep "none" | awk '{print $3}')
docker images
docker rm xiaodaerpvbenvue
docker run --name xiaodaerpvbenvue -p 81:80 -p 444:443 -d --privileged=true -v /usr/local/nginx/logs/xiaodaerpvbenvue:/var/log/nginx xiaodaerp/vbenvue:$version
```

需要注意的是刚clone下来的项目，需要现在本地构建docker镜像并启动容器

否则会报错

## Jenkins配置用户权限

系统管理 -> 插件管理 安装`Matrix Authorization Strategy Plugin`插件

![image-20221122174638567](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221122174638567.png)

授权策略选择`项目矩阵授权策略`

分配以下权限

![image-20221122174805834](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221122174805834.png)

## Jenkins部署dotNet 6项目到远程Linux服务器上

系统管理 -> 插件管理 安装`Publish Over SSH`插件

安装好后 在 系统管理 -> 系统配置中设置`SSH Servers`

![image-20221123095111849](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221123095111849.png)

并点击高级

![image-20221123095205119](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221123095205119.png)

设置密码

构建步骤

![image-20221123095510632](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221123095510632.png)

因为是上传文件夹至远程服务器指定目录，如果文件夹中内容发生变化，比如文件名，文件夹需要进行删除操作，所以在发送文件前需要先执行远程Shell命令

![image-20221130160623349](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221130160623349.png)

Exec command

```shell
cd /root/download
pwd
rm -rf XiaodaERP/
```

再进行上传文件夹部署操作

![image-20221130160724401](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221130160724401.png)

Source files

```shell
XiaodaERP/**
```

Remote directory

```shell
/root/download/
```

Exec command

```shell
cd /root/download
pwd
docker stop xiaodaerpnetcore
docker rm xiaodaerpnetcore
docker image rm xiaodaerp/netcore
docker images
docker image build -f ./XiaodaERP/Dockerfile -t xiaodaerp/netcore .
docker rmi -f $(docker images | grep "none" | awk '{print $3}')
docker images
docker run --name xiaodaerpnetcore -p 7274:80 -d xiaodaerp/netcore
```

# Jenkins环境配置

## Docker容器内安装NVM

首先以bash命令行交互形式进入容器

```shell
docker exec -it jenkins /bin/bash
```

下载并执行nvm-sh脚本

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

执行完成，需应用环境变量

```shell
source ~/.bashrc
```

全局安装pnpm

```shell
npm install -g pnpm
```

设置源

```shell
pnpm config set registry https://registry.npmmirror.com
```

查看nodejs位置

```shell
npm prefix -g
```

## Docker容器内安装JDK

首先下载好需要的jdk包

复制到容器内用户目录下

```shell
docker cp docker cp ~/OpenJDK21U-jdk_aarch64_linux_hotspot_21.0.8_9.tar.gz jenkins:/root
```

以交互模式进入到容器内

```shell
docker exec -it jenkins /bin/bash
```

解压压缩包

```shell
cd ~
tar -zxvf OpenJDK21U-jdk_aarch64_linux_hotspot_21.0.8_9.tar.gz
```

# Jenkins Pipeline（流水线）

```shell
pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 22.17.0'
    }
    
    environment {
        GIT_URL = 'http://192.168.6.20:9980/line-group/dify-conversation.git'
        BRANCH_NAME = 'erp-conversation'
    }
    
    stages {
        stage('Preparation') {
            steps {
                // 清理工作空间
                // deleteDir()
                
                // 拉取代码
                git branch: "${BRANCH_NAME}",
                    url: "${GIT_URL}",
                    credentialsId: '118322d7-1666-4f0b-b48b-349dcead864c',
                    changelog: true,
                    poll: false
            }
        }
        
        stage('Setup Environment') {
            steps {
                sh '''
                    node --version
                    pnpm --version
                '''
            }
        }
        
        stage('Intall Dependencies') {
            steps {
                sh '''
                    # 清理缓存
                    pnpm store prune || true
                    
                    # 安装依赖
                    pnpm install --frozen-lockfile
                    
                    # 检查依赖
                    pnpm list --depth 0
                '''
            }
        }
        
        stage('Build Production') {
            steps {
                sh '''
                    # 清理旧构建
                    rm -rf .next || true
                    
                    # 生产环境构建
                    pnpm run build
                    
                    # 验证构建结果
                    if [ -d ".next" ]; then
                        echo "构建成功，文件列表："
                        ls -la .next/
                        echo "总文件数：$(find dist -type f | wc -l)"
                    else
                        echo "构建失败，.next目录不存在"
                        exit 1
                    fi
                '''
            }
            
            post {
                success {
                    archiveArtifacts artifacts: '.next/**/*', fingerprint: true
                }
            }
        }
        
        stage('Quality Check') {
            steps {
                sh '''
                    # 代码检查
                    pnpm run lint --no-fix || echo "代码检查完成"
                    
                    # 类型检查
                    pnpm run type-check || echo "类型检查完成"
                '''
            }
        }
    }
    
    post {
        cleanup {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
```

# Jenkins Node（节点）

## 创建 Windows 服务

使用 **WinSW (Windows Service Wrapper)** 

### 1. 下载 WinSW

- 请访问 WinSW 的官方发布页面： https://github.com/winsw/winsw/releases
- 下载最新的 `.exe` 文件。鉴于是 Windows 服务器，请下载 **`WinSW-x64.exe`**。（如果系统是 32 位的，才下载 `WinSW-x86.exe`）。

### 2. 准备文件

1. 将下载的 `WinSW-x64.exe` 文件复制到工作目录：`D:\common_components\jenkins-agent`。
2. **（关键）重命名：** 在该目录中，将 `WinSW-x64.exe` 重命名为 `jenkins-agent-admin.exe`。（这个名字可以自定，但 `.xml` 必须同名）
3. 确保从 Jenkins 下载的 `agent.jar` 文件也在此目录中。

现在，`D:\common_components\jenkins-agent` 文件夹中**至少**应该有这两个文件：

- `jenkins-agent-admin.exe`
- `agent.jar`

### 3. 创建 XML 配置文件

1. 在**同一目录** (`D:\common_components\jenkins-agent`) 中，创建一个**新的文本文件**。

2. 将这个新文件重命名为 **`jenkins-agent-admin.xml`**。（**注意：** 它的名字必须和 `.exe` 文件的名字完全一样，只是扩展名不同）。

3. 用记事本或任何文本编辑器打开 `jenkins-agent-admin.xml`，然后将**以下所有内容**完整地复制并粘贴进去：
   ```xml
   <service>
       <id>jenkins-agent-admin</id>
       
       <name>Jenkins Agent (Admin)</name>
       
       <description>此服务以管理员权限运行 Jenkins JNLP 代理。</description>
       
       <executable>java</executable>
       
       <arguments>-jar "%BASE%\agent.jar" -jnlpUrl http://192.168.6.1:23123/computer/windows%2Dadmin%2Dagent/jenkins-agent.jnlp -secret *********84158aed83c119f8f53b579db8a315a4e9bda61687cbdd088e***7 -workDir "D:\common_components\jenkins-agent"</arguments>
       
       <workingdirectory>D:\common_components\jenkins-agent</workingdirectory>
       
       <log mode="rotate"/>
   </service>
   ```

### 4. 安装服务

1. 再次打开一个**管理员**命令提示符 (cmd)。

2. `cd` 到工作目录：

   ```cmd
   D:
   cd D:\common_components\jenkins-agent
   ```

3. 运行重命名的 `.exe` 文件，并附带 `install` 命令：
   ```cmd
   jenkins-agent-admin.exe install
   ```

### 5. 设置登录帐户

这是**必须**的步骤，和之前一样：

1. 打开 "服务" (`services.msc`)。
2. 找到新安装的服务，名字是 **"Jenkins Agent (Admin)"**（这是在 `.xml` 中设置的）。
3. 右键点击 -> **"属性"** -> **"登录"** 选项卡。
4. 选择 **"此帐户"**，并输入**Windows 管理员用户名和密码**。
5. 点击 "应用" -> "确定"
