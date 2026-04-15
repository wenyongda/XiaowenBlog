---
title: PowerDesigner
date: 2022-12-07 9:05:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/B951AE18-D431-417F-B3FE-A382403FF21B.jpeg
tags: [PowerDesigner, 数据建模, 数据库设计, 工具]
categories: [开发工具, 数据库]
---

# PowerDesigner 

## 简介

PowerDesigner是图形化的建模环境，几乎包括了数据库模型设计的全过程。利用PowerDesigner可以制作数据流程图、概念数据模型、物理数据模型，可以生成多种客户端开发工具的应用程序。它可与许多流行的数据库设计模型。

## 新建数据库物理模型

File -> New Model...

![image-20221207094426837](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207094426837.png)
Model types -> Physical Data Model -> Physical Diagram

![image-20221207094525649](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207094525649.png)

DBMS可以选择数据库

![image-20221207094631013](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207094631013.png)

## 修改当前DBMS

Database -> Change Current DBMS

![image-20221207094737302](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207094737302.png)

New 选择要修改的DBMS

![image-20221207094815942](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207094815942.png)

## 根据Name生成Comment

### SQL Server

Tools -> Resources -> DBMS...

![image-20221207095510030](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207095510030.png)会弹出DBMS 列表

![image-20221207095551772](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207095551772.png)

为了不修改原有的，所以这里选择新建一个DBMS，选择New

![image-20221207095726544](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207095726544.png)

取名，选择拷贝原有的DBMS

![image-20221207095817293](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207095817293.png)

另存到默认路径

![image-20221207095910048](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207095910048.png)

接着会弹出DBMS属性页面

![image-20221207100021926](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207100021926.png)

修改关键特征树，在 Script\Objects\Table\TableComment和Script\Objects\Column\ColumnComment位置的直修改如下：

修改TableComment

![image-20221207100115731](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207100115731.png)修改右侧Value

```sql
EXECUTE sp_addextendedproperty 
N'MS_Description', N'%COMMENT%', N'user', N'%OWNER%', N'table', N'%TABLE%', NULL, NULL
```

![image-20221207100228921](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207100228921.png)

修改ColumnComment

![image-20221207100356529](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207100356529.png)

```sql
EXECUTE sp_addextendedproperty 
N'MS_Description', N'%Name%', N'user', N'%OWNER%', N'table', N'%TABLE%', N'column', N'%COLUMN%'
```

确定即可

修改生成数据库

Database -> Generate Database

![image-20221207101015449](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207101015449.png)

弹出对话框

选择Format 勾选 Generate name in empty comment

![image-20221207101114940](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207101114940.png)

否则当你备注为空的时候注释出不来；反之，如果你备注不为空那么名称(Name)才能作为注释出现！！

测试是否成功生成

![image-20221207101314310](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207101314310.png)

成功生成

### MySQL

Database -> Edit Current DBMS...

![image-20230310235910566](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230310235910566.png)

#### 表注释

左侧菜单 Script -> Objects -> Table -> TableComment

![image-20230311000046142](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230311000046142.png)

```tex
alter table [%QUALIFIER%]%TABLE% comment %.60qA:COMMENT%
```

#### 字段注释

左侧菜单 Script -> Objects -> Column -> Add

![image-20230311000912484](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230311000912484.png)

将


```tex
%20:COLUMN% [%National%?national ]%DATATYPE%[%Unsigned%? unsigned][%ZeroFill%? zerofill][ [.O:[character set][charset]] %CharSet%][.Z:[ %NOTNULL%][%R%?[%PRIMARY%]][%IDENTITY%? auto_increment:[ default %DEFAULT%]][ comment %.q:@OBJTLABL%]]
```

修改为

```tex
%20:COLUMN% [%National%?national ]%DATATYPE%[%Unsigned%? unsigned][%ZeroFill%? zerofill][ [.O:[character set][charset]] %CharSet%][.Z:[ %NOTNULL%][%IDENTITY%? auto_increment:[ default %DEFAULT%]][ comment %.q:COMMENT%]]  
```

#### 代码生成

点击菜单Database-->enerate Database

![image-20230311001120719](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230311001120719.png)



出现Database Generation屏幕：在Format tab页中，勾选Generate name in empty comment

单击确定就可以生成相应的代码，代码中就会出现上面的注释了。

![image-20230311001246849](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230311001246849.png)

## 在修改name的时候，code的值将跟着变动

PowerDesign中的选项菜单里修改，在[Tool]-->[General Options]->[Dialog]->[Operating modes]->[Name to Code mirroring],这里默认是让名称和代码同步，将前面的复选框去掉就行了。

