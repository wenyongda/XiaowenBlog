---
title: Spring
date: 2023-10-09 14:17:02
tags:
---

# Spring Cloud

## OpenFeign

### 引入pom.xml

```xml
<properties>
    <java.version>17</java.version>
    <spring-cloud.version>2022.0.1</spring-cloud.version>
</properties>
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

