---
title: Typora
date: 2022-11-18 14:48:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/B951AE18-D431-417F-B3FE-A382403FF21B.jpeg
---
# Typora

## 快捷键

### 字体操作快捷键

| 功能     | 快捷键      |
| -------- | ----------- |
| 字体加粗 | Ctrl+B      |
| 下划线   | Ctrl+U      |
| 倾斜     | Ctrl+I      |
| 删除线   | Alt+Shift+5 |

### 插入功能快键键

| **功能**                     | **快键键**   |
| ---------------------------- | ------------ |
| 插入图片(本地图片可直接拖入) | Ctrl+Shift+I |
| 插入表格                     | Ctrl+T       |
| 插入有序列表                 | Ctrl+Shift+[ |
| 插入无序列表                 | Ctrl+Shift+] |
| 插入超链接                   | Ctrl+K       |
| 插入代码片                   | Ctrl+Shift+` |
| 插入代码块                   | Ctrl+Shift+K |
| 插入公式块                   | Ctrl+Shift+M |
| 插入引用块                   | Ctrl+Shift+Q |

### 标题段落快捷键

| 功能                  | 快捷键   |
| --------------------- | -------- |
| 段落（正文）          | Ctrl+0   |
| 一级标题              | Ctrl+1   |
| 二级标题              | Ctrl+2   |
| 三–六级标题(以此类推) | Ctrl+3–6 |
| 提升标题级别          | Ctrl+‘+’ |
| 降低标题级别          | Ctrl+‘-’ |



## 设置引用图片存储路径

![image-20221118150139161](https://rustfs.wenyongdalucky.club:443/hexo/image-20221118150139161.png)

## Typora添加右键新建Markdown文件

### 步骤

新建一个txt文本文件，写入：

```shell
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\.md]
@="Typora.md"
"Content Type"="text/markdown"
"PerceivedType"="text"

[HKEY_CLASSES_ROOT\.md\ShellNew]
"NullFile"=""


```

然后修改.txt后缀为.reg的注册表文件

然后双击运行

## 几点说明

这个方法要先安装 `Typora`。如果不安装 `Typora`，只是导入上述注册表，在很久以前是可以生效的，但自从某次 `Windows`更新之后就失效了，之后的 Windows 要求 `[HKEY__ROOT\.md]`项的 `@ 值 xxx`必须对应于注册表项 `[HKEY_CLASSES_ROOT\xxx]`，这里填写 `Typora.md`，是因为 `Typora `已经为我们生成了 `[HKEY_CLASSES_ROOT\Typora.md]`，可以不用再重入导入，这个项的 `@ 值`代表右键新建该类型的名称显示。如果是自定义其他的类型，则必须导入一遍，比如要添加 `.py`类型，一个最简的注册表如下:

```shell
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\.py]
@="PythonFile"

[HKEY_CLASSES_ROOT\.py\ShellNew]
"NullFile"=""

[HKEY_CLASSES_ROOT\PythonFile]
@="Python 脚本"

```

## 可能遇到的问题

右键新建markdown文件以后，可能会发现文件有几十MB那么大。

解决方法：`win+R`打开“运行”输入 `regedit`打开注册表，打开路径 `\HKEY_CLASSES_ROOT\.md\ShellNew`

删除多余的文件（尤其是有一个什么Markdown File），只保留如下的两项。然后关闭注册表，即可修复bug

![img](https://rustfs.wenyongdalucky.club:443/hexo/regedit.png)



## 上传图片至阿里云OSS

模板

```json
{
  "picBed": {
    "uploader": "aliyun",
    "aliyun": {
    "accessKeyId": "",
    "accessKeySecret": "",
    "bucket": "", // 存储空间名
    "area": "", // 存储区域代号
    "path": "img/", // 自定义存储路径
    "customUrl": "", // 自定义域名，注意要加 http://或者 https://
    "options": "" // 针对图片的一些后缀处理参数 PicGo 2.2.0+ PicGo-Core 1.4.0+
    }
  },
  "picgoPlugins": {}
}
```


![image-20221121130426162](https://rustfs.wenyongdalucky.club:443/hexo/image-20221121130426162.png)

![image-20221121130857072](https://rustfs.wenyongdalucky.club:443/hexo/image-20221121130857072.png)

## 上传图片至Minio

### 安装pipgo

使用 npm 全局安装

```shell
npm install picgo -g
```

安装成功后，输入以下命令查看是否安装成功

```shell
picgo -v
```

### 安装Minio插件

```shell
picgo install minio
```

安装完成后，输入以下命令查看是否安装成功

```shell
picgo use plugins
```

### 编辑pipgo配置文件

通常位于`~/.picgo/config.json`

```shell
{
  "picBed": {
    "current": "minio",
    "minio": {
      "endpoint": "your-minio-endpoint",  // MinIO服务器地址
      "port": 9000,                      // MinIO端口，默认9000
      "accessKey": "your-access-key",    // MinIO访问密钥
      "secretKey": "your-secret-key",    // MinIO私有密钥
      "bucket": "your-bucket-name",      // 存储桶名称
      "path": "img/",                    // 存储路径（可选）
      "useSSL": false,                    // 是否使用SSL（默认false）
      "customDomain": "",				// 自定义域名
      "pathFormat": ""
    }
  },
  "picgoPlugins": {
    "picgo-plugin-minio": true
  }
}
```

### 测试上传

```shell
picgo upload /path/to/your/image.png
```

### Typora设置

![image-20250416154513069](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416154513069.png)

## 主题

### typora-gitbook-theme

https://github.com/h16nning/typora-gitbook-theme

### typora-ladder-theme

https://github.com/guangzhengli/typora-ladder-theme

### Mdmdt

[cayxc/Mdmdt: Typora极简文档主题Mdmdt，包含亮色和暗色两种主题，是深度定制的个性化Typora主题；Typora minimalist document theme Mdmdt. Featuring both light and dark themes, it is a deeply customized personalized Typora theme.](https://github.com/cayxc/Mdmdt)
