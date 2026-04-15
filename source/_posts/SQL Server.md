---
title: SQL Server
date: 2022-11-26 14:48:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/B951AE18-D431-417F-B3FE-A382403FF21B.jpeg
tags: [SQL Server, 数据库, Microsoft, SQL]
categories: [数据库, SQL Server]
---

# SQL Server

## 建库字符集问题

```sql
ALTER DATABASE ACT_DEV SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

ALTER DATABASE ACT_DEV  COLLATE Chinese_PRC_CI_AS;

ALTER DATABASE ACT_DEV SET MULTI_USER;
```

## 精度标度

精度指数字的位数，标度指小数点后的位数。例如，123.45，精度是5，标度是2，decimal(5, 2)

