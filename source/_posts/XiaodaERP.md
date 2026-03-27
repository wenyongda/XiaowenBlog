---
title: XiaodaERP
date: 2021-03-23 10:30:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/67239FBB-E15D-4F4F-8EE8-0F1C9F3C4E7C.jpeg
---
# XiaodaERP

## 访问地址: [XiaodaERP](http://120.46.194.61:81/)

## 技术选形

- ASP.Net 6
- Entity Framework Core 6
- Microsoft SQL Server

## 开发手册

本节以用户模块开发为模板

首先数据库建表

### 数据库建模PDM

#### 表名

![image-20221130162410150](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221130162410150.png)

#### 表结构

![image-20221130162426950](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221130162426950.png)

### SQL Server数据库建表

![image-20221130162700170](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221130162700170.png)

### EF Core 建立POCO对象

#### 创建POCO

POCO全称 Plain Old CLR Object 普通旧CLR对象 作为 ORM映射

在**解决方案资源管理器**中已创建的**Models**文件夹中新建 `User.cs`类

![image-20221130162955888](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221130162955888.png)

参照数据库表结构将对应列添加进属性中

需要加 **? **代表可空数据类型

其中 **Role**是另一个POCO，在这里的作用是多表联查，用户与角色为多对一关系

```c#
namespace XiaodaERP.Models
{
    public class User
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? RealName { get; set;}
        public string? Avatar { get; set;}
        public string? Desc { get; set;}
        public string? PassWord { get; set; }
        public string? HomePath { get; set; }
        public Role? Role { get; set; }
        public string? RoleId { get; set; }
        public string? Email { get; set;}
        public string? CreateUserId { get; set; }
        public DateTime? CreateTime { get; set; }
        public DateTime? UpdateTime{ get; set; }
        public string? DeptId { get; set; }
        public string? CreateUserName { get; set; }
        public string? UpdateUserId { get; set; }
        public string? UpdateUserName { get; set; }
    }
}
```

#### 创建Mapping映射

建立ORM映射

在**解决方案资源管理器**中已创建的**Mapping**文件夹中新建 `UserMap.cs`类

![image-20221130170549473](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221130170549473.png)

根据数据库表结构配置映射

```c#
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XiaodaERP.Models;

namespace XiaodaERP.Mapping
{
    public class UserMap : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // 数据库表名
            builder.ToTable("BASE_USER");
            // 数据库主键
            builder.HasKey(t => t.UserId);
            // 数据库列名
            builder.Property(t => t.UserId).HasColumnName("USERID");
            builder.Property(t => t.UserName).HasColumnName("USERNAME");
            builder.Property(t => t.RealName).HasColumnName("REALNAME");
            builder.Property(t => t.Avatar).HasColumnName("AVATAR");
            builder.Property(t => t.Desc).HasColumnName("DESC");
            builder.Property(t => t.PassWord).HasColumnName("PASSWORD");
            builder.Property(t => t.HomePath).HasColumnName("HOMEPATH");
            builder.Property(t => t.CreateUserId).HasColumnName("CREATEUSERID");
            builder.Property(t => t.CreateUserName).HasColumnName("CREATEUSERNAME");
            builder.Property(t => t.UpdateUserId).HasColumnName("UPDATEUSERID");
            builder.Property(t => t.UpdateUserName).HasColumnName("UPDATEUSERNAME");
            builder.Property(t => t.CreateTime).HasColumnName("CREATETIME");
            builder.Property(t => t.UpdateTime).HasColumnName("UPDATETIME");
            builder.Property(t => t.Email).HasColumnName("EMAIL");
            builder.Property(t => t.RoleId).HasColumnName("ROLEID");
            builder.Property(t => t.DeptId).HasColumnName("DEPTID");
            // User包含一个Role 一个Role对应多个User
            builder.HasOne(u => u.Role).WithMany();
        }
    }
}

```

#### 配置DbContext

DbContext为EF Core数据库上下文

打开创建好的 `SqlServerDbContext.cs`

加入DbSet,  Mapping映射

```c#
using Microsoft.EntityFrameworkCore;
using XiaodaERP.Mapping;
using XiaodaERP.Models;

namespace XiaodaERP
{
    public class SqlServerDbContext : DbContext
        {
        public SqlServerDbContext(DbContextOptions<SqlServerDbContext> options)
            : base(options)
        {
        }
		// DbSet
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Mapping映射
            modelBuilder.ApplyConfiguration<User>(new UserMap());

            base.OnModelCreating(modelBuilder);
        }

    }
}

```

#### 创建VO

VO全称ViewObject 视图对象 作为 API与前端数据交换的媒介

在**解决方案资源管理器**中已创建的**Models**文件夹中新建 `ViewUser.cs`类

```c#
using System.Security.Permissions;

namespace XiaodaERP.Models
{
    public class ViewUser
    {
        public string? UserId { get; set; }
        public string? username { get; set; }
        public string? RealName { get; set; }
        public string? Avatar { get; set; }
        public string? Desc { get; set; }
        public string? password { get; set; }
        public string? Token { get; set; }
        public string? HomePath { get; set; }
        public string? RoleId { get; set; }
        public string? RoleName { get; set; }
        public string? Email { get; set; }
        public string? CreateUser { get; set; }
        public string? DeptId { get; set; }
        public Role[]? Roles { get; set; }
        public int? Total { get; set; }
    }
}

```

#### 创建 `Service`

在**解决方案资源管理器**中已创建的**Services**文件夹的**IServices**文件夹中新建 `IAccountService.cs`接口

![image-20221207091417161](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207091417161.png)

```c#
using XiaodaERP.Models;
using XiaodaERP.Utils;

namespace XiaodaERP.Services.IServices
{
    public interface IAccountService
    {
        // 查询所有Account 条件查询
        List<ViewUser> GetAllAccounts(string DeptId, string? userName, string? realName);
		// 添加与更新Account
        bool UpdateAccount(ViewUser viewUser);
		// 删除Account根据主键ID
        bool DeleteAccount(string UserId);

        bool ResetToDefaultPassword(string UserId);
		// 分页条件查询Account
        PageResult<ViewUser> GetAllAccountsPagination(int page, int pageSize, string DeptId, string? userName, string? realName);
    }
}
```

在**Services**文件夹中新建 `AccountService.cs`类，并实现 `IAccountService.cs`接口

```c#
using AutoMapper;
using Castle.Core.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Validations;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using XiaodaERP.Models;
using XiaodaERP.Services.IServices;
using XiaodaERP.Utils;

namespace XiaodaERP.Services
{
    public class AccountService : IAccountService
    {
        private readonly OracleDbContext _oracleDbContext;
        private readonly SqlServerDbContext _sqlServerDbContext;
        private readonly TokenHelper _tokenHelper;
        public AccountService(OracleDbContext oracleDbContext, SqlServerDbContext sqlServerDbContext, TokenHelper tokenHelper)
        {
            _oracleDbContext = oracleDbContext;
            _sqlServerDbContext = sqlServerDbContext;
            _tokenHelper = tokenHelper;
        }

        public bool DeleteAccount(string UserId)
        {
            var res = _sqlServerDbContext.Users.Where(t => t.UserId == UserId).FirstOrDefault();
            if (res != null)
            {
                _sqlServerDbContext.Users.Remove(res);
                return _sqlServerDbContext.SaveChanges() > 0;
            }
            else
            {
                return false;
            }
        }

        public List<ViewUser> GetAllAccounts(string DeptId, string? userName, string? realName)
        {
            var res = new List<User>();
            if (!string.IsNullOrEmpty(DeptId))
            {
                var pdeptRes = _sqlServerDbContext.Depts
                    .Where(t => t.Id == DeptId).Select(t => t.ParentDept).FirstOrDefault();
                // 如果pdept是空的，是一级部门
                if (string.IsNullOrEmpty(pdeptRes))
                {
                    if (!userName.IsNullOrEmpty() && realName.IsNullOrEmpty())
                    {
                        res = _sqlServerDbContext.Users.Include(user => user.Role)
                            .Where(u => (_sqlServerDbContext.Depts.Where(d => d.ParentDept == DeptId)
                                    .Select(d => d.Id)
                                    .ToList())
                                .Contains(u.DeptId))
                            .Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%")).ToList();
                    }
                    if (!realName.IsNullOrEmpty() && userName.IsNullOrEmpty())
                    {
                        res = _sqlServerDbContext.Users.Include(user => user.Role)
                            .Where(u => (_sqlServerDbContext.Depts.Where(d => d.ParentDept == DeptId)
                                    .Select(d => d.Id)
                                    .ToList())
                                .Contains(u.DeptId))
                            .Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%")).ToList();
                    }
                    if (!userName.IsNullOrEmpty() && !realName.IsNullOrEmpty())
                    {
                        res = _sqlServerDbContext.Users.Include(user => user.Role)
                            .Where(u => (_sqlServerDbContext.Depts.Where(d => d.ParentDept == DeptId)
                                    .Select(d => d.Id)
                                    .ToList())
                                .Contains(u.DeptId))
                            .Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%"))
                            .Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%")).ToList();
                    }
                    if (userName.IsNullOrEmpty() && realName.IsNullOrEmpty())
                    {
                        res = _sqlServerDbContext.Users.Include(user => user.Role)
                            .Where(u => (_sqlServerDbContext.Depts.Where(d => d.ParentDept == DeptId)
                                    .Select(d => d.Id)
                                    .ToList())
                                .Contains(u.DeptId)).ToList();
                    }
                }
                else
                {
                    res = _sqlServerDbContext.Users
                        .Include(user => user.Role)
                        .Where(u => u.DeptId == DeptId).ToList();
                }
            }
            else
            {
                res = _sqlServerDbContext.Users.Include(user => user.Role).ToList();
            }

            List<ViewUser> viewUsers = new();
            var config = new MapperConfiguration(cfg => cfg.CreateMap<User, ViewUser>()
                .ForMember(dest => dest.username, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Role.Id))
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.RoleName)));
            var mapper = config.CreateMapper();
            foreach (var user in res)
            {
                viewUsers.Add(
                    mapper.Map<ViewUser>(user)
                ) ;
            }
            return viewUsers;
        }

        public bool UpdateAccount(ViewUser viewUser)
        {
            var res = _sqlServerDbContext.Users.FirstOrDefault(x => x.UserId == viewUser.UserId);
            var config = new MapperConfiguration(cfg => cfg.CreateMap<ViewUser, User>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.username))
                .BeforeMap((src, des) => src.UserId = Guid.NewGuid().ToString().Replace("-", "").ToUpper())
                .BeforeMap((src, des) => src.password = this.Md5Encoding("123456"))
                .BeforeMap((src, des) => des.CreateTime = DateTime.Now)
                .BeforeMap((src, des) => des.CreateUserId = _tokenHelper.GetToken<ViewUser>(TokenHelper.Token).UserId)
                .BeforeMap((src, des) => des.CreateUserName = _tokenHelper.GetToken<ViewUser>(TokenHelper.Token).username));
            var mapper = config.CreateMapper();
            if (res == null)
            {
                _sqlServerDbContext.Users.Add(
                mapper.Map<User>(viewUser)
                    );
            }
            else
            {
                res = new MapperConfiguration(cfg => cfg.CreateMap<ViewUser, User>()
                    .BeforeMap((src, des) => src.password = des.PassWord)
                    .BeforeMap((src, des) => des.UpdateTime = DateTime.Now)
                    .BeforeMap((src, des) => des.UpdateUserId = _tokenHelper.GetToken<ViewUser>(TokenHelper.Token).UserId)
                    .BeforeMap((src, des) => des.UpdateUserName = _tokenHelper.GetToken<ViewUser>(TokenHelper.Token).username))
                    .CreateMapper().Map(viewUser, res);
            }
            return _sqlServerDbContext.SaveChanges() > 0;
        }

        /// <summary>
        /// MD5 加密字符串
        /// </summary>
        /// <param name="rawPass">源字符串</param>
        /// <returns>加密后字符串</returns>
        public string Md5Encoding(string rawPass)
        {
            // 创建MD5类的默认实例：MD5CryptoServiceProvider
            var md5 = MD5.Create();
            var bs = Encoding.UTF8.GetBytes(rawPass);
            var hs = md5.ComputeHash(bs);
            var sb = new StringBuilder();
            foreach (var b in hs)
            {
                // 以十六进制格式格式化
                sb.Append(b.ToString("x2"));
            }
            return sb.ToString();
        }

        public bool ResetToDefaultPassword(string UserId)
        {
            var res = _sqlServerDbContext.Users.Where(t => t.UserId == UserId).FirstOrDefault();
            if (res != null)
            {
                res.UpdateTime = DateTime.Now;
                res.UpdateUserId = _tokenHelper.GetToken<ViewUser>(TokenHelper.Token).UserId;
                res.UpdateUserName = _tokenHelper.GetToken<ViewUser>(TokenHelper.Token).username;
                res.PassWord = Md5Encoding("123456");
                return _sqlServerDbContext.SaveChanges() > 0;
            }
            else
            {
                return false;
            }
        }

        public PageResult<ViewUser> GetAllAccountsPagination(int page, int pageSize, string DeptId, string? userName, string? realName)
        {
            var res = new List<User>();
            int count = 0;
            if (!string.IsNullOrEmpty(DeptId))
            {
                var pdeptRes = _sqlServerDbContext.Depts
                    .Where(t => t.Id == DeptId).Select(t => t.ParentDept).FirstOrDefault();
                // 如果pdept是空的，是一级部门 一级部门查询
                if (string.IsNullOrEmpty(pdeptRes))
                {
                    var sql = _sqlServerDbContext.Users.Include(user => user.Role)
                            .Where(u => (_sqlServerDbContext.Depts.Where(d => d.ParentDept == DeptId)
                                    .Select(d => d.Id)
                                    .ToList())
                                .Contains(u.DeptId))
                            .AsQueryable();
                    if (!userName.IsNullOrEmpty() && realName.IsNullOrEmpty())
                    {
                        res = sql
                            .Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%"))
                            .Skip((page - 1) * pageSize).Take(pageSize).ToList();
                        count = sql.Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%")).Count();
                    }
                    if (!realName.IsNullOrEmpty() && userName.IsNullOrEmpty())
                    {
                        res = sql
                            .Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%"))
                            .Skip((page - 1) * pageSize).Take(pageSize).ToList();
                        count = sql.Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%")).Count();
                    }
                    if (!userName.IsNullOrEmpty() && !realName.IsNullOrEmpty())
                    {
                        res = sql
                            .Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%"))
                            .Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%"))
                            .Skip((page - 1) * pageSize).Take(pageSize).ToList();
                        count = sql.Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%"))
                            .Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%")).Count();
                    }
                    if (userName.IsNullOrEmpty() && realName.IsNullOrEmpty())
                    {
                        res = sql.Skip((page - 1) * pageSize).Take(pageSize).ToList();
                        count = sql.Count();
                    }
                } // 二级部门查询
                else
                {
                    var sql = _sqlServerDbContext.Users
                        .Include(user => user.Role)
                        .Where(u => u.DeptId == DeptId).AsQueryable();
                    if (!userName.IsNullOrEmpty() && realName.IsNullOrEmpty())
                    {
                        res = sql
                            .Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%"))
                            .Skip((page - 1) * pageSize).Take(pageSize).ToList();
                        count = sql.Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%")).Count();
                    }
                    if (!realName.IsNullOrEmpty() && userName.IsNullOrEmpty())
                    {
                        res = sql
                            .Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%"))
                            .Skip((page - 1) * pageSize).Take(pageSize).ToList();
                        count = sql.Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%")).Count();
                    }
                    if (!userName.IsNullOrEmpty() && !realName.IsNullOrEmpty())
                    {
                        res = sql
                            .Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%"))
                            .Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%"))
                            .Skip((page - 1) * pageSize).Take(pageSize).ToList();
                        count = sql.Where(u => EF.Functions.Like(u.UserName, "%" + userName + "%"))
                            .Where(u => EF.Functions.Like(u.RealName, "%" + realName + "%")).Count();
                    }
                    if (userName.IsNullOrEmpty() && realName.IsNullOrEmpty())
                    {
                        res = sql.ToList();
                        count = sql.Count();
                    }
                }
            }
            else
            {
                res = _sqlServerDbContext.Users.Include(user => user.Role).ToList();
                count = _sqlServerDbContext.Users.Include(user => user.Role).Count();
            }

            List<ViewUser> viewUsers = new();
            var config = new MapperConfiguration(cfg => cfg.CreateMap<User, ViewUser>()
                .ForMember(dest => dest.username, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Role.Id))
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.RoleName))
                .AfterMap((src, des) => des.password = null));
            var mapper = config.CreateMapper();
            foreach (var user in res)
            {
                viewUsers.Add(
                    mapper.Map<ViewUser>(user)
                );
            }
            return new PageResult<ViewUser>
            {
                Items = viewUsers,
                Total = count
            };
        }
    }
}
```

#### 创建 `Controller`

Controller即控制器，API，负责后端与前端数据交互

在**解决方案资源管理器**中已创建的**Controllers**文件夹中新建 `AccountController.cs`类

![image-20221207091644868](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20221207091644868.png)

遵循RestFul风格 查询使用Get请求，增加与更新使用Post请求，删除使用Delete请求

```c#
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XiaodaERP.Attributes;
using XiaodaERP.Models;
using XiaodaERP.Services;
using XiaodaERP.Services.IServices;
using XiaodaERP.Utils;

namespace XiaodaERP.Controllers
{
    // 使用WebAPI
    [ApiController]
    [Route("/api/[controller]/[action]")] // 规定API URL格式
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
		// 注入AccountService
        public AccountController (IAccountService accountService)
        {
            _accountService = accountService;
        }
        // 添加与更新Account Post请求 Name指定 action 的Url
        [Authorize]
        [HttpPost(Name = "postAccount")]
        public ResultUtil PostAccount(ViewUser viewUser) =>
            ResultUtil.ok(_accountService.UpdateAccount(viewUser));

        //[AuthFilter]
        [TypeFilter(typeof(AuthFilter))] // 自定义AOP注解 记录接口操作日志
        [Authorize] // 需要携带Token认证的接口
        [HttpGet(Name = "getAllAccountList")]
        public ResultUtil GetAllAccountList(int? page, int? pageSize, string? deptId, string? userName, string? realName)
        {
            if (page != null && pageSize != null)
            {
                return ResultUtil.ok(_accountService.GetAllAccountsPagination((int) page, (int) pageSize, deptId, userName, realName));
            }
            else
            {
                return ResultUtil.ok(_accountService.GetAllAccounts(deptId, userName, realName));
            }

        }

        [Authorize]
        [HttpPut(Name = "resetToDefaultPassword")]
        public ResultUtil ResetToDefaultPassword(string userId)
            => ResultUtil.ok(_accountService.ResetToDefaultPassword(userId));

        [Authorize]
        [HttpDelete(Name = "deleteAccount")]
        public ResultUtil DeleteAccount(string userId) => ResultUtil.ok(_accountService.DeleteAccount(userId));
    }
}

```
