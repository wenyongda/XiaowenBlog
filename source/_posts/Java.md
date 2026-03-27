---
title: Java
date: 2023-06-09 10:30:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/B18FCBB3-67FD-48CC-B4F3-457BA145F17A.jpeg
---

# Spring Boot

## Hikari数据库连接池

### 配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/yami_shops?allowMultiQueries=true&useSSL=false&useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&zeroDateTimeBehavior=convertToNull&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8&nullCatalogMeansCurrent=true
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.zaxxer.hikari.HikariDataSource
    hikari:
      minimum-idle: 0
      maximum-pool-size: 20
      idle-timeout: 10000
      connection-test-query: select 1
```

## logback日志框架

### 配置

## 

# 开源框架若依 RuoYi

### 替换Mybatis为Mybatis-Plus

# Java SE

## 注解

### 注解语法

同class和interface一样，注解也属于一种类型。

### 注解定义

注解通过@interface关键字进行定义。

```java
@TestAnnotation
public class Test {
    
}
```

创建一个类Test，然后在类定义的地方加上@TestAnnotation就可以用TestAnnotation注解这个类了。

可以简单理解为将 TestAnnotation这张标签贴到 Test这个类上面。

要想注解能够正常工作，还有一个元注解

### 元注解

元注解是可以注解到注解上的注解，或者说元注解是一种基本注解，但是它能够应用到其他的注解上面。

元注解也是一张标签，但是它是一张特殊的标签，它的作用和目的就是给其他普通的标签进行解释说明的。

元标签有 @Retention、@Documented、@Target、@Inherited、@Repeatable 5种

#### @Retention

Retention的英文意为保留期的意思。当@Retention应用到一个注解上的时候，它解释说明了这个注解的存活时间。

它的取值如下：

- RetentionPolicy.SOURCE 注解只在源码阶段保留，在编译器进行编译时它将被丢弃忽视。
- RetentionPolicy.CLASS 注解只被保留到编译进行的时候，它不会被加载到JVM中。
- RetentionPolicy.RUNTIME 注解可以保留到程序运行的时候，它会被加载进入到JVM中，所以在程序运行时可以获取到它们。

@Retention 去给一张标签解释的时候，它指定了这张标签张贴的时间。@Retention 相当于给一张标签上面盖了一张时间戳，时间戳指明了标签张贴的时间周期。

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface TestAnnotation {
    
}
```

指定 TestAnnotation 可以在程序运行周期被获取到，因此它的生命周期非常长。

#### @Documented

这个元注解和文档有关。它的作用是能够将注解中的元素包含到JavaDoc中去

#### @Target

Target 是目标的意思，@Target 制定了注解运用的地方。

当一个注解被 @Target 注解时，这个注解就被限定了运用的场景。

类比到标签，原本标签想张贴到哪个地方就到哪个地方，但是因为 @Target 的存在，它张贴的地方就非常具体了，比如只能张贴到方法上、类上、方法参数上等等。@Target 有下面的取值

- ElementType.ANNOTATION_TYPE 可以给一个注解进行注解
- ElementType.CONSTRUCTUR 可以给构造方法进行注解
- ElementType.FIELD 可以给属性进行注解
- ElementType.LOCAL_VARIABLE 可以给局部变量进行注解
- ElementType.METHOD 可以给方法进行注解
- ElementType.PACKAGE 可以给一个包进行注解
- ElementType.TYPE 可以给一个类型进行注解，比如类、接口、枚举

#### @Inherited

Inherited 是继承的意思，但是它并不是说注解本身可以继承，而是说如果一个超类被 @Inherited 注解过的注解进行注解的话，那么如果它的子类没有被任何注解应用的话，那么这个子类就继承了超类的注释。

```java
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@interface Test {}
@Test
public class A {}
public class B extends A {}
```

注解 Test 被 @Inherited 修饰，之后类A 被 Test 注解，类 B 基础 A，类B 也拥有 Test 这个注解。

可以这样理解：

老子非常有钱，所以人们给他贴了一张标签叫做富豪。

老子的儿子长大后，只要没有和老子断绝父子关系，虽然别人没有给他贴标签，但是他自然也是富豪。

老子的孙子长大了，自然也是富豪。

这就是人们口中戏称的富一代，富二代，富三代。虽然叫法不同，好像好多个标签，但其实事情的本质也就是他们有一张共同的标签，也就是老子身上的那张富豪的标签。

#### @Repeatable

Repeatable 自然是可重复的意思。@Repeatable 是Java 1.8 才加进来的，所以算是一个新的特性。

什么样的注解或被多次运用呢？通常是注解的值可以同时取多个。

举个例子，一个人他既是程序员又是产品经理，同时他还是个画家。

```java
@interface Persons {
    Person[] value();
}
@Repeatable(Persons.class)
@interface Person {
    String role default "";
}
@Person(role="artist")
@Person(role="coder")
@Person(role="PM")
public class SuperMan {
}
```

@Repeatable 注解了Persion。而@Repeatable 后面括号中的类相当于一个容器注解。

什么是容器注解呢？就是用来存放其他注解的地方。它本身是一个注解。

相关容器注解

```java
@interface Persons {
    Person[] value();
}
```

按照规定，它里面必须要有一个 value 的属性，属性类型是一个被 @Repeatable 注解过的注解数组，注意它是数组。

Persons 是一张总的标签，上面贴满了Person这种同类型但内容不一样的标签。把Persons 给一个 SuperMan 贴上，相当于同时给他贴了程序员、产品经理、画家的标签。

我们可能对于 @Person(role="PM")括号里面的内容感兴趣，它其实就是给 Person 这个注解的 role 属性赋值为 PM

### 注解的属性

注解的属性也叫做成员变量。注解只要成员变量，没有方法。注解的成员变量在注解的定义中“无形参方法”形式来声明，其方法名定义了该成员变量的名字，其返回值定义了该成员变量的类型。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TestAnnotation {
    int id();
    String msg();
}
```

上面代码定义了 TestAnnotation 这个注解拥有 id 和 msg 两个属性。在使用的时候，我们应该给它们进行赋值。

赋值的方式是在注解的括号内以 value="" 形式，多个属性之前用 , 隔开。

```java
@TestAnnotation(id=3, msg="hello annotation")
public class Test {
}
```

## 多线程

### 线程安全

#### 概念

线程安全是多线程编程的一个概念。在拥有共享数据的多条线程并行执行的程序中，线程安全的代码会通过同步机制保证各个线程都可以正常且准确的执行，不会出现数据污染等意外情况。上述是百度百科给出的一个概念解释。换言之，线程安全就是某个函数在并发环境中调用时，能够处理好多个线程之间的共享变量，是程序能够正确执行完毕。也就是说我们想要确保在多线程访问的时候，我们的程序还能够按照我们预期的行为去执行，那么就是线程安全了。

#### 导致线程不安全的原因

首先，可以来看一段代码，来看看是不是线程安全的，代码如下：

```java
package com.company;

public class TestThread {

    private static class XRunnable implements Runnable{
        private int count;
        public void run(){
            for(int i= 0; i<5; i++){
                getCount();
            }
        }

        public void getCount(){
            count++;
            System.out.println(" "+count);
        }
    }

    public static void main(String[] args) {
        XRunnable runnable = new XRunnable();
        Thread t1 = new Thread(runnable);
        Thread t2 = new Thread(runnable);
        Thread t3 = new Thread(runnable);
        t1.start();
        t2.start();
        t3.start();
    }
}
```

输出的结果为：

```java
2
3
2
5
4
7
6
10
11
12
9
8
13
14
15
```

从代码上进行分析，当启动了三个线程，每个线程应该都是循环5次得出1到15的结果，但是从输出的结果，就可以看到有两个2的输出，出现像这种情况表明这个方法根本就不是线程安全的。我们可以这样理解：在每个进程的内存空间中都会有一块特殊的公共区域，通常称为**堆(内存)**,之所以会输出两个2，是因为每个进程的所有线程都可以访问到该区域，当第一个线程已经获得2这个数了，还没来得及输出，下一个线程在这段时间的空隙获得了2这个值，故输出时会输出2的值。

#### 线程安全问题

要考虑线程安全问题，就需要先考虑Java并发的三大基本特征：**原子性**、**可见性**以及**有序性**

- 原子性

原子性是指在一个操作中就是cpu不可以在中途暂停然后再调度，即不被中断操作，要不全部执行完成，要不都不执行。就好比转账，从账户A向账户B转1000元，那么必然包括2个操作：从账户A减去1000元，往账户B加上1000元。2个操作必须全部完成。

那程序中原子性指的是最小操作单元，比如自增操作，它本身其实并不是原子性操作，分了3步的，包括读取变量的原始值、进行加1操作、写入工作内存。所以在多线程中，有可能一个线程还没自增完，可能才执行到第二步，另一个线程就已经读取了值，导致结果错误。那如果我们能保证自增操作是一个原子性的操作，那么就能保证其他线程读取到的一定是自增后的数据。

- 可见性

当多个线程访问同一个变量时，一个线程修改了这个变量的值，其他线程能够立即看得到修改的值。

若两个线程在不同的cpu，那么线程1改变了i得值还没刷新到主存，线程2又使用了i，那么这个i值肯定还是之前的，线程1对变量的修改，线程没看到这就是可见性的问题。

- 有序性

程序执行的顺序按照代码的先后顺序执行，在多线程编程时就得考虑这个问题。

**案例**： **抢票**

当多个线程同时共享，同一个全局变量或静态变量（即局部变量不会），做写的操作时，可能会发生数据冲突问题，也就是线程安全问题。但是做读操作是不会发生数据冲突问题。

Consumer类：

```java
package com.company;

public class Consumer implements Runnable{

    private int ticket = 100;

    public void run(){
        while(ticket>0){
            System.out.println(Thread.currentThread().getName() + "售卖第" + (100-ticket+1) + "张票");
            ticket--;
        }
    }

}
```

主类：
```java
package com.company;

public class ThreadSafeProblem {
    public static void main(String[] args){
        Consumer abc = new Consumer();

        new Thread(abc, "窗口1").start();
        new Thread(abc, "窗口2").start();
    }
}
```

结果：

```shell
窗口2售卖第95张票
窗口2售卖第96张票
窗口2售卖第97张票
窗口2售卖第98张票
窗口2售卖第99张票
窗口2售卖第100张票
窗口2售卖第84张票
```

从输出结果来看，售票窗口买票出现了计票的问题，这就是线程安全出现问题了。

#### 如何确保线程安全

解决办法：使用多线程之间使用**关键字synchronized**、或者使用**锁（lock）**，或者**volatile关键字**。

1. **synchronized**（自动锁，锁的创建和释放都是自动的）
2. **lock 手动锁**（手动指定锁的创建和释放）
3. **volatile关键字**

为什么能解决？如果可能会发生数据冲突问题（线程不安全问题），只能让当前一个线程进行执行。代码执行完成后释放锁，然后才能让其他线程进行执行。这样的话就可以解决线程不安全问题。

##### synchronized关键字

###### 同步代码块

```java
synchronized(同一个锁){
    //可能发生线程冲突问题
}
```

将可能会发生线程安全问题的代码，给包括起来，也称为**同步代码块**。synchronized使用的锁可以是对象锁也可以是静态资源，如xxx.class，只有持有锁的线程才能执行同步代码块中的代码。没持有锁的线程即使获取cpu的执行权，也进不去。

锁的释放是在synchronized同步代码块执行完毕后自动释放。

同步的前提：

1. 必须要有两个或两个以上的线程，如果小于2个线程，则没有用，且还会消耗性能（获取锁，释放锁）

2. 必须是多个线程使用一个锁
   **弊端**：多个线程需要判断锁，较为消耗资源、抢锁的资源。
   例子：

   ```java
   public class ThreadSafeProblem {
       public static void main(String[] args) {
           Consumer abc = new Consumer();
           // 注意要使用同一个abc变量作为thread的参数
           // 如果你使用了两个Consumer对象，那么就不会共享ticket了，就自然不会出现线程安全问题
           new Thread(abc, "窗口1").start();
           new Thread(abc, "窗口2").start();
       }
   }
   class Consumer implements Runnable{
       private int ticket = 100;
       @Override
       public void run() {
           while (ticket > 0) {
               synchronized (Consumer.class) {
                   if (ticket > 0) {
                       System.out.println(Thread.currentThread().getName() + "售卖第" + (100-ticket+1) + "张票");
                       ticket--;
                   }
               }
           }
       }
   }
   ```

###### 同步函数

就是将synchronized加在方法上。

分为两种：

第一种是**非静态同步函数**，即方法是非静态的，使用的**this对象锁**，如下代码所示

第二种是**静态同步函数**，即方法是用static修饰的，使用的锁是**当前类的class文件（xxx.class）**。

```java
public synchronized void sale () {
        if (ticket > 0) {
            System.out.println(Thread.currentThread().getName() + "售卖第" + (100-ticket+1) + "张票");
            ticket--;
    	}
}
```

###### 多线程死锁线程

如下代码所示，

线程t1，运行后在同步代码块中需要oj对象锁，，运行到sale方法时需要this对象锁

线程t2，运行后需要调用sale方法，需要先获取this锁，再获取oj对象锁

那这样就会造成，两个线程相互等待对方释放锁。就造成了死锁情况。简单来说就是：

同步中嵌套同步,导致锁无法释放。

```java
class ThreadTrain3 implements Runnable {
    private static int count = 100;
    public boolean flag = true;
    private static Object oj = new Object();
    @Override
    public void run() {
        if (flag) {
            while (true) {
                synchronized (oj) {
                    sale();
                }
            }
 
        } else {
            while (true) {
                sale();
            }
        }
    }
 
    public static synchronized void sale() {
        // 前提 多线程进行使用、多个线程只能拿到一把锁。
        // 保证只能让一个线程 在执行 缺点效率降低
        synchronized (oj) {
            if (count > 0) {
                try {
                    Thread.sleep(50);
                } catch (Exception e) {
                    // TODO: handle exception
                }
                System.out.println(Thread.currentThread().getName() + ",出售第" + (100 - count + 1) + "票");
                count--;
            }
        }
    }
}
 
public class ThreadDemo3 {
    public static void main(String[] args) throws InterruptedException {
        ThreadTrain3 threadTrain1 = new ThreadTrain3();
        Thread t1 = new Thread(threadTrain1, "①号窗口");
        Thread t2 = new Thread(threadTrain1, "②号窗口");
        t1.start();
        Thread.sleep(40);
        threadTrain1.flag = false;
        t2.start();
    }
}
```

##### Lock

可以视为**synchronized的增强版**，提供了更灵活的功能。该接口提供了限时锁等待、锁中断、锁尝试等功能。**synchronized**实现的同步代码块，它的锁是自动加的，且当执行完同步代码块或者抛出异常后，锁的释放也是自动的。

```java
Lock l = ...;
 l.lock();
 try {
   // access the resource protected by this lock
 } finally {
   l.unlock();
 }
```

但是**Lock锁**是需要手动去加锁和释放锁，所以**Lock**相比于**synchronized**更加的灵活。且还提供了更多的功能比如说

**tryLock()方法**会尝试获取锁，如果锁不可用则返回false，如果锁是可以使用的，那么就直接获取锁且返回true，官方代码如下：

```java
Lock lock = ...;
 if (lock.tryLock()) {
   try {
     // manipulate protected state
   } finally {
     lock.unlock();
   }
 } else {
   // perform alternative actions
 }
```

例子：

```java
/*
 * 使用ReentrantLock类实现同步
 * */
class MyReenrantLock implements Runnable{
    //向上转型
    private Lock lock = new ReentrantLock();
    public void run() {
        //上锁
        lock.lock();
        for(int i = 0; i < 5; i++) {
            System.out.println("当前线程名： "+ Thread.currentThread().getName()+" ,i = "+i);
        }
        //释放锁
        lock.unlock();
    }
}
public class MyLock {
    public static void main(String[] args) {
        MyReenrantLock myReenrantLock =  new MyReenrantLock();
        Thread thread1 = new Thread(myReenrantLock);
        Thread thread2 = new Thread(myReenrantLock);
        Thread thread3 = new Thread(myReenrantLock);
        thread1.start();
        thread2.start();
        thread3.start();
    }
}
```

输出结果：

由此我们可以看出，只有当当前线程打印完毕后，其他的线程才可继续打印，线程打印的数据是分组打印，因为当前线程持有锁，但线程之间的打印顺序是随机的。

即调用**lock.lock()** 代码的线程就持有了“对象监视器”，其他线程只有等待锁被释放再次争抢。

##### volatile关键字

先来看一段错误的代码示例：

```java
class ThreadVolatileDemo extends Thread {
    public boolean flag = true;
 
    @Override
    public void run() {
        System.out.println("子线程开始执行");
        while (flag) {
        }
        System.out.println("子线程执行结束...");
    }
    public void setFlag(boolean flag){
        this.flag=flag;
    }
 
}
 
public class ThreadVolatile {
    public static void main(String[] args) throws InterruptedException {
              ThreadVolatileDemo threadVolatileDemo = new ThreadVolatileDemo();
              threadVolatileDemo.start();
              Thread.sleep(3000);
              threadVolatileDemo.setFlag(false);
              System.out.println("flag已被修改为false!");
    }
}
```

输出结果：

```shell
子线程开始执行
flag已被修改为false
```

虽然flag已被修改，但是子线程依然在执行，这里产生的原因就是**Java内存模型（JMM）** 导致的。

虽然flag已被修改，但是子线程依然在执行，这里产生的原因就是**Java内存模型（JMM）** 导致的。

这里再来介绍一下**Java内存模型**吧！！!

在**Java内存模型**规定了所有的变量（这里的变量是指成员变量，静态字段等但是不包括局部变量和方法参数，因为这是线程私有的）都存储在**主内存**中，每条线程还有自己的**工作内存**，线程的工作内存中拷贝了该线程使用到的主内存中的变量（只是副本，从主内存中拷贝了一份，放到了线程的本地内存中），**线程对变量的所有操作都必须在工作内存中进行，而不能直接读写主内存。** 不同的线程之间也无法直接访问对方工作内存中的变量，**线程间变量的传递均需要自己的工作内存和主存之间进行数据同步进行**。

而JMM就作用于工作内存和主存之间数据同步过程。他规定了如何做数据同步以及什么时候做数据同步。

**1. 首先要将共享变量从主内存拷贝到线程自己的工作内存空间，工作内存中存储着主内存中的变量副本拷贝；**

**2. 线程对副本变量进行操作，（不能直接操作主内存）；**

**3. 操作完成后通过JMM 将线程的共享变量副本与主内存进行数据的同步，将数据写入主内存中；**

**4. 不同的线程间无法访问对方的工作内存，线程间的通信(传值)必须通过主内存来完成。**

当多个线程同时访问一个数据的时候，可能本地内存没有及时刷新到主内存，所以就会发生线程安全问题

**JMM是在线程调run方法的时候才将共享变量写到自己的线程本地内存中去的，而不是在调用start方法的时候。**

**解决办法**：

当出现这种问题时，就可以使用**Volatile关键字**进行解决。

**Volatile 关键字的作用**是变量在多个线程之间可见。使用**Volatile关键字**将解决线程之间可见性，**强制线程每次读取该值的时候都去“主内存”中取值**。

只需要在flag属性上加上该关键字即可。

```java
public volatile boolean flag = true;
```

子线程每次都不是读取的线程本地内存中的副本变量了，而是直接读取主内存中的属性值。

volatile虽然**具备可见性**，但是**不具备原子性**。

##### synchronized、volatile和Lock之间的区别

**synochronizd和volatile关键字区别：**

1. **volatile关键字**解决的是变量在多个线程之间的可见性；而**sychronized关键字**解决的是多个线程之间访问共享资源的同步性。

   > **tip：** final关键字也能实现可见性：被final修饰的字段在构造器中一旦初始化完成，并且构造器没有把 **“this”**的引用传递出去（this引用逃逸是一件很危险的事情，其它线程有可能通过这个引用访问到了"初始化一半"的对象），那在其他线程中就能看见final；

2. **volatile**只能用于修饰变量，而**synchronized**可以修饰方法，以及代码块。（**volatile**是线程同步的轻量级实现，所以**volatile**性能比**synchronized**要好，并且随着JDK新版本的发布，**sychronized关键字**在执行上得到很大的提升，在开发中使用**synchronized关键字**的比率还是比较大）；

3. 多线程访问**volatile**不会发生阻塞，而**sychronized**会出现阻塞；

4. 多线程访问**volatile**不会发生阻塞，而**sychronized**会出现阻塞；

5. **线程安全**包含**原子性**和**可见性**两个方面。

   对于用**volatile**修饰的变量，JVM虚拟机只是保证从主内存加载到线程工作内存的值是最新的。

   **一句话说明volatile的作用**：实现变量在多个线程之间的可见性。

   **synchronized和lock区别：**

   1. **Lock**是一个接口，而**synchronized**是Java中的关键字，**synchronized**是内置的语言实现；
   2. **synchronized**在发生异常时，会自动释放线程占有的锁，因此不会导致死锁现象发生；而**Lock**在发生异常时，如果没有主动通过**unLock()**去释放锁，则很可能造成死锁现象，因此使用**Lock**时需要在**finally**块中释放锁；
   3. **Lock**可以让等待锁的线程响应中断，而**synchronized**却不行，使用**synchronized**时，等待的线程会一直等待下去，不能够响应中断；
   4. 通过**Lock**可以知道有没有成功获取锁，而**synchronized**却无法办到。
   5. **Lock**可以提高多个线程进行读操作的效率（读写锁）。

   **在性能上来说**，如果竞争资源不激烈，两者的性能是差不多的，而当竞争资源非常激烈时（即有大量线程同时竞争），此时**Lock**的性能要远远优于**synchronized**。所以说，在具体使用时要根据适当情况选择。

## 匿名内部类

匿名内部类是一种特殊的类定义方式，它没有明确的类名，且在定义的同时就实例化了这个类的对象。在Java中，匿名内部类常常用于简化只使用一次的类的创建过程，尤其是在只需要实现单个接口或继承单一父类的情况下。

```java
streamSource.keyBy(new KeySelector<String, String>() {
    @Override
    public String getKey(String s) throws Exception {
        int i = Integer.parseInt(s);
        return i > 500 ? "ge" : "lt";
    }
})
```

这里的 new KeySelector<String, String>() {...} 就是一个匿名内部类的实例。具体来说：

- KeySelector 是一个接口（或抽象类）。
- 匿名内部类实现了 KeySelector 接口，并重写了其中的 getKey 方法。
- 因为并没有给这个类命名，所以在创建对象时直接定义其实现细节，而不需要先定义一个单独的类。
- 这个匿名内部类实例随后作为参数传递给 streamSource.keyBy(...) 方法，说明了它是根据运行时需求即时创建并使用的。
