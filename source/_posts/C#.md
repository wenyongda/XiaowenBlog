---
title: C#
date: 2021-03-23 10:30:31
author: 文永达
permalink: csharp/
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/67239FBB-E15D-4F4F-8EE8-0F1C9F3C4E7C.jpeg
---

# 异步编程

## await

在C#中，`await`关键字用于等待异步操作完成，并返回其结果。当遇到`await`关键字时，C#编译器会暂停当前方法的执行，并等待异步操作完成并返回结果。在等待异步操作的过程中，C#编译器会继续执行其他代码，例如设置变量的值。但是，当异步操作完成后，C#编译器会继续执行`await`关键字之后的代码。

下面是一个使用`await`关键字的示例，演示了如何等待异步操作完成：

```c#
using System;
using System.Net.Http;
using System.Threading.Tasks;

public class Example
{
    public static async Task Main()
    {
        Console.WriteLine("Start");

        var client = new HttpClient();
        var response = await client.GetAsync("https://jsonplaceholder.typicode.com/todos/1");
        var content = await response.Content.ReadAsStringAsync();

        Console.WriteLine(content);
        Console.WriteLine("End");
    }
}
```

在这个示例中，我们使用`HttpClient`类来发送HTTP请求，并使用`await`关键字等待响应。在`Main`方法中，我们首先打印"Start"，然后使用`HttpClient`类发送GET请求，并使用`await`关键字等待响应。在等待的过程中，C#编译器会继续执行其他代码，但是当响应返回后，C#编译器会继续执行`await`关键字之后的代码，即读取响应内容并打印它。最后，我们打印"End"。

总之，当遇到`await`关键字时，C#编译器会暂停当前方法的执行，并等待异步操作完成并返回结果。在等待异步操作的过程中，C#编译器会继续执行其他代码，但是当异步操作完成后，C#编译器会继续执行`await`关键字之后的代码。

# 枚举

在C#中，我们可以使用枚举类型来定义一组相关的常量。枚举类型可以包含一个或多个枚举成员，每个枚举成员都有一个名称和一个关联的值。在C# 8.0及以上版本中，我们可以使用`enum`关键字来定义字符串枚举类型。

下面是一个使用字符串枚举的示例：

```c#
enum Color {
  Red,
  Green,
  Blue
}

enum Size {
  Small,
  Medium,
  Large
}

enum Fruit {
  Apple = 1,
  Banana = 2,
  Orange = 3
}

enum Animal {
  [Description("狗")]
  Dog,
  [Description("猫")]
  Cat,
  [Description("鸟")]
  Bird
}

enum ErrorCode {
  [EnumMember(Value = "1001")]
  InvalidInput,
  [EnumMember(Value = "1002")]
  Unauthorized,
  [EnumMember(Value = "1003")]
  NotFound
}
```

在这个示例中，我们定义了四个枚举类型`Color`、`Size`、`Fruit`和`Animal`。`Color`和`Size`是普通的枚举类型，它们的枚举成员的值默认从0开始递增。`Fruit`是一个带有关联值的枚举类型，它的枚举成员的关联值可以是任何整数类型。`Animal`是一个带有描述信息的枚举类型，它的枚举成员使用了`Description`特性来指定描述信息。`ErrorCode`是一个带有序列化信息的枚举类型，它的枚举成员使用了`EnumMember`特性来指定序列化信息。

在使用枚举类型时，我们可以通过枚举成员的名称来访问枚举成员，例如`Color.Red`、`Size.Small`、`Fruit.Banana`等。我们也可以将枚举成员的值转换为字符串，例如`Color.Red.ToString()`会返回字符串`"Red"`。

总之，C#中的枚举类型可以用于定义一组相关的常量。在C# 8.0及以上版本中，我们可以使用`enum`关键字来定义字符串枚举类型。在使用枚举类型时，我们可以通过枚举成员的名称来访问枚举成员，也可以将枚举成员的值转换为字符串。

# DataTable

## 基础概念

表示一个内存内关系数据的表，如同关系型数据库中的表

## 创建 DataTable

```c#
//引用命名空间
using System.Data;
//创建一个空表，
DataTable dt = new DataTable();
//创建一个名为"Table_New"的空表
DataTable dt = new DataTable("Table_New");
```

## 列 DataColumn

- DataColumn 定义每列的数据类型来确定表的架构
- DataTable中的列可以映射到数据源中的列、包含从表达式计算所得的值、自动递增它们的值，或包含主键值
- DataColumn的DataType属性，可限制该列的数据类型为整数、字符串或十进制数等，但必须将数据类型与数据源中的数据类型匹配。

```shell
//1.创建空列
DataColumn dc = new DataColumn();
dt.Columns.Add(dc);
//2. 提供列名，并对列属性进行设置
DataTable workTable = new DataTable("Customers");    
//带列名和类型名
DataColumn workCol = workTable.Columns.Add("CustID", typeof(Int32)); 
// 对进行属性设置
workCol.AllowDBNull = false;   //列的属性设置为不允许 DBNull 值
workCol.Unique = true; //值约束为唯一
workColumn.AutoIncrement = true;  //在表中添加新行时自动递增
workColumn.AutoIncrementSeed = 200;  //从值 200 开始并以 3 为增量递增的列
workColumn.AutoIncrementStep = 3; 
column.DefaultValue = 25;
// 定义主键：唯一地标识表中的每一行
workTable.PrimaryKey = new DataColumn[] {workTable.Columns["CustID"]};  
// Or  
DataColumn[] columns = new DataColumn[1];  
columns[0] = workTable.Columns["CustID"];  
workTable.PrimaryKey = columns;  

// 创建表达式列:能够包含根据 同一行 中其他列值或根据表中 多行 的列值计算而得的值
//比如  表达式类型            示例
//        比较              “总计 >= 500”
//        计算               "UnitPrice * Quantity"
//        聚合                   Sum(Price)
workTable.Columns.Add("Total", typeof(Double));  
workTable.Columns.Add("SalesTax", typeof(Double), "Total * 0.086"); 
```

## 复制DataTable

```c#
  objectTable  = sourceTable .Copy();//深复制，包含DataRow
  objectTable  = sourceTable .Clone();//浅复制，只复制架构
```

## 复制 DataRow

### ImportDataRow方法

```c#
public void ImportDataRow( DataRow DataRow);

objectTable = sourceTable.clone();//必须先复制表的架构，使具有相同的的列或关系！
foreach (DataRow oRow in sourceTable)
{
    objectTable.ImportDataRow(oRow);//在objectTable中添加一个新行，并将sourceRow的值复制进去,要求表的结构一样！
}
```

### 自定义复制

```c#
objectTable.Columns.Add ("id");//不需要有一样的架构,只复制自己需要的列!
Object[] myArry = new Object[1];
foreach (DataRow oRow in sourceTable.Rows)
{
    tempRow = objectTable.NewRow();//此方法必须调用!
    myArry[0] = oRow["id"];//如果myArry中没有源表中的id列的话就会报错！
    tempRow.ItemArray = myArry;//ItemArray属性为Object类型数组,根据程序的需要需要可自行复制多个列的数据!
    objectTable.Rows.Add(tempRow); //此方法必须调用，否则DataRow中的数据将不能显示!
}
```

### LoadDataRow方法

```c#
public DataRow LoadDataRow(Object[] values,bool fAcceptChanges);

Object[] newRow = new Object[3];
// 设置对象数组的值
newRow[0] = "Hello";
newRow[1] = "World";
newRow[2] = "two";
DataRow myRow;
ObjectTable.BeginLoadData();
// 将新行添加到表中
myRow = ObjectTable.LoadDataRow(newRow, true);//标志要设置为true,表示添加新行
ObjectTable.EndLoadData();
```

# 反射(Reflection)

> 反射是.NET中的重要机制，通过反射可以得到\*.exe或\*.dll等程序集内部的接口、类、方法、字段、属性、特性等信息，还可以动态创建出类型实例并执行其中的方法。
> 
> 反射指程序可以访问、检测和修改它本身状态或行为的一种能力。
> 
> 程序集包含模块，而模块包含类型，类型又包含成员。反射则提供里封装程序集、模块和类型的对象。
> 
> 可以使用反射动态地创建类型的实例，将类型绑定到现有对象，或从现有对象中获取类型。然后，可以调用类型的方法或访问其字段和属性。

通过反射获取类型

描述：有三种类型

1. 通过`typeof`获取某个值的类型
   
   ```c#
   System.Type personType=typeof(Person);
   System.Type heroType=typeof(Framework.Hero);
   ```

2. 通过一个对象获取该对象所对应的类的类型、
   
   ```c#
   Framework.hero dmxy =new Framework.hero();
   System Type=dmxy.GetType();
   ```

3. 通过类的名称字符串获取对应的类型 
   
   ```c#
   System.Type strType =System.Type.GetType("Person");
   System.Type strType =System.Type.GetType("Framework.Hero");
   ```

## Type类

属性

- Name 数据类型名

- FullName 数据类型的完全限定名

- Namespace 定义数据类型的命名空间名

- IsAbstract 指示该类型是否为数组

- IsArray 指示该类型是否为数组

- IsClass 指示该类型是否为类

- IsEnum 指示该类型是否为枚举

- IsInterface 指示该类型是否为接口

- IsPublic 指示该类型是否为共有的

- IsSealed 指示该类型是否是密封类

- IsValueType 指示该类型是否是密封类

- IsValueType 指示该类型是否是值类型

- BaseType 父类类型

- AssemblyQualifiedName 程序集+命名空间+类名 | 是Type.GetType(str)中的字符串

```csharp
private void ShowTypeField()
{
    // 获取类型
    Type heroType = typeof(Framework.Hero);
    // 查看类型的名字
   Console.WriteLine("Name:" + heroType.Name);
    //查看类型的全名
    Console.WriteLine("FullName:" + heroType.FullName);
    //查看程序集名称
    Console.WriteLine("Assembly:" + heroType.Assembly);
    //加上程序集的全名
    Console.WriteLine("Ass-Name:" +heroType.AssemblyQualifiedName);
    //获取该类型的父类
    Console.WriteLine("BaseType:" + heroType.BaseType.BaseType);
}
```

## 方法

- GetMember(),GerMembers()

1.返回MemberInfo类型，用于取得该类的所有成员的信息 

2.GetConstructor(),GetConstructors() -返回ConstructorInfo类型，用于取得该类构造函数的信息

- GetEvent(),GetEvents()

 返回EventInfo类型，用于取得该类的事件的信息

- GetInterface(),GetInterfaces()

 返回InterfaceInfo类型，用于取得该类实现的接口的信息

- GetField(),GetFields()

 返回FieldInfo类型，用于取得该类的字段（成员变量）的信息

- GetPropeerty(),GetProperties()

 返回ProperyInfo类型，用于取得该类的属性的信息

- GetMethod(),GetMethods()

 返回MethodInfo类型，用于取得该类的方法的信息

# 循环

## foreach

### 
