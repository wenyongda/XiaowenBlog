---
title: Python
date: 2025-03-10 14:26:30
tags: [Python, pip, 编程语言]
categories: [编程语言, Python]
---

# pip

## 查看版本

```shell
pip --version
```

## 使用Pip安装Github上的软件包

接下来，使用以下命令来安装Github上的软件包：

```python
pip install git+https://github.com/username/repository.git
```

## 升级和卸载软件包

要升级软件包，可以使用以下命令：

```python
pip install --upgrade package_name
```

其中，`package_name`是你要升级的软件包的名称。Pip会自动检查版本并安装最新的软件包。

如果你想卸载已安装的软件包，可以使用以下命令：

```python
pip uninstall package_name
```

Pip会询问你是否确定卸载软件包，并删除相关的文件。

# Python __name__

首先需要了解 __name__ 是属于 python 中的内置类属性，就是它会天生就存在于一个 python 程序中，代表对应程序名称

```python
import requests
class requests(object):
    def __init__(self,url):
        self.url=url
        self.result=self.getHTMLText(self.url)
    def getHTMLText(url):
        try:
            r=requests.get(url,timeout=30)
            r.raise_for_status()
            r.encoding=r.apparent_encoding
            return r.text
        except:
            return "This is a error."
print(__name__)
```

结果：

```shell
__main__
Process finished with exit code 0
```

当这个 pcRequests.py 作为模块被调用时，则它的 __name__ 就是它自己的名字：

```python
import pcRequestspcRequestsc=pcRequestsc.__name__
```

结果：

```shell
'pcRequests'
```

# UV

## Python版本管理（安装和管理Python解释器）

| 命令                          | 说明                                   |
| ----------------------------- | -------------------------------------- |
| uv python list                | 查看可用和已安装的Python 版本          |
| uv python install             | 安装 Python 版本                       |
| uv python find                | 查找已安装的 Python信息                |
| uv python pin                 | 将当前项目固定使用特定 Python 版本     |
| uv python uninstall           | 卸载 Python 版本                       |
| uv python install --reinstall | 重新安装Python，适用于Python版本的更新 |

## 项目管理（创建和开发带有 `pyproject.toml`的Python 项目）

| **命令**   | **说明**                                                     |
| ---------- | ------------------------------------------------------------ |
| uv init    | 创建新 Python 项目并初始化该项目                             |
| uv add     | 为项目添加依赖，安装软件包并将依赖声明写入`pyproject.toml`文件 |
| uv remove  | 从项目移除依赖，移除软件包并将依赖从文件`pyproject.toml`中移除 |
| uv sync    | 同步项目依赖到环境                                           |
| uv lock    | 为项目依赖创建锁文件                                         |
| uv run     | 在项目环境中运行命令                                         |
| uv export  | 将项目的锁文件导出为其他格式                                 |
| uv tree    | 查看项目依赖树                                               |
| uv build   | 构建项目为分发包                                             |
| uv publish | 发布项目到包索引                                             |

