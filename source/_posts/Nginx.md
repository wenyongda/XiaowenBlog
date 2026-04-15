---
title: Nginx
date: 2023-09-25 15:42:47
tags: [Nginx, 反向代理, Web服务器, 负载均衡]
categories: [运维, Web服务器]
---

## Nginx 隐藏版本号

nginx配置文件`nginx.conf`里增加 server_tokens off;

server_tokens作用域是http server location语句块
server_tokens默认值是on，表示显示版本信息，设置server_tokens值是off，就可以在所有地方隐藏nginx的版本信息。

```conf
http{
      server_tokens off;
}
```

修改`fastcgi_params`和`fastcgi.conf`文件

将两个文件中的

```conf
fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;
```

修改为

```conf
fastcgi_param  SERVER_SOFTWARE    nginx;
```

重启Nginx服务

## 配置

```conf
# Nginx 会以默认的 nobody 用户身份运行，通常用于提高安全性。
#user  nobody;
# 指定 Nginx 启动的工作进程数，这里设置为 1，表示只有一个工作进程。通常情况下，可以设置成 CPU 核心数的倍数，以充分利用多核处理器。
worker_processes  1;

# 错误日志文件的配置
#error_log  logs/error.log;
# 配置了错误日志文件的路径为 logs/error.log，并设置日志级别为 notice
#error_log  logs/error.log  notice;
# 配置了错误日志文件的路径为 logs/error.log，并设置日志级别为 info
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

# 事件模块的配置块，用于配置 Nginx 处理事件的参数。在此处，配置了每个工作进程能够处理的最大连接数为 1024
events {
    worker_connections  1024;
}


http {
	# 包含了 mime.types 文件，该文件定义了 MIME 类型与文件扩展名的映射关系，用于处理 HTTP 响应的内容类型
    include       mime.types;
	# 设置默认的 MIME 类型为 application/octet-stream，用于响应未知类型的文件。
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;
	# 开启了 sendfile 功能，用于高效地传输文件。
    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    # 配置了客户端与服务器之间的 keep-alive 连接的超时时间为 65 秒，这意味着客户端和服务器之间的连接在空闲 65 秒后会被关闭。
    keepalive_timeout  65;
	# 禁用了 Nginx 在 HTTP 响应头中发送服务器版本信息，以增强安全性。
    server_tokens off;
    
    # 开启gzip
    gzip  on;
    # 禁用IE 6 gzip
    gzip_buffers 32 4k;
    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，后面会有详细说明
    gzip_comp_level 6;
    # 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
    gzip_min_length 1k;
    # 进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
    gzip_types application/javascript text/css text/xml;
    # 禁用IE 6 gzip
    gzip_disable "MSIE [1-6]\."; #配置禁用gzip条件，支持正则。此处表示ie6及以下不启用gzip（因为ie低版本不支持）
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    
    # map $http_upgrade $connection_upgrade {
    	# 如果$http_upgrade的值与default不匹配（通常是指$http_upgrade未设置或未匹配任何其他条件），则将$connection_upgrade设置为upgrade。
    #     default upgrade;
    	# 如果$http_upgrade的值为空字符串（''），则将$connection_upgrade设置为close。这意味着Nginx将关闭连接而不是升级。
    #     ''      close;
    # }

    map $http_connection $connection_upgrade {
    	# 如果$http_connection的值匹配正则表达式~*Upgrade（不区分大小写地匹配包含"Upgrade"的值），则将$connection_upgrade设置为$http_connection的值，通常是upgrade。
        "~*Upgrade" $http_connection;
        # 如果没有匹配的值，将$connection_upgrade设置为keep-alive。这意味着Nginx将保持HTTP连接保持活动状态以进行进一步的请求和响应。
        default keep-alive;
    }
    server {
        listen       7779;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        #location / {
        #    root   html;
        #    index  index.html index.htm;
        #}

        root   html/dist;
        index  index.html index.htm;

        # 根请求会指向的页面
        location / {
            # 此处的 @router 实际上是引用下面的转发，否则在 Vue 路由刷新时可能会抛出 404
            try_files $uri $uri/ @router;
            # 请求指向的首页
            index index.html;
        }

        location @router {
            rewrite ^.*$ /index.html last;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        #error_page   500 502 503 504  /50x.html;
        #location = /50x.html {
        #    root   html;
        #}

        location /prod-api {
        	# 设置反向代理请求头中的 Host 头字段为客户端请求的 Host 头字段。这样可以将客户端的 Host 头信息传递给后端服务器，以确保后端服务器正确处理请求。
            proxy_set_header Host $http_host;
            # 设置反向代理请求头中的 X-Real-IP 头字段为客户端的真实 IP 地址。这是为了让后端服务器知道请求的真实来源 IP。
            proxy_set_header X-Real-IP $remote_addr;
            # 
            #proxy_set_header REMOTE-HOST $remote_addr;
            # 设置反向代理请求头中的 X-Forwarded-For 头字段，用于记录客户端的 IP 地址以及之前的代理服务器的 IP 地址。这有助于后端服务器了解请求的来源路径。
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # 设置反向代理请求头中的 Cookie 头字段，用于传递客户端请求的 Cookie 信息给后端服务器。
            proxy_set_header   Cookie $http_cookie;
            # 配置反向代理的目标地址，将请求代理到 http://127.0.0.1:50，这是后端服务器的地址。Nginx 会将请求转发到该地址。
            proxy_pass http://127.0.0.1:50;
            # 禁用了 Nginx 对代理响应中的 Location 头字段的重定向处理。通常用于防止 Nginx 修改后端服务器返回的重定向 URL。
            proxy_redirect off;

			# 设置反向代理请求头中的 HTTP-X-REQUESTED-WITH 头字段为客户端请求的 HTTP_X_REQUESTED_WITH 头字段值。这可以用于传递一些客户端信息给后端服务器。
            proxy_set_header HTTP_X_REQUESTED_WITH $http_x_requested_with;
            # 
            proxy_set_header x-requested-with $http_x_requested_with;
            # 设置客户端请求的最大请求体大小为 10MB。如果请求体大小超过此限制，Nginx将拒绝接收请求。
            client_max_body_size 10m;
            # 设置用于保存客户端请求体的缓冲区大小为128KB。这是用于暂存请求体数据的内存大小。
            client_body_buffer_size 128k;
            # 设置与后端服务器建立连接的超时时间为90秒。如果在这个时间内无法建立连接，Nginx将返回错误。
            proxy_connect_timeout 90;
			# 设置向后端服务器发送请求的超时时间为90秒。如果在这个时间内无法完成请求的发送，Nginx将返回错误。
            proxy_send_timeout 90;
            # 设置从后端服务器接收响应的超时时间为90秒。如果在这个时间内没有接收到完整的响应，Nginx将返回错误。
            proxy_read_timeout 90;
            # 设置用于保存代理响应的缓冲区大小为128KB。这是用于暂存代理响应数据的内存大小。
            proxy_buffer_size 128k;
            # 配置代理响应缓冲区的数量和每个缓冲区的大小。这里设置了32个缓冲区，每个大小为32KB。
            proxy_buffers 32 32k;
			# 设置代理缓冲区的繁忙大小为128KB。这是代理缓冲区的一种高水位标记，当达到这个水位时，Nginx将开始向客户端发送响应。
            proxy_busy_buffers_size 128k;
            # 设置代理缓冲区的繁忙大小为128KB。这是代理缓冲区的一种高水位标记，当达到这个水位时，Nginx将开始向客户端发送响应。
            proxy_temp_file_write_size 128k;
            # 使用正则表达式将请求路径重写，将 /prod-api/ 前缀去除。这可以用于修改请求路径以匹配后端服务器的期望路径
            rewrite ^/prod-api/(.*) /$1 break;
        }

        location /msghub {
            proxy_pass http://127.0.0.1:50/msgHub;

            # 配置 Upgrade 头字段，用于支持 WebSocket 协议升级。当客户端请求 WebSocket 协议时，Nginx 会传递 Upgrade 头字段给后端服务器以升级连接协议。
            proxy_set_header Upgrade $http_upgrade;
            # 配置 Connection 头字段，用于支持 WebSocket 连接的升级。当客户端请求 WebSocket 协议时，Nginx 会传递 Connection 头字段给后端服务器以升级连接协议。
            proxy_set_header Connection $connection_upgrade;
            # 禁用了代理缓存，这意味着 Nginx 不会缓存代理响应，适用于实时通信场景，如 WebSocket。
            proxy_cache off;
            # 配置了 HTTP 协议版本为 1.1，这是为了支持 WebSocket，因为 WebSocket 是在 HTTP/1.1 之后的协议中实现的。
            proxy_http_version 1.1;

			# 禁用了代理的缓冲功能，这适用于实时通信场景，如 WebSocket 或 Server-Sent Events（SSE），以确保数据立即传递给客户端而不进行缓冲。
            proxy_buffering off;

            # 配置了代理的读取超时时间为 100 秒，这允许长轮询或者当 Keep-Alive 间隔大于 60 秒时的请求保持连接。
            proxy_read_timeout 100s;
			
		# 设置反向代理请求头中的 Host 头字段为客户端请求的 Host 头字段。这样可以将客户端的 Host 头信息传递给后端服务器，确保后端服务器正确处理请求。
            proxy_set_header Host $host;
            # 设置反向代理请求头中的 X-Forwarded-For 头字段，用于记录客户端的 IP 地址以及之前的代理服务器的 IP 地址。这有助于后端服务器了解请求的来源路径。
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # 设置反向代理请求头中的 X-Forwarded-Proto 头字段为客户端请求的协议（HTTP 或 HTTPS）信息，以告知后端服务器请求的协议。
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }

    server {
        listen       8087;
        server_name  localhost;

        root   html/dist1;
        index  index.html index.htm;

        # 根请求会指向的页面
        location / {
            # 此处的 @router 实际上是引用下面的转发，否则在 Vue 路由刷新时可能会抛出 404
            try_files $uri $uri/ @router;
            # 请求指向的首页
            index index.html;
        }

        location @router {
            rewrite ^.*$ /index.html last;
        }

        location /prod-api {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            #proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   Cookie $http_cookie;
            proxy_pass http://127.0.0.1:8888;
            proxy_redirect off;

            proxy_set_header HTTP-X-REQUESTED-WITH $http_x_requested_with;
            proxy_set_header HTTP_X_REQUESTED_WITH $http_x_requested_with;
            proxy_set_header x-requested-with $http_x_requested_with;
            client_max_body_size 10m;
            client_body_buffer_size 128k;
            proxy_connect_timeout 90;
            proxy_send_timeout 90;
            proxy_read_timeout 90;
            proxy_buffer_size 128k;
            proxy_buffers 32 32k;
            proxy_busy_buffers_size 128k;
            proxy_temp_file_write_size 128k;
            rewrite ^/prod-api/(.*) /$1 break;
        }

        location /msghub {
            proxy_pass http://127.0.0.1:8888/msgHub;

            # Configuration for WebSockets
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_cache off;
            # WebSockets were implemented after http/1.0
            proxy_http_version 1.1;

            # Configuration for ServerSentEvents
            proxy_buffering off;

            # Configuration for LongPolling or if your KeepAliveInterval is longer than 60 seconds
            proxy_read_timeout 100s;

            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

    }
    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}

```



`nginx.conf` 文件是 Nginx 的主要配置文件，它包含了 Nginx 服务器的全局配置以及虚拟主机配置等信息。下面是你提供的 `nginx.conf` 文件的每一行的解释：

```nginx
#user  nobody;
```
此行注释掉了 `user` 配置项，这意味着 Nginx 会以默认的 `nobody` 用户身份运行，通常用于提高安全性。

```nginx
worker_processes  1;
```
指定 Nginx 启动的工作进程数，这里设置为 1，表示只有一个工作进程。通常情况下，可以设置成 CPU 核心数的倍数，以充分利用多核处理器。

```nginx
#error_log  logs/error.log;
```
此行注释掉了错误日志文件的配置，意味着不会生成错误日志文件。

```nginx
#error_log  logs/error.log  notice;
```
此行配置了错误日志文件的路径为 `logs/error.log`，并设置日志级别为 `notice`，这意味着只记录 `notice` 级别及以上的错误信息。

```nginx
#error_log  logs/error.log  info;
```
此行配置了错误日志文件的路径为 `logs/error.log`，并设置日志级别为 `info`，这意味着记录 `info` 级别及以上的错误信息。

```nginx
events {
    worker_connections  1024;
}
```
定义了事件模块的配置块，用于配置 Nginx 处理事件的参数。在此处，配置了每个工作进程能够处理的最大连接数为 1024。

```nginx
http {
```
定义了 HTTP 模块的配置块，包含了所有 HTTP 相关的配置信息。

```nginx
    include       mime.types;
```
包含了 `mime.types` 文件，该文件定义了 MIME 类型与文件扩展名的映射关系，用于处理 HTTP 响应的内容类型。

```nginx
    default_type  application/octet-stream;
```
设置默认的 MIME 类型为 `application/octet-stream`，用于响应未知类型的文件。

```nginx
    sendfile        on;
```
开启了 sendfile 功能，用于高效地传输文件。

```nginx
    keepalive_timeout  65;
```
配置了客户端与服务器之间的 keep-alive 连接的超时时间为 65 秒，这意味着客户端和服务器之间的连接在空闲 65 秒后会被关闭。

```nginx
    server_tokens off;
```
禁用了 Nginx 在 HTTP 响应头中发送服务器版本信息，以增强安全性。

```nginx
    gzip  on;
```
启用了 Gzip 压缩，用于压缩响应内容以减小传输大小。

这个文件还包含了两个 `server` 配置块，分别监听了不同的端口（7779和8087），配置了反向代理和静态文件服务等内容。这两个 `server` 配置块用于定义不同的虚拟主机。其中的 `location` 块用于配置不同路径的请求处理方式，包括静态文件服务和反向代理配置。

需要注意的是，该配置文件中有一些注释掉的配置项，这些配置项可以根据具体需求进行启用或自定义。另外，还有一些配置项涉及到反向代理和代理 WebSocket 等高级功能，需要根据实际需求进行进一步了解和配置。

# 配置 Nginx 为 Windows服务

## 下载 winsw

需要借助`Windows Service Wrapper`小工具，下载地址：

http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/1.18/winsw-1.18-bin.exe

下载后放在nginx目录下，并修改名字为`nginx-service.exe`

创建配置文件 `nginx-service.exe.xml` 和 `nginx-service.xml`
`nginx-service.xml`的内容如下：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<service>
    <id>Nginx</id>
    <name>NginxService</name>
    <description>High Performance Nginx Service</description>
    <logpath>D:\app\nginx-1.25.2\logs</logpath>
    <log mode="roll-by-size">
        <sizeThreshold>10240</sizeThreshold>
        <keepFiles>8</keepFiles>
    </log>
    <executable>D:\app\nginx-1.25.2\nginx.exe</executable>
    <startarguments>-p D:\app\nginx-1.25.2</startarguments>
    <stopexecutable>D:\app\nginx-1.25.2\nginx.exe</stopexecutable>
    <stoparguments>-p D:\app\nginx-1.25.2 -s stop</stoparguments>
</service>
```

`nginx-service.exe.xml`内容如下：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <startup>
        <supportedRuntime version="v2.0.50727" />
        <supportedRuntime version="v4.0" />
    </startup>
    <runtime>
        <generatePublisherEvidence enabled="false" />
    </runtime>
</configuration>
```

## 安装服务

使用管理员身份运行`PowerShell`，进入`nginx`安装目录，执行以下命令

```powershell
.\nginx-service.exe install
```

## 启动服务

```powershell
net start Nginx
```

## 停止服务

```powershell
net stop Nginx
```

# 命令

## 重新加载配置文件

```shell
nginx -s reload
```

