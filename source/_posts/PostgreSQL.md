---
title: PostgreSQL
date: 2024-03-22 09:19:21
tags:
---

# 配置

## 开启归档日志

```conf
wal_level = archive	

archive_mode = on

archive_command = 'copy "%p" "E:\\PostgreSQLArchive\\%f"'
```

# 工具

## pg_controldata

```cmd
"C:\Program Files\PostgreSQL\9.3\bin\pg_controldata" "D:\Program Files\PostgreSQL\9.3\data"

pg_control 版本:                      937
Catalog 版本:                         201306121
数据库系统标识符:                     7348237991996702661
数据库簇状态:                         在运行中
pg_control 最后修改:                  2024/3/22 8:52:05
最新检查点位置:                       1/47003918
优先检查点位置:                       1/47000028
最新检查点的 REDO 位置:               1/47003918
最新检查点的重做日志文件: 000000010000000100000047
最新检查点的 TimeLineID:              1
最新检查点的PrevTimeLineID: 1
最新检查点的full_page_writes: 开启
最新检查点的 NextXID:            0/187323
最新检查点的 NextOID:                 24781
最新检查点的NextMultiXactId: 1
最新检查点的NextMultiOffsetD: 0
最新检查点的oldestXID:            666
最新检查点的oldestXID所在的数据库：1
最新检查点检查oldestActiveXID:  0
最新检查点检查oldestMultiXid:  1
最新检查点的oldestMulti所在的数据库：1
最新检查点的时间:                     2024/3/22 8:52:05
不带日志的关系: 0/1使用虚假的LSN计数器
最小恢复结束位置: 0/0
最小恢复结束位置时间表: 0
开始进行备份的点位置:                       0/0
备份的最终位置:                  0/0
需要终止备份的记录:        否
参数wal_level的当前设置:         archive
参数max_connections的当前设置：   100
参数 max_prepared_xacts的当前设置：   0
参数max_locks_per_xact setting的当前设置：   64
最大数据校准:     8
数据库块大小:                         8192
大关系的每段块数:                     131072
WAL的块大小:    8192
每一个 WAL 段字节数:                  16777216
标识符的最大长度:                     64
在索引中可允许使用最大的列数:    32
TOAST区块的最大长度:                1996
日期/时间 类型存储:                   64位整数
正在传递Flloat4类型的参数:           由值
正在传递Flloat8类型的参数:                   由引用
数据页校验和版本:  0
```

## pg_archivecleanup

根据`pg_controldata`获取到的**最新检查点的重做日志文件**,可以将其之前的日志进行清空

```cmd
"C:\Program Files\PostgreSQL\9.3\bin\pg_archivecleanup" -d "E:\PostgreSQLArchive" 000000010000000100000047
```

# TimescaleDB

