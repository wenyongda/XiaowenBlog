---
title: Intellij Platform
date: 2023-11-18 10:30:31
author: 文永达
---
# Intellij IDEA

## Spring Boot DevTools热重载

pom.xml引入依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <!-- 只在运行时起作用，打包时不打进去（防止线上执行打包后的程序，启动文件监听线程File Watcher，耗费大量的内存资源） -->
            <scope>runtime</scope>
            <!-- 防止将依赖传递到其他模块中 -->
            <optional>true</optional>
        </dependency>
		<plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
    	</plugin>
```

打开IDEA设置 找到 Build, Execution, Deployment -> Compiler -> Build project automatically 勾选

![image-20230323102425710](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230323102425710.png)

继续找到Advanced Settings 勾选 Allow auto-make to start even if developed application is currently running

![image-20230323102621741](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230323102621741.png)

## 使用@Autowired注解报红的解决办法

打开Settings -> Editor -> Inspections -> Spring -> Spring Core -> Code，找到Incorrect autowiring in Spring bean components，将代码审查级别从Error修改为Warning

![image-20230309133646128](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230309133646128.png)

# JetBrains Rider

## 快捷键

### CREATE AND EDIT(创建和编辑)

#### Show Context Actions(显示上下文操作)

​	Alt+Enter

#### Basic Code Completion(基本代码补全)

​	Ctrl+Space

#### Smart Code Completion(智能代码补全)

​	Ctrl+Shift+Space

#### Type Name Completion(类型名称补全)

​	Ctrl+Alt+Space

#### Complete Statement(完成语句)

​	Ctrl+Shift+Ent

## 安装CodeGlance Pro后关闭原有的在滚动条悬停时显示代码

CodeGlancePro是一款用于在编辑器旁边显示代码缩略图的插件。

如果您想要把之前的代码预览隐藏，可以通过以下操作实现：

1. 打开JetBrains Rider，进入设置界面。可以通过快捷键`Ctrl+Alt+S`(Windows/Linux) 或 `Cmd+,`(Mac) 快速打开设置界面。
2. 在“Editor”中，找到“General”选项卡。在这个选项卡中，找到“Appearance”，其中有一个“Show code lens on scrollbar hover”复选框。取消选中该复选框可隐藏在滚动条悬停时显示代码。

![image-20230322155611836](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230322155611836.png)

# IdeaVim

## 普通模式: `ESC`

### 基本移动命令:

- `h` – 将光标向左移动一个字符。
- `l` – 将光标向右移动一个字符。
- `k` – 将光标向上移动一行。
- `j` – 将光标向下移动一行。
- `w` – 向前跳一个单词。
- `b` – 向后跳一个单词。
- `0` – 跳到行首。
- `$` – 跳到行尾。