---
title: curl 命令完全指南
date: 2026-03-27 10:10:35
tags: [curl, Linux, Windows, API测试, HTTP]
categories: [开发工具, 命令行]
---

## 简介

curl (Client for URLs) 是一个强大的命令行工具，用于传输数据。它支持多种协议（HTTP、HTTPS、FTP等），是开发者和运维人员必备的工具之一。

## 安装

### Linux

大多数 Linux 发行版已预装 curl：

```bash
# Debian/Ubuntu
sudo apt install curl

# CentOS/RHEL
sudo yum install curl

# Arch Linux
sudo pacman -S curl

# 验证安装
curl --version
```

### Windows

**方式一：Windows 10/11 自带**
Windows 10 1803+ 和 Windows 11 已内置 curl。

**方式二：手动安装**
1. 访问 https://curl.se/windows/ 下载
2. 解压到 `C:\tools\curl`
3. 添加到系统 PATH 环境变量

**方式三：使用包管理器**
```powershell
# winget
winget install curl

# Chocolatey
choco install curl

# Scoop
scoop install curl
```

## 基础用法

### GET 请求

```bash
# 基本 GET 请求
curl https://api.example.com/users

# 带查询参数
curl "https://api.example.com/users?page=1&limit=10"

# 只显示响应头
curl -I https://api.example.com

# 显示响应头和响应体
curl -i https://api.example.com

# 跟随重定向
curl -L https://example.com/redirect
```

### POST 请求

```bash
# 发送 JSON 数据（请求体）
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "张三", "email": "zhangsan@example.com"}'

# 发送表单数据
curl -X POST https://api.example.com/login \
  -d "username=admin&password=123456"

# 发送文件
curl -X POST https://api.example.com/upload \
  -F "file=@/path/to/file.jpg"

# 发送多部分表单（文件+字段）
curl -X POST https://api.example.com/upload \
  -F "file=@/path/to/file.jpg" \
  -F "name=张三" \
  -F "description=用户头像"
```

### PUT / PATCH / DELETE 请求

```bash
# PUT 请求（完整更新）
curl -X PUT https://api.example.com/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "李四", "email": "lisi@example.com"}'

# PATCH 请求（部分更新）
curl -X PATCH https://api.example.com/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "李四"}'

# DELETE 请求
curl -X DELETE https://api.example.com/users/1
```

## 常用选项详解

| 选项 | 说明 | 示例 |
|------|------|------|
| `-X` | 指定请求方法 | `-X POST` |
| `-H` | 添加请求头 | `-H "Authorization: Bearer token"` |
| `-d` | 发送数据 | `-d '{"key":"value"}'` |
| `-F` | 上传文件/表单 | `-F "file=@photo.jpg"` |
| `-u` | 基础认证 | `-u user:pass` |
| `-I` | 只获取响应头 | `curl -I url` |
| `-i` | 显示响应头和内容 | `curl -i url` |
| `-L` | 跟随重定向 | `curl -L url` |
| `-o` | 保存到文件 | `-o output.json` |
| `-O` | 使用远程文件名保存 | `-O` |
| `-s` | 静默模式 | `-s` |
| `-v` | 显示详细信息 | `-v` |
| `-k` | 忽略 SSL 证书验证 | `-k` |
| `-x` | 使用代理 | `-x http://proxy:8080` |
| `--connect-timeout` | 连接超时（秒） | `--connect-timeout 10` |
| `-m` | 最大请求时间（秒） | `-m 30` |

## 替代 Postman 的完整方案

### 1. 认证请求

```bash
# Bearer Token 认证
curl -H "Authorization: Bearer your_token_here" \
  https://api.example.com/data

# Basic Auth 认证
curl -u "username:password" \
  https://api.example.com/data

# API Key 认证（Header 方式）
curl -H "X-API-Key: your_api_key" \
  https://api.example.com/data

# API Key 认证（Query 参数方式）
curl "https://api.example.com/data?api_key=your_api_key"
```

### 2. 处理 Cookie

```bash
# 保存 Cookie 到文件
curl -c cookies.txt https://api.example.com/login \
  -d "username=admin&password=123456"

# 使用已保存的 Cookie
curl -b cookies.txt https://api.example.com/profile

# 同时读写 Cookie
curl -b cookies.txt -c cookies.txt https://api.example.com/action

# 直接设置 Cookie
curl -H "Cookie: session=abc123; token=xyz789" \
  https://api.example.com/data
```

### 3. 美化 JSON 输出

```bash
# 使用 jq 美化（Linux/macOS）
curl -s https://api.example.com/users | jq

# 使用 Python 美化（跨平台）
curl -s https://api.example.com/users | python -m json.tool

# Windows PowerShell 方式
curl -s https://api.example.com/users | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### 4. 保存请求集合

创建一个 `api-requests.sh` 文件：

```bash
#!/bin/bash
# API 请求集合 - 类似 Postman Collection

BASE_URL="https://api.example.com"
TOKEN="your_token_here"

# 获取用户列表
get_users() {
    curl -s "$BASE_URL/users" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json"
}

# 创建用户
create_user() {
    curl -s -X POST "$BASE_URL/users" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"name": "张三", "email": "zhangsan@example.com"}'
}

# 获取单个用户
get_user() {
    local id=$1
    curl -s "$BASE_URL/users/$id" \
        -H "Authorization: Bearer $TOKEN"
}

# 调用示例
case "$1" in
    users) get_users | jq ;;
    create) create_user | jq ;;
    user) get_user "$2" | jq ;;
    *) echo "用法: $0 {users|create|user <id>}" ;;
esac
```

使用方式：
```bash
chmod +x api-requests.sh
./api-requests.sh users
./api-requests.sh create
./api-requests.sh user 1
```

### 5. 环境变量配置

```bash
# 创建 .env 文件（添加到 .gitignore）
# .env
API_BASE_URL=https://api.example.com
API_TOKEN=your_token_here

# 在脚本中使用
source .env

curl -H "Authorization: Bearer $API_TOKEN" \
  "$API_BASE_URL/users"
```

### 6. 环境切换

创建多环境配置：

```bash
# environments.sh
get_env() {
    case "$1" in
        dev)
            BASE_URL="https://dev-api.example.com"
            TOKEN="$DEV_TOKEN"
            ;;
        staging)
            BASE_URL="https://staging-api.example.com"
            TOKEN="$STAGING_TOKEN"
            ;;
        prod)
            BASE_URL="https://api.example.com"
            TOKEN="$PROD_TOKEN"
            ;;
        *)
            echo "未知环境: $1"
            exit 1
            ;;
    esac
}

# 使用
source environments.sh
get_env dev
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/users"
```

### 7. 测试脚本示例

```bash
#!/bin/bash
# API 测试脚本

BASE_URL="https://api.example.com"
TOKEN="test_token"

echo "=== 测试用户 API ==="

# 测试获取用户
echo "1. GET /users"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/users" \
    -H "Authorization: Bearer $TOKEN")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" -eq 200 ]; then
    echo "✅ 成功 (HTTP $http_code)"
    echo "$body" | jq
else
    echo "❌ 失败 (HTTP $http_code)"
    echo "$body"
fi

# 测试创建用户
echo -e "\n2. POST /users"
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name": "测试用户"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" -eq 201 ]; then
    echo "✅ 成功 (HTTP $http_code)"
else
    echo "❌ 失败 (HTTP $http_code)"
fi
```

## Windows 特殊处理

### PowerShell 中的引号问题

PowerShell 对单引号和双引号有特殊处理，推荐以下方式：

```powershell
# 方式一：使用双引号，内部双引号用反引号转义
curl -X POST https://api.example.com/users `
    -H "Content-Type: application/json" `
    -d "{`"name`": `"张三`"}"

# 方式二：使用单引号包裹 JSON（推荐）
curl -X POST https://api.example.com/users `
    -H "Content-Type: application/json" `
    -d '{"name": "张三"}'

# 方式三：从文件读取数据
curl -X POST https://api.example.com/users `
    -H "Content-Type: application/json" `
    -d "@request.json"
```

### Windows CMD 中的处理

```cmd
# 使用双引号，内部双引号用反斜杠转义
curl -X POST https://api.example.com/users ^
    -H "Content-Type: application/json" ^
    -d "{\"name\": \"张三\"}"

# 或使用文件
curl -X POST https://api.example.com/users ^
    -H "Content-Type: application/json" ^
    -d "@request.json"
```

### 创建 request.json 文件

对于复杂的请求体，推荐使用文件：

```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "roles": ["admin", "user"],
  "settings": {
    "theme": "dark",
    "language": "zh-CN"
  }
}
```

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @request.json
```

## 实用技巧

### 1. 测量请求时间

```bash
curl -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" \
  -o /dev/null -s https://api.example.com
```

### 2. 下载文件并显示进度

```bash
curl -O --progress-bar https://example.com/large-file.zip
```

### 3. 断点续传

```bash
curl -C - -O https://example.com/large-file.zip
```

### 4. 限速下载

```bash
# 限制为 1MB/s
curl --limit-rate 1M -O https://example.com/file.zip
```

### 5. 批量下载

```bash
# 下载多个文件
curl -O https://example.com/file1.zip -O https://example.com/file2.zip

# 使用序列
curl -O https://example.com/file[1-10].jpg

# 使用字母序列
curl -O https://example.com/file[a-z].jpg
```

### 6. 调试请求

```bash
# 显示完整请求/响应信息
curl -v https://api.example.com

# 输出详细信息到文件
curl --trace-ascii debug.txt https://api.example.com
```

## curl vs Postman 对比

| 功能 | curl | Postman |
|------|------|---------|
| 安装 | 系统内置/轻量 | 需下载安装 |
| 脚本化 | ✅ 原生支持 | ❌ 需导出 |
| 自动化 | ✅ 易于集成 CI/CD | 需 Newman |
| 资源占用 | 极低 | 较高 |
| 可视化 | ❌ 无 | ✅ 有 |
| 学习曲线 | 较陡 | 平缓 |
| 环境管理 | 手动配置 | 图形界面 |
| 团队协作 | Git + 脚本 | 云同步 |
| 价格 | 免费 | 免费版有限制 |

## 快速参考

```bash
# 最常用的命令模板
curl -X [METHOD] [URL] \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[JSON_DATA]' | jq

# 常用组合
curl -s -X POST $URL -H $HEADERS -d $DATA | jq  # 静默 POST，美化输出
curl -I $URL                                      # 检查响应头
curl -L -I $URL                                   # 跟随重定向并显示头
curl -v $URL                                      # 调试模式
curl -u user:pass $URL                            # Basic Auth
```

## 总结

curl 是一个功能强大的 HTTP 客户端工具，通过脚本化和命令行参数可以完全替代 Postman 进行 API 测试。虽然缺少可视化界面，但其轻量、可自动化、易于集成的特点使其成为开发者和 DevOps 的首选工具。

掌握 curl 能让你在没有图形界面的服务器环境中也能灵活地进行 API 调试和测试，是每个开发者必备的技能。