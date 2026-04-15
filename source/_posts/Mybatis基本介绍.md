---
title: Mybatis基本介绍
date: 2022-11-18 10:30:31
author: 文永达
tags: [Mybatis, ORM, Java, 数据库]
categories: [后端开发, Java]
---

# Mybatis



## Maven引入Mybatis

版本号最好去Maven Repository中查找

```xml
<properties>
    <mybatis.version>3.5.7</mybatis.version>
</properties>
<dependencies>
	<dependency>
    	<groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>${mybatis.version}</version>
    </dependency>
</dependencies>
```

## Mybatis配置文件  *mybatis-config.xml*

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <typeAliases>
        <!--<typeAlias type="com.crx.entity.User" alias="user"></typeAlias>-->
        <!-- 默认值就是类型首字母小写 -->
        <package name="com.wyd.mybatis20210702.entity"/>
    </typeAliases>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"></transactionManager>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/ssm?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf8"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 注册mapper映射文件 -->
    <mappers>
        <mapper resource="mapper/UserMapper.xml"></mapper>
        <!-- 注册接口 -->
        <!--<mapper class="com.wyd.dao.UserMapper2"></mapper>-->
    </mappers>

</configuration>
```
## Springboot中 *application.yml*

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ssm?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: 123456

mybatis:
  type-aliases-package: com.wyd.mybatis20210702.entity
  mapper-locations: classpath*:/mapper/*.xml
```


## Mybatis interface  *UserMapper*

```java
package com.wyd.mybatis20210702.dao;

import com.wyd.mybatis20210702.entity.User;

public interface UserMapper {
    User selectUserById(Integer id);

    int insertUser(User user);

    int updateUser(User user);

    int deleteUser(Integer id);
}

```

每个Mapper接口都有对应的xml映射文件，如果idea安装有MybatisX插件可以单击类名 ALT+ENTER 快捷键即可创建对应xml映射文件

映射文件夹一般命名为mapper 存放于resources文件夹下

在Mapper接口每声明一个方法可以通过MybatisX创建对应的映射，但命名需遵循一定规范，否则需自己选择crud

## Mybatis xml映射文件 ***UserMapper.xml***

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.wyd.mybatis20210702.dao.UserMapper">
    <select id="selectUserById" resultType="user">
        SELECT id,username,PASSWORD,birthday FROM USER
    </select>

    <insert id="insertUser" parameterType="com.crx.entity.User">
        insert into user (username,password) values (#{username},#{password})
    </insert>

    <update id="updateUser" parameterType="com.crx.entity.User">
        update user set username = #{username},password = #{password},birthday = #{birthday} where id = #{id}
    </update>

    <delete id="deleteUser">
        delete from user where id = #{id}
    </delete>
</mapper>
```

可以发现xml映射文件头跟mybatis-config.xml配置文件头很像

就有一个单词不同

一个是config  一个是mapper，这决定了这个xml文件可以写什么语句

每个参数都接#{}，{}里就写接口中的参数名

重点来了

###  #{}和${}的区别

学过jdbc知道有Statement和PreparedStatement

一个是固定好的sql语句，一个是预处理语句

PreparedStatement #{}就很像 ? 后面接参数名，这就很好地防止了 Sql Injection 也就是sql'注入

我这些sql语句都没有写${}就是因为防止sql注入，开发时严谨使用

1、Statement和PreparedStatement区别是一样
2、#代表使用的底层是PreparedStatement。占位符的写法，预加载
3、$代表使用的底层是Statement。字符串的拼接的写法。SQL注入

那么什么时候使用${}呢？最多的是模糊查询，但是也不推荐这样用

```xml
<select id="selectAllUsersByUsername" parameterType="string" resultType="com.crx.entity.User">
        select id,username,password,birthday from user where username like '%${username}%'
</select>
```

为了拼接上参数就必须使用${}来固化sql

应该在Java代码上来实现模糊查询

```java
String username = ;
if(username != null && !"".equals(username.trim())){
            username = "%" + username + "%";
        }else{
            username = "%%";
}
```

这样就可以避免sql注入

---

resultType 就是 返回的数据类型，有点儿Java方法中的return 不过这是返回的类型而不是变量名

parameterType 就是参数类型，实体类要写包名类名

而Java基本数据类型，比如int就直接写int就行了，引用数据类型比如Integer，String 要把首字目小写，integer，string，这是因为用到了别名，也可以像实体类一样写java.lang.Integer，java.lang.String

## Mybatis xml映射文件特性

动态sql

应用场景，条件查询

```xml
<select id="selectUsers" resultType="com.crx.entity.User">
        select id,username,password,birthday from user
       <!-- if标签相当于多重if，只要条件全都满足，所有满足的sql代码块都会执行 -->
        <where>
            <if test="id != null">
                and id = #{id}
            </if>
            <if test="username != null">
                and username = #{username}
            </if>
            <if test="password != null">
                and password = #{password}
            </if>
        </where>
    </select>
```

<where>标签可动态拼接条件，如果where后条件字段都为null，则where以及后面语句都不会拼接

<if test="">标签则相当于if判断,test等于约束条件，需要注意的是其中只要写字段名即可

---

```xml
<select id="selectUsers" resultType="com.crx.entity.User">
        select id,username,password,birthday from user
        /*
            when,choose,otherwise相当于if...else if....else if
            otherwise相当于else，
            当满足第一个条件时，不再向下执行判断
        */
        <where>
            <choose>
                <when test="username != null and username != ''">
                    and username = #{username}
                </when>
                <when test="password != null and password != ''">
                    and password = #{password}
                </when>
                <otherwise>
                    and id = #{id}
                </otherwise>
            </choose>
        </where>
    </select>
```

<choose>标签有点像Java中的switch语句，其中的<when>标签则向当于case，但这个case中是带有break的，也就是说每满足一个<when test>条件则此<choose>标签后续语句都不会执行，有一点需要说的是<where>中可以有多个<choose>，满足一个<when test>则会跳出这个<choose>标签，继续执行后续语句，如果<when test>都不满足，如果有<otherwise>标签，则会执行，这有点儿像default语句了

---

```xml
<select id="selectUsers" resultType="com.crx.entity.User">
        select id,username,password,birthday from user
       /*
            有时候我们需要去掉一些特殊的SQL语法，比如说and，or，where，
            此时可以使用trim标签，
        */
        <!--<trim prefix="where" prefixOverrides="and">
            <if test="username != null and username != '' ">
                username = #{username}
            </if>
            <if test="password != null and password != ''">
                and password = #{password}
            </if>
        </trim>-->
    </select>
```

这个例子中，<trim>标签中的**prefix**属性会使*where* 元素会动态地在行首插入 where关键字，**prefixOverrides**属性会删掉额外的and（这些and是在使用条件语句给列赋值时引入的）

如果<if test>都不满足则不会插入where关键字

---

Update同样适用动态sql

```xml
<update id="updateUser" parameterType="com.crx.entity.User">
        update user
        <set>
            <if test="username != null and username != '' ">
                username = #{username}
            </if>
            <if test="password != null and password != ''">
                ,password = #{password}
            </if>
            where id = #{id}
      </set>
</update>
```

这个例子中，*set* 元素会动态地在行首插入 SET 关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）。

也相当于上面<trim>标签

```xml
<trim prefix="SET" suffixOverrides=",">
  <if test="username != null and username != '' ">
         username = #{username}
      </if>
      <if test="password != null and password != ''">
         ,password = #{password}
      </if>
      where id = #{id}
</trim>
```

动态 SQL 的另一个常见使用场景是对集合进行遍历


Mapper接口

```java
List<User> selectUserByIds(@Param("ids") List<Integer> ids);
```

这里需要注意的是@Param注解必须加上，Mybatis内部解析参数时，会把接口中的方法形参列表当作一个Map
当参数不是一个时，key是arg0,arg1,...或param1,param2,...
```xml
<select id="selectUserByIds" resultType="com.crx.entity.User">
        <include refid="selectUser"></include>
        where id in
        <foreach collection="ids" open="(" close=")" separator="," item="id">
            #{id}
        </foreach>
</select>
```

这里看到<include>标签不要慌，这是引入公共sql语句，很像Java中的引包，多用于重复的sql语句，减少代码量，增加简洁性

```xml
<sql id="selectUser">
        select id,username,password,birthday from user
</sql>
```

使用<sql>标签来定义公共sql，其中**id**属性是这个公共sql独有的命名，切忌命名不能重复

引用就看上面的集合遍历实例

再继续看集合遍历实例

先把想要生成的sql语句写上

select id,username,password,birthday from user where id in(1,2,3,5)

看到in了吧，这是包含，意思是查询id 是1，2，3，5符合条件的行

相当于 id = 1 or id =2 or id = 3 or id = 5

这里用到了<foreach>标签是不是很熟悉，确实很像JavaScript中的forEach，这个标签中**collection**属性就是需要遍历的对象名，

那么后面的**open**和**close**属性是干啥的，顾名思义，前者相当于前缀suffix，后者就是后缀了presuffix了，相当于这个<foreach>标签最终生成的sql语句前后都有(),**separator**属性每遍历出一个元素就会在元素后加上逗号最后的元素不加，**item**属性就是生成sql语句参数名

也就是往#{id}中传值