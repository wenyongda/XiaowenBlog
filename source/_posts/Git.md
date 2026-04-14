---
title: Git
date: 2023-10-23 10:30:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/67239FBB-E15D-4F4F-8EE8-0F1C9F3C4E7C.jpeg
---



# Git

## Git 全局设置:

```shell
git config --global user.name "username"
git config --global user.email "email"
```

## 拉取项目

```shell
git clone <url>
```

## 创建 git 仓库:

```shell
mkdir aaa
cd aaa
git init
touch README.md
git add README.md
# 添加当前目录下全部文件
git add .
git commit -m "first commit"
git remote add origin https://gitee.com/wenyongda/aaa.git
git push -u origin master
```

## 已有仓库

```shell
cd existing_git_repo
git remote add origin https://gitee.com/wenyongda/aaa.git
git push -u origin master
```

## 查看作者名称、作者邮箱

```shell
git config user.name
git config user.email
git config --list
```

## 解决Git提交失败，提示用户密码错误

remote: [31m[session-8b4b799a] wenyongda: Incorrect username or password (access token)[0m

首先查看C盘下gitconfig配置文件配置

```properties
[core]
	autocrlf = true
[user]
	name = 文永达
	email = bmdzh11713@163.com
[difftool "sourcetree"]
	cmd = 'C:/Program Files/TortoiseSVN/bin/TortoiseMerge.exe' \"$LOCAL\" \"$REMOTE\"
[mergetool "sourcetree"]
	cmd = 'C:/Program Files/TortoiseSVN/bin/TortoiseMerge.exe'  -base:\"$BASE\" -mine:\"$LOCAL\" -theirs:\"$REMOTE\" -merged:\"$MERGED\"
	trustExitCode = true
[credential "https://gitee.com"]
	provider = generic
```

  查看user下的password正不正确，如果没有设置转到控制面板

Windows下 `Win + R`运行输入`control`

用户账户 -> 凭据管理器 -> 管理 Windows 凭据 ->  普通凭据

编辑 git:https://gitee.com下的用户名和密码

如果没有手动添加，并在Git Bash中执行

```shell
git config --global credential.helper wincred
```

## 储藏 (Stash)

```shell
git stash

git stash list
```



## SSH提交

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

5. SourceTree配置
   ![image-20250416142637966](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416142637966.png)
   启动 **PuTTY Key Generator**

6. 依次点击
   ![image-20250416151051085](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151051085.png)

7. PPKfile version 选择 2
   ![image-20250416151128595](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151128595.png)

8. 选择之前生成的id_rsa
   ![image-20250416151307312](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151307312.png)

9. 出现如下，选择 **Save private key** 保存秘钥
   ![image-20250416151416275](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151416275.png)

10. 保存到 ~/.ssh 目录即可
    ![image-20250416151503685](https://rustfs.wenyongdalucky.club:443/hexo/image-20250416151503685.png)

11. 在 **Sourcetree** 中 **工具** -> **选项** 中选择刚刚保存的 ppk文件即可

## 变更SSH pubKey comment

> [Change an SSH key comment](https://www.commands.dev/workflows/change_ssh_key_comment)

```
# new_comment 新的注释
# ssh_key_path ssh私钥路径 ~/.ssh/id_rsa
ssh-keygen -c -C "new_comment" -f ssh_key_path
```

## 还原变更

```shell
# 指定文件或目录
git checkout -- <filename or directory>
```

## 撤回（重置）本地仓库提交

若想把已经提交到本地仓库的提交再撤回到本地，通常有几种情况和对应的命令。最常用的是 `git reset`。

`git reset` 命令可以用来将当前分支的 `HEAD` 指针移动到指定的提交，并根据不同的模式来处理**暂存区**和**工作目录**。

- ### 1. `git reset --soft <commit>`

  

  - **作用：** 将 `HEAD` 指针移动到指定的 `<commit>`，但**保留**工作目录和暂存区的内容。这意味着你的文件会回到该 `<commit>` 时的状态，但是你当前的修改和暂存的修改都会保留。

  - **适用场景：** 你提交了一个 commit，但是发现提交信息写错了，或者少提交了一些文件。你可以用 `--soft` 回退到上一个 commit，然后修改文件，重新提交。

  - **示例：**

    ```Bash
    git reset --soft HEAD~1
    ```

    这会将 `HEAD` 回退到上一个提交（`HEAD~1` 表示上一个提交）。

- ### 2. `git reset --mixed <commit>` (默认模式)

  

  - **作用：** 将 `HEAD` 指针移动到指定的 `<commit>`，并**清空**暂存区，但**保留**工作目录的内容。这意味着你的文件会回到该 `<commit>` 时的状态，你当前的修改会保留在工作目录中（未暂存）。

  - **适用场景：** 你提交了一个 commit，但是发现这个 commit 的内容不对，想撤销提交，并重新暂存和提交。

  - **示例：**

    ```Bash
    git reset HEAD~1
    # 或者 git reset --mixed HEAD~1
    ```

    这会将 `HEAD` 回退到上一个提交，并将暂存区清空，但保留文件在工作目录。

  

- ### 3. `git reset --hard <commit>`

  

  - **作用：** 将 `HEAD` 指针移动到指定的 `<commit>`，并**清空**暂存区和**丢弃**工作目录的所有修改。这意味着你的仓库会完全回到该 `<commit>` 时的状态，所有在该 `<commit>` 之后的修改都会丢失，**这是最危险的操作**。

  - **适用场景：** 你想完全放弃当前分支上的所有最新修改和提交，回到之前的某个干净的状态。

  - **示例：**

    ```Bash
    git reset --hard HEAD~1
    ```

    这会将 `HEAD` 回退到上一个提交，并丢弃所有工作目录和暂存区的修改。



## 如何找到 `<commit>` 的 ID？



你可以使用 `git log` 命令来查看提交历史，并找到你想要回退到的提交的哈希值（commit ID）。

Bash

```
git log
```

`git log` 会显示类似这样的信息：

```
commit abcdef1234567890abcdef1234567890abcdef (HEAD -> master)
Author: Your Name <your.email@example.com>
Date:   Fri Aug 1 13:20:00 2025 +0800

    最新的提交

commit fedcba0987654321fedcba0987654321fedcba (origin/master)
Author: Another Name <another.email@example.com>
Date:   Thu Jul 31 10:00:00 2025 +0800

    之前的提交
```

你可以复制 `commit` 后面的哈希值（例如 `fedcba0987654321...`）来替换上面的 `<commit>`。

## git 如何关闭commit时的语法检测 ---husky

1 报错提示
　　git commit提交时报错如下：

　　husky+>+pre-commit+(node+v14.18.2)

2 解决方案
　　1：卸载husky。只要把项目的package.json文件中devDependencies节点下的husky库删掉，然后重新npm i 一次即可。或者直接在项目根目录下执行npm uninstall husky --save也可以，再次提交，自动化测试功能就屏蔽掉

　　2：进入项目的.git文件夹(文件夹默认隐藏,可先设置显示或者命令ls查找),再进入hooks文件夹,删除pre-commit文件,重新git commit -m ‘xxx’ git push即可

　　3：将git commit -m “XXX” 改为 git commit --no-verify -m “xxx”

# github

##  push/pull老是超时解决方法

**设置针对github.com本身(如果你需要代理的仓库，都是github上面的，只要设置这个)的代理：**

```shell
#只对github.com
# 找到自己的代理的port的4个数字的端口就行，不一定是1080口的
git config --global http.https://github.com.proxy socks5://127.0.0.1:7890
#上面是别人的，如果你的代理是http类型的，如下设置：
git config --global http.https://github.com.proxy 'http://127.0.0.1:代理的port'

#取消代理
git config --global --unset http.https://github.com.proxy
```

**针对所有仓库(包含github.com之外的仓库的代理)**

```shell
# 找到自己的代理的port的4个数字的端口就行，不一定是1080口的
git config --global http.proxy 'socks5://127.0.0.1:1080'
git config --global https.proxy 'socks5://127.0.0.1:1080'

#上面是别人的，如果你的代理是http类型的，如下设置：
# 找到自己的代理的port的4个数字的端口就行，不一定是1080口的
git config --global http.proxy  'http://127.0.0.1:代理的port'
git config --global https.proxy  'http://127.0.0.1:代理的port'
```

## 解决remote: Support for password authentication was removed on August 13, 2021.

1. Github 头像处 **Settings**

2. 左侧最下边 **Developer settings**

3. 左侧找到 **Personal access tokens**

4. 点击展开，找到 **Tokens (classic)**

5. 右侧下拉框 **Generate new token (classic)**

6. 按以下配置
   ![在这里插入图片描述](https://rustfs.wenyongdalucky.club:443/hexo/2ceb11682cc7230cf1220ecb78e548b5.png)

7. 得到 token
   ![在这里插入图片描述](https://rustfs.wenyongdalucky.club:443/hexo/76ad4bb4370c7ae798f7b92c25859901.png)

8. 修改现有项目的url
   ```shell
   git remote set-url origin  https://<your_token>@github.com/<USERNAME>/<REPO>.git
   ```

   

# Gitea

## 备份

数据库备份至postgresql

```shell
docker exec -u git -it -w /tmp gitea bash -c '/app/gitea/gitea dump --database postgres --config /data/gitea/conf/app.ini'
```

# Sourcetree

这里主要介绍两种最常用的场景，对应 `git reset --soft` 和 `git reset --hard` 的效果。

## 撤回（重置）本地仓库提交

### 1. 撤销最近一次提交（保留修改以便重新提交）



这类似于 `git reset --soft HEAD~1` 或 `git reset --mixed HEAD~1` 的效果，目的是撤销提交，但保留你的文件修改。

1. **打开日志/历史记录：** 在 SourceTree 界面的左侧，找到你的仓库，然后点击顶部的“日志/历史”或“历史记录”选项卡。

2. **定位要撤销的提交：** 在提交历史列表中，找到你想撤销的**前一个**提交（也就是你希望回退到的那个提交）。

3. **右键点击并选择：** 右键点击该提交。

4. **选择“将当前分支重置到此提交”：** 在弹出的菜单中选择 **“将当前分支重置到此提交”** (Reset current branch to this commit)。
   ![image-20250801140709918](https://rustfs.wenyongdalucky.club:443/hexo/image-20250801140709918.png)

5. **选择重置模式：** 此时会出现一个弹窗，让你选择重置模式：

   - **Soft（软重置）**：勾选这个选项。它会将 `HEAD` 指针移动到选定的提交，**保留**工作目录和暂存区的内容。这意味着你的修改还在，只是不再是提交的一部分。
   - **Mixed（混合重置）**：这是默认选项。它会将 `HEAD` 指针移动到选定的提交，**清空**暂存区，但**保留**工作目录的内容。
   - **注意：** 如果你只想撤销提交，并打算修改后重新提交，通常选择 **Soft** 或 **Mixed** 都可以，根据你是否希望文件保留在暂存区。对于“撤回本地仓库提交”这个需求，通常是希望保留修改以便重新操作。

   ![image-20250801140733960](https://rustfs.wenyongdalucky.club:443/hexo/image-20250801140733960.png)

6. **确认：** 点击“确定”或“Reset”按钮。

完成这些步骤后，你会发现最新的那个提交消失了，而你工作目录中的文件依然保留了修改内容，你可以重新暂存并提交。

------



### 2. 彻底撤销最近一次提交（丢弃所有修改）



这类似于 `git reset --hard HEAD~1` 的效果，会完全丢弃最近提交的所有修改。**请务必谨慎使用此选项，因为它会丢失数据！**

1. **打开日志/历史记录：** 同样，在 SourceTree 中打开“日志/历史”选项卡。
2. **定位要撤销的提交：** 找到你想撤销的**前一个**提交。
3. **右键点击并选择：** 右键点击该提交。
4. **选择“将当前分支重置到此提交”：** 在弹出的菜单中选择 **“将当前分支重置到此提交”** (Reset current branch to this commit)。
5. **选择重置模式：** 在弹窗中，选择 **“Hard（硬重置）”**。
6. **确认：** 点击“确定”或“Reset”按钮。SourceTree 还会再次弹出警告，提醒你这将丢失数据，请确认。

执行此操作后，你的仓库状态会完全回溯到选定的提交，所有后续的修改和提交都将消失。

------



- **未推送的提交：** 上述操作主要用于**尚未推送到远程仓库**的本地提交。如果你已经将提交推送到远程，使用 `git reset` 会导致本地和远程历史不一致，从而引发问题。对于已推送的提交，通常应该使用 **“逆转提交”（Revert Commit）**，它会创建一个新的提交来撤销之前的修改，而不是改写历史。
- **Revert（逆转）操作：** 如果你希望逆转某个已推送的提交，可以在 SourceTree 中右键点击该提交，然后选择 **“逆转提交 <哈希值>”** (Revert commit <hash>)。这会创建一个新的提交来撤销该提交的修改，并且不会改变历史，是更安全的选择。
