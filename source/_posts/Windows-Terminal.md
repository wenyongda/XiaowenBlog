---
title: Windows Terminal
date: 2025-12-12 09:31:56
tags:
---

# SSH

## 生成 SSH 密钥

1. SSH 秘钥默认储存在账户的主目录下的 ~/.ssh 目录
   如：`C:\Users\用户\.ssh\`

   查看是否包含id_rsa和id_rsa.pub(或者是id_dsa和id_dsa.pub之类成对的文件)，有`.pub 后缀的文件`就是**公钥**，另一个文件则是密钥。

   如果有这两个文件，则跳过1.2；如果没有这两个文件，甚至.ssh目录也没有，则需要用ssh-keygen 来创建

2. ###### 生成密钥信息

   在`.ssh 目录`下右键打开[Git Bash](https://so.csdn.net/so/search?q=Git Bash&spm=1001.2101.3001.7020)(.ssh目录不存在，则在任一目录下操作，或者手动创建该目录)

3. ###### 生成密钥

   > ssh-keygen -t rsa -C "注释信息（一般为邮箱your_email@youremail.com）"

4. 在~/.ssh/下会生成两个文件，id_rsa和id_rsa.pub

   > id_rsa是私钥
   >
   > id_rsa.pub是公钥

5. 启动 **PuTTY Key Generator**
   ![image-20250416151051085](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151051085.png)

6. 选择之前生成的id_rsa
   ![image-20250416151307312](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151307312.png)

7. 出现如下，选择 **Save private key** 保存秘钥
   ![image-20250416151416275](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151416275.png)

8. 保存到 ~/.ssh 目录即可
   ![image-20250416151503685](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151503685.png)

## 配置 SSH

1. 确认 .ssh 目录位置

SSH 的配置文件通常位于当前用户目录下的 `.ssh` 文件夹中。

- **路径通常是：** `C:\Users\你的用户名\.ssh\`

你可以按 `Win + R`，输入 `%USERPROFILE%\.ssh` 并回车。

- **如果文件夹存在：** 直接进入。
- **如果文件夹不存在：** 打开命令提示符（CMD）或 PowerShell，输入 `mkdir .ssh` 创建它。

2. 创建 config 文件

在 `.ssh` 文件夹内，创建一个名为 `config` 的文件。

- **注意：** 文件名必须是 `config`，**没有任何后缀名**（不要叫 `config.txt`）。
- **创建方法：** 在文件夹内右键 -> 新建文本文档 -> 命名为 `config` -> 删除 `.txt` 后缀 -> 确认修改。

3. 编辑 config 文件
   使用任意文本编辑器（如记事本、VS Code、Notepad++）打开该文件，按照以下格式添加内容。
   基础语法结构

   ```
   Host 别名
       HostName 主机IP或域名
       Port 端口号 (如果是默认22端口可省略)
       User 用户名
       IdentityFile 私钥路径 (如果是密码登录可省略)
   	PreferredAuthentications publickey
   ```

4. 远程 Linux 服务器配置 ssh 公钥
   ```bash
   vim ~/.ssh/authorized_keys
   ```

   内容使用**PuTTY Key Generator**，**Load Private Key** 后显示的 **Public key**，内容换行追加即可![image-20251212094845175](https://rustfs.wenyongdalucky.club:443/hexo/image-20251212094845175.png)

   

5. 测试连接

   ```powershell
   ssh <你的Host别名>
   # 例如： ssh myserver
   ```

## 访问 Windows SSH 客户端和 SSH 服务器

最新版本的 Windows 10 和 Windows 11 包含基于 OpenSSH（一个使用 SSH 协议进行远程登录的连接工具）的内置 SSH 服务器和客户端。 OpenSSH 加密客户端与服务器之间的所有流量，从而遏止窃听、连接劫持和其他攻击。

默认情况下，OpenSSH 客户端和 OpenSSH 服务器位于以下目录：`C:\Windows\System32\OpenSSH`。 你还可以检查它是否存在于“Windows 设置”>“系统”>“可选功能”中，然后在添加的功能中搜索“OpenSSH”。

![ssh_optionalfeature](https://rustfs.wenyongdalucky.club:443/hexo/ssh-optionalfeature.png)

## 创建档案

你可以通过执行 `ssh user@machine` 在命令提示符下启动 SSH 会话，系统将提示你输入密码。 可以将 `commandline` 设置添加到配置文件对象的 `list` 内的 [settings.json 文件](https://learn.microsoft.com/zh-cn/windows/terminal/install#settings-json-file) 中的配置文件，以创建在启动时执行此项的 Windows 终端配置文件。

```json
{
  "icon": "C:\\Windows\\System32\\wsl.exe",
  "name": "user@machine ssh profile",
  "commandline": "ssh user@machine"
}
```

## 指定起始目录

若要指定 Windows 终端调用的 ssh 会话的起始目录，可以使用以下命令：

```json
{
  "commandline": "ssh -t bob@foo \"cd /data/bob && exec bash -l\""
}
```

`-t` 标志强制执行伪终端分配。 这可用于在远程计算机上执行任意基于屏幕的程序，例如实现菜单服务。 将需要使用转义双引号，因为 bourne 外壳派生物不会为单引号中的字符串执行任何额外分析。
