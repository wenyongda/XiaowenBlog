---
title: VsCode
date: 2025-04-16 15:18:28
tags:
---

# 快捷键

## 多行编辑：Alt+Click



# 插件

## Remote - SSH

### 配置远程连接Linux密码免登录

首先使用 `PuTTY Key Generator`生成ppk

![image-20250725142159081](https://rustfs.wenyongdalucky.club:443/hexo/image-20250725142159081.png)

出现进度条，在框内摇晃鼠标，直到进度条满，就可以看到生成的公钥了，私钥是需要保存到本地的，最好保存到`~/.ssh`目录下

![image-20250725142313290](https://rustfs.wenyongdalucky.club:443/hexo/image-20250725142313290.png)

![image-20250725142335929](https://rustfs.wenyongdalucky.club:443/hexo/image-20250725142335929.png)

![image-20250725142501371](https://rustfs.wenyongdalucky.club:443/hexo/image-20250725142501371.png)

框内是生成的公钥，可以保存到本地，也可以直接复制到要连接的Linux服务器上的`~/.ssh/authorized_keys`文件内

![image-20250725142604044](https://rustfs.wenyongdalucky.club:443/hexo/image-20250725142604044.png)

因为刚刚保存的私钥是`ppk`格式的，如果是SSH连接用，需要转换一下，`PuTTY Key Generator`同样有这个功能

如果是刚生成好的，可以直接点击上方工具栏 Conversions -> Export OpenSSH Key 然后保存到`~/.ssh`目录下。

![image-20250725142721334](https://rustfs.wenyongdalucky.club:443/hexo/image-20250725142721334.png)

如果是要打开以前生成的密钥，File -> Load private Key。然后再重复上述 Conversions -> Export OpenSSH Key 步骤即可。

![image-20250725142840387](https://rustfs.wenyongdalucky.club:443/hexo/image-20250725142840387.png)

编辑配置文件，一般位于`~/.ssh/config`

```shell
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
Host <host>
  HostName <host_name>
  Port 22
  User <user>
  IdentityFile C:/Users/user/.ssh/id_rsa
  PreferredAuthentications publickey
```

在要连接的远程服务器上保存公钥，使用要进行连接的用户进行登录

```shell
vim ~/.ssh/authorized_keys
```

将秘钥对应的公钥复制上去

![image-20250416155023228](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155023228.png)

保存即可

编辑 **sshd_config**

```shell
vim /etc/ssh/sshd_config

# 使用 /PubkeyAuthentication 查找
# 编辑，取消注释，并将no 改为yes
PubkeyAuthentication yes

# :wq 保存
# 重启sshd服务 AlmaLinux 下
systemctl restart sshd
# ubuntu 下
sudo systemctl restart ssh
```

Windows `~/.ssh` 目录属性中 安全 -> 高级

![image-20250416155557565](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155557565.png)

需 停用继承，我这里已经停用

![image-20250416155636248](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155636248.png)

然后点击 添加，选择主体

![image-20250416155715122](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155715122.png)

选择高级

![image-20250416155749520](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155749520.png)

点击 立即查找

![image-20250416155823198](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155823198.png)

选择 Administrator 和 SYSTEM

![image-20250416155859285](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155859285.png)

![image-20250416155914072](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155914072.png)

点击两次 确定后，将 基本权限改为 完全控制

![image-20250416155949694](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416155949694.png)

再次点击确定

重复上述步骤，将 当前系统登录用户 添加，不需要勾选完全控制 即可

# 问题

## 解决VSCode使用微软账户同步设置后，再打开需要重新登录的问题

在设置中搜索Microsoft-sovereign-cloud: Environment
修改为ChinaCloud

