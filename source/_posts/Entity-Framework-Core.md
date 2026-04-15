---
title: Entity Framework Core
date: 2026-04-15 12:35:21
tags: [Entity Framework Core, EF Core, .NET, ORM]
categories: [后端开发, .NET]
permalink: entity-framework-core/
---

## Entity Framework Core 简介

Entity Framework Core (EF Core) 是微软为 .NET 应用程序开发的对象关系映射(ORM)框架,它是经典 Entity Framework 的轻量级、跨平台版本。EF Core 使开发者能够使用 .NET 对象与数据库进行交互,消除了大量通常需要编写的数据访问代码。

### 核心特性

EF Core 的主要特性包括:

- **跨平台支持**:可在 Windows、Linux 和 macOS 上运行
- **现代架构**:针对性能和灵活性进行了优化设计
- **多种数据库支持**:通过数据库提供程序插件支持多种数据库引擎
- **LINQ 查询**:使用强类型的 LINQ 表达式查询数据
- **变更跟踪**:自动跟踪实体变更并生成相应的数据库更新命令
- **迁移系统**:以增量方式更新数据库架构以与应用程序数据模型保持同步
- **配置灵活性**:支持通过数据注释、Fluent API 和约定来配置模型

## 数据模型配置

EF Core 使用元数据模型来描述如何将应用程序的实体类型映射到基础数据库。此模型是通过以下三种机制构建的:

### 1. 约定(Conventions)

EF Core 包含一套默认启用的模型生成约定,这些启发式规则用于查找常见模式。例如,名为 `Id` 或 `<类型名>Id` 的属性会被配置为主键。

```csharp
public class Blog
{
    public int BlogId { get; set; }  // 自动配置为主键
    public string Url { get; set; }
    public List<Post> Posts { get; } = new();
}
```

### 2. 数据注释(Data Annotations)

可以将特性属性应用于类和属性来覆盖约定:

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Blogs")]
public class Blog
{
    [Key]
    public int BlogId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Url { get; set; }

    [Column("CreatedDate")]
    public DateTime CreatedTimestamp { get; set; }
}
```

### 3. Fluent API

在派生的上下文中重写 `OnModelCreating` 方法使用 Fluent API 配置模型,这是最强大的配置方法:

```csharp
internal class MyContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>()
            .ToTable("Blogs")
            .Property(b => b.Url)
            .IsRequired()
            .HasMaxLength(200);

        // 分组配置
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(BlogEntityTypeConfiguration).Assembly);
    }
}

// 分离配置到独立类
public class BlogEntityTypeConfiguration : IEntityTypeConfiguration<Blog>
{
    public void Configure(EntityTypeBuilder<Blog> builder)
    {
        builder.Property(b => b.Url).IsRequired();
    }
}
```

## DbContext 和实体状态

### DbContext 生命周期

每个 `DbContext` 实例代表一个工作单元,其设计生命周期如下:

```csharp
// 1. 创建 DbContext 实例
using var context = new BloggingContext();

// 2. 跟踪实体
var blog = await context.Blogs.FirstAsync();

// 3. 进行变更
blog.Name = "Updated Name";

// 4. 调用 SaveChanges 更新数据库
await context.SaveChangesAsync();

// 5. DbContext 自动释放(using 语句)
```

### 实体状态

EF Core 为每个实体维护一个状态,驱动数据库操作:

| 状态        | 说明                  | SaveChanges 操作 |
| ----------- | --------------------- | ---------------- |
| `Detached`  | 未被 DbContext 跟踪   | 无操作           |
| `Added`     | 新实体,尚未插入数据库 | INSERT           |
| `Unchanged` | 从数据库查询后未更改  | 无操作           |
| `Modified`  | 查询后已更改          | UPDATE           |
| `Deleted`   | 标记为删除            | DELETE           |

## CRUD 操作实战

### 创建(Create)

```csharp
using var db = new BloggingContext();

// 创建新实体
var blog = new Blog { Url = "https://example.com" };
db.Add(blog);
await db.SaveChangesAsync();

// 或使用 DbSet
db.Blogs.Add(blog);
await db.SaveChangesAsync();

// 批量添加
db.Blogs.AddRange(blog1, blog2, blog3);
await db.SaveChangesAsync();
```

### 读取(Read)

```csharp
using var context = new BloggingContext();

// 加载所有数据
var blogs = await context.Blogs.ToListAsync();

// 加载单个实体
var blog = await context.Blogs
    .SingleAsync(b => b.BlogId == 1);

// 条件筛选
var filteredBlogs = await context.Blogs
    .Where(b => b.Url.Contains("dotnet"))
    .OrderBy(b => b.BlogId)
    .ToListAsync();

// 关联数据加载(Eager Loading)
var blogWithPosts = await context.Blogs
    .Include(b => b.Posts)
    .FirstAsync(b => b.BlogId == 1);
```

### 更新(Update)

**方法一:更改跟踪和 SaveChanges**

```csharp
using var context = new BloggingContext();

// 查询并跟踪实体
var blog = await context.Blogs.SingleAsync(b => b.BlogId == 1);

// 修改属性
blog.Url = "https://new-url.com";

// 自动检测变更并更新
await context.SaveChangesAsync();
```

**方法二:ExecuteUpdate(批量更新)**

```csharp
// 批量更新,无需加载实体
await context.Blogs
    .Where(b => b.Rating < 3)
    .ExecuteUpdateAsync(s => s.SetProperty(b => b.IsActive, false));
```

### 删除(Delete)

**方法一:通过 SaveChanges**

```csharp
using var context = new BloggingContext();

var blog = await context.Blogs.FindAsync(1);
context.Remove(blog);
await context.SaveChangesAsync();
```

**方法二:ExecuteDelete(批量删除)**

```csharp
// 高效批量删除,直接在数据库执行
await context.Blogs
    .Where(b => b.Rating < 3)
    .ExecuteDeleteAsync();
```

## 查询性能优化

### N+1 查询问题

最常见的性能陷阱:

```csharp
// ❌ 错误:触发 N+1 查询
var blogs = await context.Blogs.ToListAsync();
foreach (var blog in blogs)
{
    // 每次循环都触发一次查询
    var posts = await context.Posts
        .Where(p => p.BlogId == blog.BlogId)
        .ToListAsync();
}

// ✅ 正确:使用 Include 预加载
var blogs = await context.Blogs
    .Include(b => b.Posts)
    .ToListAsync();
```

### 使用 AsNoTracking

对于只读查询,禁用变更跟踪可显著提升性能:

```csharp
// 只读查询不需要跟踪
var blogs = await context.Blogs
    .AsNoTracking()
    .ToListAsync();
```

**性能提升**:
- 减少 30-40% 内存占用
- 避免变更跟踪开销
- 适用于报表、API 返回等场景

### 投影(Select)优化

只查询需要的字段:

```csharp
// ❌ 加载整个实体
var blogs = await context.Blogs.ToListAsync();

// ✅ 只加载需要的字段
var blogUrls = await context.Blogs
    .Select(b => new { b.BlogId, b.Url })
    .ToListAsync();

// 或投影到 DTO
var blogDtos = await context.Blogs
    .Select(b => new BlogDto
    {
        Id = b.BlogId,
        Url = b.Url,
        PostCount = b.Posts.Count
    })
    .ToListAsync();
```

### 分页查询

```csharp
// ❌ 内存分页(加载全部数据)
var allBlogs = await context.Blogs.ToListAsync();
var page = allBlogs.Skip(10).Take(20);

// ✅ 数据库分页
var blogs = await context.Blogs
    .OrderBy(b => b.BlogId)
    .Skip(10)
    .Take(20)
    .ToListAsync();

// 更好的键集分页(适用于大数据集)
var blogs = await context.Blogs
    .Where(b => b.BlogId > lastSeenId)
    .OrderBy(b => b.BlogId)
    .Take(20)
    .ToListAsync();
```

### Split Queries

避免笛卡尔爆炸:

```csharp
// 多个集合导航属性会导致笛卡尔爆炸
var blogs = await context.Blogs
    .Include(b => b.Posts)
    .Include(b => b.Authors)
    .AsSplitQuery()  // 分拆为多个查询
    .ToListAsync();
```

### 编译查询(Compiled Queries)

对高频查询预编译:

```csharp
// 定义编译查询
private static readonly Func<BloggingContext, int, Task<Blog>> _getBlogById =
    EF.CompileAsyncQuery((BloggingContext context, int id) =>
        context.Blogs.FirstOrDefault(b => b.BlogId == id));

// 使用编译查询
var blog = await _getBlogById(context, 1);
```

**优势**:
- 减少表达式树解析开销
- 减少 LINQ 翻译开销
- 适用于每分钟执行多次的固定查询

## 数据库迁移

迁移系统允许以增量方式更新数据库架构,同时保留现有数据。

### 安装工具

```bash
# 安装 EF Core 命令行工具
dotnet tool install --global dotnet-ef

# 安装设计包
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### 创建和应用迁移

```bash
# 创建初始迁移
dotnet ef migrations add InitialCreate

# 应用迁移到数据库
dotnet ef database update

# 查看待应用的迁移
dotnet ef migrations list
```

### 迁移工作流程

```csharp
// 1. 修改数据模型
public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedTimestamp { get; set; }  // 新增属性
}

// 2. 创建迁移
// dotnet ef migrations add AddBlogCreatedTimestamp

// 3. 应用迁移
// dotnet ef database update
```

### 生成迁移文件示例

```csharp
public partial class AddBlogCreatedTimestamp : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<DateTime>(
            name: "CreatedTimestamp",
            table: "Blogs",
            type: "datetime2",
            nullable: false,
            defaultValue: new DateTime(2026, 1, 1));
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "CreatedTimestamp",
            table: "Blogs");
    }
}
```

## 性能最佳实践总结

### 1. DbContext 管理

```csharp
// ✅ 正确:Scoped 生命周期
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// ❌ 错误:不要使用 Singleton
// services.AddSingleton<AppDbContext>();
```

### 2. 禁用延迟加载

```csharp
// 在配置中禁用延迟加载
services.AddDbContext<BloggingContext>(options =>
    options.UseLazyLoadingProxies(false));

// 使用显式 Include 或投影
```

### 3. 批量操作

```csharp
// ✅ 批量添加
context.Users.AddRange(user1, user2, user3);
await context.SaveChangesAsync();

// ✅ 批量更新/删除
await context.Users
    .Where(u => u.IsActive == false)
    .ExecuteDeleteAsync();
```

### 4. 添加数据库索引

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // 单列索引
    modelBuilder.Entity<Blog>()
        .HasIndex(b => b.Url);

    // 复合索引
    modelBuilder.Entity<Post>()
        .HasIndex(p => new { p.BlogId, p.CreatedAt });
}
```

### 5. 启用查询日志

```csharp
services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString)
           .LogTo(Console.WriteLine);  // 开发环境日志
});
```

### 6. DbContext Pooling(高性能场景)

```csharp
// 启用上下文池化
services.AddDbContextPool<AppDbContext>(
    options => options.UseSqlServer(connectionString),
    poolSize: 128);
```

## 数据库提供程序

EF Core 通过插件库支持多种数据库:

| 数据库         | NuGet 包                                  | 维护方            |
| -------------- | ----------------------------------------- | ----------------- |
| SQL Server     | `Microsoft.EntityFrameworkCore.SqlServer` | Microsoft         |
| SQLite         | `Microsoft.EntityFrameworkCore.Sqlite`    | Microsoft         |
| PostgreSQL     | `Npgsql.EntityFrameworkCore.PostgreSQL`   | Npgsql            |
| MySQL/MariaDB  | `Pomelo.EntityFrameworkCore.MySql`        | Pomelo Foundation |
| Oracle         | `Oracle.EntityFrameworkCore`              | Oracle            |
| Cosmos DB      | `Microsoft.EntityFrameworkCore.Cosmos`    | Microsoft         |
| InMemory(测试) | `Microsoft.EntityFrameworkCore.InMemory`  | Microsoft         |

### 安装提供程序

```bash
# SQL Server
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

# PostgreSQL
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# SQLite
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

### 配置连接

```csharp
public class BloggingContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // SQL Server
        optionsBuilder.UseSqlServer(
            "Server=localhost;Database=MyBlog;Trusted_Connection=True;");

        // PostgreSQL
        // optionsBuilder.UseNpgsql("Host=localhost;Database=myblog;Username=postgres");

        // SQLite
        // optionsBuilder.UseSqlite("Data Source=blogging.db");
    }
}
```

## 完整实战示例

### 定义模型

```csharp
public class BloggingContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Author> Authors { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source=blogging.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>()
            .HasIndex(b => b.Url);

        modelBuilder.Entity<Post>()
            .HasIndex(p => new { p.BlogId, p.PublishedAt });
    }
}

public class Blog
{
    public int BlogId { get; set; }
    public string Url { get; set; }
    public DateTime CreatedTimestamp { get; set; }
    public List<Post> Posts { get; } = new();
    public List<Author> Authors { get; } = new();
}

public class Post
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime PublishedAt { get; set; }
    public int BlogId { get; set; }
    public Blog Blog { get; set; }
}

public class Author
{
    public int AuthorId { get; set; }
    public string Name { get; set; }
    public int BlogId { get; set; }
    public Blog Blog { get; set; }
}
```

### 完整 CRUD 示例

```csharp
using var db = new BloggingContext();

// 创建
Console.WriteLine("创建新博客");
var blog = new Blog
{
    Url = "https://myblog.com",
    CreatedTimestamp = DateTime.UtcNow
};
db.Add(blog);
await db.SaveChangesAsync();

// 查询
Console.WriteLine("查询博客");
var loadedBlog = await db.Blogs
    .Include(b => b.Posts)
    .AsNoTracking()
    .FirstAsync(b => b.BlogId == 1);

// 更新
Console.WriteLine("更新博客");
blog.Url = "https://updated-blog.com";
blog.Posts.Add(new Post
{
    Title = "First Post",
    Content = "Hello World!",
    PublishedAt = DateTime.UtcNow
});
await db.SaveChangesAsync();

// 删除
Console.WriteLine("删除博客");
db.Remove(blog);
await db.SaveChangesAsync();

// 批量删除(高效)
await db.Posts
    .Where(p => p.PublishedAt < DateTime.UtcNow.AddDays(-30))
    .ExecuteDeleteAsync();
```

## 监控和诊断

### 查看生成的 SQL

```csharp
// 启用详细日志
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder
        .UseSqlite("Data Source=blogging.db")
        .LogTo(Console.WriteLine, LogLevel.Information)
        .EnableSensitiveDataLogging();
}

// 查看变更跟踪状态
context.ChangeTracker.DetectChanges();
Console.WriteLine(context.ChangeTracker.DebugView.LongView);
```

### 性能指标

```csharp
// 查看查询缓存命中率
var queryCacheHitRate = context.Database.GetQueryCacheHitRate();

// 监控 EF Core 指标
var metrics = context.Database.GetMetrics();
```

## 总结

Entity Framework Core 为 .NET 开发者提供了强大的数据访问能力,但要充分发挥其潜力,需要理解:

1. **模型配置**:合理使用约定、数据注释和 Fluent API
2. **变更跟踪**:理解实体状态和工作单元模式
3. **查询优化**:避免 N+1 问题、使用 AsNoTracking、投影查询
4. **批量操作**:使用 ExecuteUpdate/ExecuteDelete 和 AddRange/UpdateRange
5. **数据库索引**:为常用查询条件添加索引
6. **迁移系统**:增量更新数据库架构
7. **性能监控**:启用日志、使用诊断工具

通过遵循这些最佳实践,EF Core 应用可以在保持开发便利性的同时,获得优秀的性能表现。

## 参考资源

- [Entity Framework Core 官方文档](https://learn.microsoft.com/zh-cn/ef/core)
- [EF Core GitHub 仓库](https://github.com/dotnet/efcore)
- [数据库提供程序列表](https://learn.microsoft.com/zh-cn/ef/core/providers/)
- [性能优化指南](https://learn.microsoft.com/en-us/ef/core/performance/)
- [迁移详解](https://learn.microsoft.com/zh-cn/ef/core/managing-schemas/migrations/)