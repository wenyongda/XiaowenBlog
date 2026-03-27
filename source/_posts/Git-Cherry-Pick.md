---
title: Git Cherry-Pick
date: 2025-12-11 23:02:39
tags:
---

# Git Cherry-Pick 详解文档

## 1. 概述

`git cherry-pick` 是 Git 中一个强大的命令，用于**将一个或多个指定的提交（commits）从一个分支“摘取”并应用到当前分支上**。它不会合并整个分支，而是只复制你指定的提交变更。

> 简单理解：**“只拿我想要的改动，不拿整个分支”**。

## 2. 基本语法

```bash
git cherry-pick <commit-hash>
git cherry-pick <commit1> <commit2> ...
git cherry-pick <start-commit>^..<end-commit>   # 摘取一个范围（含 start 和 end）
```

- `<commit-hash>`：要摘取的提交的完整或简短哈希值
- 可以一次指定多个提交，Git 会按顺序逐个应用
- 提交顺序很重要：默认按你提供的顺序执行（不是按时间顺序）

## 3. 典型使用场景

### ✅ 场景 1：修复补丁快速移植

> 在 `dev` 分支上修复了一个严重 bug，需要紧急同步到 `release` 分支，但 `dev` 上还有其他未测试功能不能合并。

```bash
git checkout release
git cherry-pick a1b2c3d   # 仅应用修复提交s	
```

### ✅ 场景 2：从 feature 分支提取部分功能

> 某个功能分支开发了多个特性，但当前只希望上线其中一部分。

### ✅ 场景 3：从其他远程仓库（如上游）选取特定提交

> 例如你 fork 了一个开源项目，原项目修复了某个问题，你想只拿这个修复。

## 4. 工作流程示例

假设你有两个分支：`main` 和 `feature`

```bash
# 当前在 main 分支
git checkout main

# 查看 feature 分支的提交历史
git log feature --oneline
# 输出：
# abc1234 Add login feature
# def5678 Fix typo
# ghi8901 Update README

# 只想把 "Fix typo" 提交应用到 main
git cherry-pick def5678
```

执行后，`main` 分支会产生一个**新的提交**（哈希不同），但内容与 `def5678` 相同。

> ⚠️ 注意：cherry-pick 会创建**新提交**（new commit with new hash），不是“移动”原提交。

## 5. 常用选项



| 选项                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| `-n` 或 `--no-commit` | 应用变更但**不自动提交**，只暂存改动（便于手动调整后提交）   |
| `-e` 或 `--edit`      | 在提交前打开编辑器，允许修改提交信息                         |
| `-x`                  | 在提交信息末尾自动添加 `(cherry picked from commit ...)`，用于追踪来源（推荐用于公共仓库） |
| `--ff`                | 如果当前分支是目标提交的直接后代，则 fast-forward（极少用）  |
| `--abort`             | 放弃整个 cherry-pick 操作，回到操作前状态                    |
| `--continue`          | 解决冲突后继续执行剩余的 cherry-pick                         |

## 6. 冲突处理

如果 cherry-pick 的变更与当前分支有冲突：

1. Git 会暂停操作，并提示冲突文件

2. 手动解决冲突（像 merge 一样）

3. 使用 `git add <file>` 标记冲突已解决

4. 执行：

   ```bash
   git cherry-pick --continue
   ```

5. 如果想放弃：

   ```bash
   git cherry-pick --abort
   ```

## 7. 注意事项与最佳实践

### ⚠️ 不要滥用 cherry-pick

- 频繁 cherry-pick 会导致提交历史混乱、重复提交
- 优先考虑 `git merge` 或 `git rebase` 来保持清晰历史

### ✅ 使用 `-x` 标记来源

```bash
git cherry-pick -x abc1234
```

生成的提交信息会包含来源，便于追溯。

### ✅ 范围摘取时注意顺序

```bash
# 正确：从旧到新
git cherry-pick A^..C   # 包含 A, B, C（按时间顺序）

# 错误：顺序颠倒可能导致冲突
git cherry-pick C B A
```

### ✅ 摘取前先 fetch

如果从远程分支摘取，务必先：

```bash
git fetch origin
# 或
git fetch your-remote-name
```

### ✅ 避免在公共分支上 cherry-pick 后 force push

这会导致协作混乱。

## 8. 与类似命令对比



| 命令              | 作用           | 是否创建新提交               | 是否保留历史         |
| ----------------- | -------------- | ---------------------------- | -------------------- |
| `git cherry-pick` | 摘取指定提交   | ✅ 是                         | ❌ 不保留原分支上下文 |
| `git merge`       | 合并整个分支   | ✅（通常是一个 merge commit） | ✅ 保留完整历史       |
| `git rebase`      | 变基，重放提交 | ✅（新提交）                  | ✅ 但线性化历史       |

## 9. 实用技巧

### 摘取多个连续提交

```bash
# 摘取从 A 到 C 的所有提交（包含 A 和 C）
git cherry-pick A^..C
```

### 仅应用改动，稍后提交

```bash
git cherry-pick -n abc1234
# 修改文件或拆分提交
git add .
git commit -m "Custom message"
```

### 查看哪些提交尚未被 cherry-pick（用于同步）

```bash
git log origin/main..feature --oneline
# 列出 feature 有但 main 没有的提交
```

## 10. 总结

`git cherry-pick` 是一个**精准、灵活但需谨慎使用**的工具，适用于：

- 紧急修复移植
- 选择性功能集成
- 跨仓库补丁同步

> 📌 **原则：用完即走，不作为日常集成手段。**
