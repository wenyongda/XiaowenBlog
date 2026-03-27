---
title: gRPC入门与实操
date: 2023-01-16 12:37:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/67239FBB-E15D-4F4F-8EE8-0F1C9F3C4E7C.jpeg
---

# gRPC入门与实操

## 为什么选择gRPC

### 历史

长久以来，我们在前后端交互时使用`WebApi + JSON`方式，后端服务之间调用同样如此（或者更久远之前的`WCF + XML`方式）。WebApi + JSON 是优选的，很重要的一点是它们两者都是平台无关的三方标准，且足够语义化，便于程序员使用，在异构（前后端、多语言后端）交互场景下是不二选择。然而，在后端服务体系改进特别是后来微服务兴起后，我们发现，前后端交互理所当然认可的 WebApi + JSON 在后端体系内显得有点不太合适：

1. JSON 字符编码方式使得传输数据量较大，而后端一般并不需要直接操作 JSON，都会将 JSON 转为平台专有类型后再处理；既然需要转换，为什么不选择一个数据量更小，转换更方便的格式呢？
2. 调用双方要事先约定数据结构和调用接口，稍有变动就要手动更新相关代码（Model 类和方法签名）；是否可以将约定固化为文档，服务提供者维护该文档，调用方根据该文档可以方便地生成自己需要的代码，在文档变化时代码也可以自动更新？
3. [之前] WebApi 基于的 Http[1.1] 协议已经诞生 20 多年，其定义的交互模式在今日已经捉襟见肘；业界需要一个更有效率的协议。

### 高效传输-Http2.0

我们先来说第 3 个问题，其实很多大厂内部早已开始着手处理，并诞生了一些应用广泛的框架，如阿里开源的`Dubbo`，直接抛弃了 Http 改为基于 TCP实现，效率得到明显提升，不过 Dubbo 依赖 Java 环境，无法跨平台使用，不在我们考虑范围。

另一个大厂 Google，内部也在长期使用自研的`Stubby`框架，与 Dubbo 不同的是，Stubby是跨平台的，但是 Google 认为 Stubby不基于任何标准，而且与其内部基础设施紧密耦合，并不适合公开发布。

同时 Google 也在对 Http1.1 协议进行增强，该项目是 2012 年提出的 SPDY 方案，其优化了 Http 协议层，新增的功能包括数据流的多路复用、请求优先级以及HTTP报头压缩。Google 表示，引入 SPDY 协议后，在实验室测试中页面加载速度比原先快 64%。巨大的提升让大家开始从正面看待和解决老版本 Http 协议的问题，这也直接加速了 Http2.0 的诞生。实际上，Http2.0 是以 SPDY 为原型进行讨论和标准化的，当然也做了更多的改进和调整。

随着 Http2.0 的出现和普及，许多与 Stubby 相同的功能已经出现在公共标准中，包括 Stubby 未提供的其他功能。很明显，是时候重做 Stubby 以利用这种标准化，并将其适用范围扩展到分布式计算的最后一英里，支持移动设备(如安卓)、物联网(IOT)、和浏览器连接到后端服务。

2015 年 3 月，Google决定在公开场合构建下一版 Stubby，以便与业界分享经验，并进行相关合作，也就是本文的主角`gRPC`。

### 高效编码-protobuf

回头来看第 1 个问题，解决起来相对比较简单，无非是将傻瓜式字符编码转为更有效的二进制编码（比如数字 10000 JSON 编码后是 5 个字节，按整型编码就是 4 个字节），同时加上些事先约定的编码算法使得最终结果更紧凑。常见的平台无关的编码格式有`MessagePack`和`protobuf`等，我们以 protobuf 为例。

protobuf 采用 `varint` 和 处理负数的 `ZigZag` 两种编码方式使得数值字段占用空间大大减少；同时它约定了字段类型和标识，采用 `TLV` 方式，将字段名映射为小范围结果集中的一项（比如对于不超过 256 个字段的数据体来说，不管字段名本身的长度多少，每个字段名都只要 1 个字节就能标识），同时移除了分隔符，并且可以过滤空字段（若字段没有被赋值，那么该字段不会出现在序列化结果中）。

### 高效编程-代码生成工具

第 2 个问题呢，其实需要的就是[每个平台]一套代码生成工具。生成的代码需要覆盖类的定义、对象的序列化/反序列化、服务接口的暴露和远程调用等等必要的模板代码，如此，开发人员只需要负责接口文档的维护和业务代码的实现（很自然的面向接口编程：））。此时，采用 protobuf 的`gRPC`自然而然的映入眼帘，因为对于目前所有主要的编程语言和平台，都有 gRPC 工具和库，包括 .NET、Java、Python、Go、C++、Node.js、Swift、Dart、Ruby 以及 PHP。可以说，这些工具和库的提供，使得 gRPC 可以跨多种语言和平台一致地工作，成为一个全面的 RPC 解决方案。

## proto文件

```protobuf
syntax = "proto3";

option csharp_namespace = "GrpcDemo.Service";

package greet;

// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply);
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings.
message HelloReply {
  string message = 1;
}

```

- syntax 标识Protobuf版本为v3
- option csharp_namespace 标识生成C#类的命名空间
- package 标识proto文件的命名空间
- service 定义服务
- rpc FuncName (Input) returns (Output) 定义一个远程过程
- message 声明数据结构

###  Protobuf 消息(message)

消息是 Protobuf 中的主要数据传输对象。 它们在概念上类似于 .NET 类。

```protobuf
syntax = "proto3";

option csharp_namespace = "Contoso.Messages";

message Person {
    int32 id = 1;
    string first_name = 2;
    string last_name = 3;
}
```

前面的消息定义将三个字段指定为名称/值对。 与 .NET 类型上的属性类似，每个字段都有名称和类型。 字段类型可以是 Protobuf 标量值类型（如 `int32`），也可以是其他消息。

###  标量值类型

Protobuf 支持一系列本机标量值类型。 下表列出了全部本机标量值类型及其等效 C# 类型：

| **Protobuf 类型** | **C# 类型**  |
| ----------------- | ------------ |
| `double`          | `double`     |
| `float`           | `float`      |
| `int32`           | `int`        |
| `int64`           | `long`       |
| `uint32`          | `uint`       |
| `uint64`          | `ulong`      |
| `sint32`          | `int`        |
| `sint64`          | `long`       |
| `fixed32`         | `uint`       |
| `fixed64`         | `ulong`      |
| `sfixed32`        | `int`        |
| `sfixed64`        | `long`       |
| `bool`            | `bool`       |
| `string`          | `string`     |
| `bytes`           | `ByteString` |

### 日期和时间

本机标量类型不提供与 .NET 的 [DateTimeOffset](https://learn.microsoft.com/zh-cn/dotnet/api/system.datetimeoffset)、[DateTime](https://learn.microsoft.com/zh-cn/dotnet/api/system.datetime) 和 [TimeSpan](https://learn.microsoft.com/zh-cn/dotnet/api/system.timespan) 等效的日期和时间值。 可使用 Protobuf 的一些“已知类型”扩展来指定这些类型。 这些扩展为受支持平台中的复杂字段类型提供代码生成和运行时支持。

下表显示日期和时间类型：

| .NET 类型        | Protobuf 已知类型           |
| :--------------- | :-------------------------- |
| `DateTimeOffset` | `google.protobuf.Timestamp` |
| `DateTime`       | `google.protobuf.Timestamp` |
| `TimeSpan`       | `google.protobuf.Duration`  |

```c#
syntax = "proto3";

import "google/protobuf/duration.proto";  
import "google/protobuf/timestamp.proto";

message Meeting {
    string subject = 1;
    google.protobuf.Timestamp start = 2;
    google.protobuf.Duration duration = 3;
}
```

C# 类中生成的属性不是 .NET 日期和时间类型。 属性使用 `Google.Protobuf.WellKnownTypes` 命名空间中的 `Timestamp` 和 `Duration` 类。 这些类提供在 `DateTimeOffset`、`DateTime` 和 `TimeSpan` 之间进行转换的方法。

```c#
// Create Timestamp and Duration from .NET DateTimeOffset and TimeSpan.
var meeting = new Meeting
{
    Time = Timestamp.FromDateTimeOffset(meetingTime), // also FromDateTime()
    Duration = Duration.FromTimeSpan(meetingLength)
};

// Convert Timestamp and Duration to .NET DateTimeOffset and TimeSpan.
var time = meeting.Time.ToDateTimeOffset();
var duration = meeting.Duration?.ToTimeSpan();
```

### 可为 null 的类型

C# 的 Protobuf 代码生成使用本机类型，如 `int` 表示 `int32`。 因此这些值始终包括在内，不能为 `null`。

对于需要显式 `null` 的值（例如在 C# 代码中使用 `int?`），Protobuf 的“已知类型”包括编译为可以为 null 的 C# 类型的包装器。 若要使用它们，请将 `wrappers.proto` 导入到 `.proto` 文件中，如以下代码所示：

```protobuf
syntax = "proto3";

import "google/protobuf/wrappers.proto";

message Person {
    // ...
    google.protobuf.Int32Value age = 5;
}
```

`wrappers.proto` 类型不会在生成的属性中公开。 Protobuf 会自动将它们映射到 C# 消息中相应的可为 null 的 .NET 类型。 例如，`google.protobuf.Int32Value` 字段生成 `int?` 属性。 引用类型属性（如 `string` 和 `ByteString` ）保持不变，但可以向它们分配 `null`，这不会引发错误。

下表完整列出了包装器类型以及它们的等效 C# 类型：

| C# 类型      | 已知类型包装器                |
| :----------- | :---------------------------- |
| `bool?`      | `google.protobuf.BoolValue`   |
| `double?`    | `google.protobuf.DoubleValue` |
| `float?`     | `google.protobuf.FloatValue`  |
| `int?`       | `google.protobuf.Int32Value`  |
| `long?`      | `google.protobuf.Int64Value`  |
| `uint?`      | `google.protobuf.UInt32Value` |
| `ulong?`     | `google.protobuf.UInt64Value` |
| `string`     | `google.protobuf.StringValue` |
| `ByteString` | `google.protobuf.BytesValue`  |

### 小数

Protobuf 本身不支持 .NET `decimal` 类型，只支持 `double` 和 `float`。在 Protobuf 项目中，我们正在探讨这样一种可能性：将标准 decimal 类型添加到已知类型，并为支持它的语言和框架添加平台支持。尚未实现任何内容。

可以创建消息定义来表示 `decmial` 类型，以便在 .NET 客户端和服务器之间实现安全序列化。但其他平台上的开发人员必须了解所使用的格式，并能够实现自己对其的处理。

### 为 Protobuf 创建自定义 decimal 类型

```protobuf
package CustomTypes;

message DecimalValue {
	int64 units = 1;
	
	sfixed32 nanos = 2;
}
```

`nanos`字段表示从`0.999_999_999`到`-0.999_999_999`的值。例如，`decimal`值`1.5m`将表示`{ units = 1, nanos = 500_000_000 }`。这就是此示例中的 `nanos` 字段使用 `sfixed32` 类型的原因：对于较大的值，其编码效率比 `int32` 更高。 如果 `units` 字段为负，则 `nanos` 字段也应为负。

### 集合

#### 列表

Protobuf 中，在字段上使用`repeated`前缀关键字指定列表。以下示例演示如何创建列表：

```protobuf
message Person {
    // ...
	repeated string roles = 8;
}
```

在生产的代码中，`repeated`字段由`Google.Protobuf.Collections.RepeatedField<T>`泛型类型表示。

```c#
public class Person
{
    // ...
    public RepeatedField<string> Roles { get; }
}
```

`RepeatedField<T>`可实现 IList<T>。因此你可使用 LINQ 查询，或者将其转换为数组或列表。`RepeatedField<T>`属性没有公共 setter。项应添加到现有集合中。

```c#
var person = new Person();

person.Roles.Add("user");

var roles = new [] { "admin", "manager" };
person.Roles.Add(roles);
```

#### 字典

.NET IDictionary<TKey, TValue> 类型在 Protobuf 中使用 `map<key_type, value_type>`表示。

```protobuf
message Person {
	// ...
	map<string, string> attributes = 9;
}
```

在生成的 .NET 代码中，`map`字段由`Google.Protobuf.Collections.MapField<TKey, TValue>`泛型类型表示。

`MapField<TKey, TValue>`可实现 IDictionary<TKey, TValue>。与`repeated`属性一样，`map`属性没有公共 setter。项应添加到现有集合中。

```c#
var person = new Person();

person.Attributes["create_by"] = "James";

var attributes = new Dictionary<string, string>
{
    ["last_modified"] = DateTime.UtcNow.ToString()
};
person.Attributes.Add(attributes);
```

### 无结构的条件消息

Protobuf 是一种协定优先的消息传递格式。 构建应用时，必须在 `.proto` 文件中指定应用的消息，包括其字段和类型。 Protobuf 的协定优先设计非常适合强制执行消息内容，但可能会限制不需要严格协定的情况：

- 包含未知有效负载的消息。 例如，具有可以包含任何消息的字段的消息。
- 条件消息。 例如，从 gRPC 服务返回的消息可能是成功结果或错误结果。
- 动态值。 例如，具有包含非结构化值集合的字段的消息，类似于 JSON。

Protobuf 提供语言功能和类型来支持这些情况。

#### 任意

利用`Any`类型，可以将消息作为嵌入类型使用，而无需`.proto`定义。若使用`Any`类型，请导入`any.proto`。

```protobuf
import "google/protobuf/any.proto";

message Status {
	string message = 1;
	google.protobuf.Any detail = 2;
}
```



```c#
// Create a status with a Person message set to detail.
var status = new ErrorStatus();
status.Detail = Any.Pack(new Person { FirstName = "James" });

// Read Person message from detail.
if (status.Detail.Is(Person.Desciptor))
{
    var person = status.Detail.Unpack<Person>();
    // ...
}
```



## Dubbo 3

