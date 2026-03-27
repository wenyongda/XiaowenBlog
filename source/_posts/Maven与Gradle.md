---
title: Maven与Gradle
date: 2023-11-18 10:30:31
author: 文永达
---
# Maven

## Maven to Gradle

在 `pom.xml`文件所在的目录下执行：

```shell
gradle init # 根据pom.xml内容生成对应的gradle配置
gradle build # 开启gradle构建
```

# Gradle



## Gradle to Maven

`Gradle`项目转`Maven`项目需要借助一个Gradle插件，在项目的`module`的`build.gradle`文件中加入以下配置即可

```shell
apply plugin: 'maven'
```

执行命令

```	shell
gradle install
```

完成之后，将会在当前Module项目的build目录下的poms文件夹下生成pom-default.xml，将其拷贝到项目的根目录下即可。