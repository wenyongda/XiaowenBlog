---
title: JavaScript
date: 2023-11-18 10:30:31
author: 文永达
---
# 异步编程

## await

在JavaScript中，`await`关键字用于等待一个异步操作完成，并返回异步操作的结果。当遇到`await`关键字时，JavaScript引擎会暂停当前函数的执行，直到异步操作完成并返回结果。在等待异步操作的过程中，JavaScript引擎会继续执行其他代码。

因此，`await`关键字的执行顺序是从上到下的，即在遇到`await`关键字之前的代码会先执行，然后等待异步操作完成后，再执行`await`关键字之后的代码。如果在`await`关键字之前的代码中抛出了异常，那么`await`关键字之后的代码将不会执行。

在你提供的代码片段中，当遇到`await`关键字时，JavaScript引擎会等待`addCoCertification`或`updateCoCertification`函数完成，并返回它们的结果。在等待这些函数的过程中，JavaScript引擎会继续执行其他代码，例如设置`isAddedFile.value`和`dialogVisible.value`的值。当异步操作完成后，JavaScript引擎会继续执行`await`关键字之后的代码，例如显示成功消息。

总之，`await`关键字的执行顺序是从上到下的，即在遇到`await`关键字之前的代码会先执行，然后等待异步操作完成后，再执行`await`关键字之后的代码。

下面是一个简单的示例，演示了`await`关键字的执行顺序：

```javascript
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function example() {
  console.log('Start')

  await sleep(1000)
  console.log('After 1 second')

  await sleep(2000)
  console.log('After 2 more seconds')

  console.log('End')
}

example()
```

在这个示例中，我们定义了一个`sleep`函数，它返回一个Promise对象，并在指定的时间后将其状态设置为resolved。然后，我们定义了一个名为`example`的异步函数，它使用`await`关键字等待`sleep`函数完成，并在控制台中打印一些消息。在`example`函数中，我们使用`await`关键字等待`sleep(1000)`函数完成，并在1秒后打印"After 1 second"。然后，我们再次使用`await`关键字等待`sleep(2000)`函数完成，并在2秒后打印"After 2 more seconds"。最后，我们在控制台中打印"End"。

当我们调用`example`函数时，JavaScript引擎会执行`console.log('Start')`语句，然后等待`sleep(1000)`函数完成。在等待的过程中，JavaScript引擎会继续执行其他代码，但是当`sleep(1000)`函数完成后，JavaScript引擎会继续执行`await`关键字之后的代码，即打印"After 1 second"。然后，JavaScript引擎会等待`sleep(2000)`函数完成，并在2秒后打印"After 2 more seconds"。最后，JavaScript引擎会打印"End"。

---



在同步方法中使用`await`关键字是不合法的，因为`await`只能在异步函数中使用。如果你在同步函数中使用`await`关键字，它会被视为普通的表达式，不会暂停当前函数的执行。

如果你需要在同步函数中等待一个异步操作完成，你可以使用`Promise`对象和`then`方法来实现。例如，你可以将异步操作封装在一个`Promise`对象中，并在`then`方法中处理结果。下面是一个示例：

```javascript
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function example() {
  console.log('Start')

  sleep(1000).then(() => {
    console.log('After 1 second')
    return sleep(2000)
  }).then(() => {
    console.log('After 2 more seconds')
    console.log('End')
  })
}

example()
```

在这个示例中，我们定义了一个`sleep`函数，它返回一个Promise对象，并在指定的时间后将其状态设置为resolved。然后，我们定义了一个名为`example`的同步函数，它使用`Promise`对象和`then`方法等待`sleep`函数完成，并在控制台中打印一些消息。在`example`函数中，我们使用`sleep(1000).then()`方法等待`sleep(1000)`函数完成，并在1秒后打印"After 1 second"。然后，我们再次使用`then`方法等待`sleep(2000)`函数完成，并在2秒后打印"After 2 more seconds"和"End"。

当我们调用`example`函数时，JavaScript引擎会执行`console.log('Start')`语句，然后等待`sleep(1000)`函数完成。在等待的过程中，JavaScript引擎会继续执行其他代码，但是当`sleep(1000)`函数完成后，JavaScript引擎会执行`then`方法中的代码，即打印"After 1 second"。然后，JavaScript引擎会等待`sleep(2000)`函数完成，并在2秒后打印"After 2 more seconds"和"End"。

# 数组

## map

`map`方法会对数组中的每个元素都执行一个回调函数，并返回一个新的数组，新数组中的元素是回调函数的返回值。`map`方法不会改变原始数组，而是返回一个新的数组。下面是一个使用`map`方法的示例：

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubledNumbers = numbers.map((number) => number * 2);
console.log(doubledNumbers); // [2, 4, 6, 8, 10]
```

在这个示例中，我们使用`map`方法将数组中的每个元素都乘以2，并返回一个新的数组`doubledNumbers`。

## filter

`filter`方法会对数组中的每个元素都执行一个回调函数，并返回一个新的数组，新数组中的元素是回调函数返回`true`的元素。`filter`方法不会改变原始数组，而是返回一个新的数组。下面是一个使用`filter`方法的示例：

```javascript
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter((number) => number % 2 === 0);
console.log(evenNumbers); // [2, 4]
```

在这个示例中，我们使用`filter`方法筛选出数组中的偶数，并返回一个新的数组`evenNumbers`。

总之，`map`和`filter`都是JavaScript中常用的数组方法，它们可以用于对数组进行转换和筛选。`map`方法会对数组中的每个元素都执行一个回调函数，并返回一个新的数组，新数组中的元素是回调函数的返回值。`filter`方法会对数组中的每个元素都执行一个回调函数，并返回一个新的数组，新数组中的元素是回调函数返回`true`的元素。

## reduce

`reduce()` 函数是 JavaScript 中的一个高阶函数，它可以将一个数组中的所有元素通过一个函数进行累加，最终返回一个累加结果。`reduce()` 函数接收两个参数：一个**回调函数**和一个**初始值**。回调函数接收四个参数：**累加器**、**当前元素**、**当前索引**和**原始数组**。在每次迭代中，回调函数都会将累加器和当前元素作为参数，并返回一个新的累加器值。最终，`reduce()` 函数返回最后一次调用回调函数时的累加器值。

```javascript
const numbers = [65, 44, 12, 4]
// total为 累加器 item为当前元素
// 0 为初始值，也就是 从什么值开始累加
const totalNumber = () => {
    return numbers.reduce((total, item) => {
        return total + item
    }, 0)
}
```



# 循环

## for...in

`for...in`语句用于遍历对象的可枚举属性，包括对象自身的属性和继承的属性。在遍历时，`for...in`会将属性名作为变量传递给循环体，因此我们可以通过属性名来访问属性的值。下面是一个使用`for...in`语句遍历对象的示例：

```javascript
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
  console.log(key, obj[key]);
}
// Output:
// a 1
// b 2
// c 3
```

在这个示例中，我们使用`for...in`语句遍历对象`obj`的属性，并将属性名作为变量`key`传递给循环体。在循环体中，我们可以通过`obj[key]`来访问属性的值。

## for...of

`for...of`语句用于遍历可迭代对象，包括数组、字符串、Map、Set等。在遍历时，`for...of`会将元素的值作为变量传递给循环体，因此我们可以直接访问元素的值。下面是一个使用`for...of`语句遍历数组的示例：

```javascript
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item);
}
// Output:
// 1
// 2
// 3
```

在这个示例中，我们使用`for...of`语句遍历数组`arr`的元素，并将元素的值作为变量`item`传递给循环体。在循环体中，我们可以直接访问元素的值。

总之，`for...in`和`for...of`都是JavaScript中用于遍历数据结构的循环语句，但它们的作用和用法有所不同。`for...in`语句用于遍历对象的可枚举属性，而`for...of`语句用于遍历可迭代对象的元素。

# 下载文件

## Url转Blob

```javascript
// xhr
function urlToBlob(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.onload = function() {
    if (xhr.status === 200) {
      var blob = xhr.response;
      callback(null, blob);
    } else {
      callback(new Error('Unable to fetch blob'));
    }
  };

  xhr.onerror = function() {
    callback(new Error('Network error'));
  };

  xhr.send();
}
// fetch
function urlToBlob(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Unable to fetch blob');
      }
      return response.blob();
    });
}
```

# 匿名函数和箭头函数

## 区别

匿名函数和箭头函数都是JavaScript中的函数形式，它们之间有一些重要的区别。

1. 语法结构：匿名函数使用`function`关键字来定义，后面跟随函数名称（可选），参数列表和函数体。例如：

```javascript
var anonymousFunc = function(arg1, arg2) {
  // 函数体
};
```

而箭头函数使用箭头操作符（`=>`）来定义，后面跟随参数列表和箭头函数体。没有显式的函数名称。例如：

```javascript
var arrowFunc = (arg1, arg2) => {
  // 函数体
};
```

2. `this` 的指向：在匿名函数中，`this` 的指向是动态的，根据函数的调用方式而定。而在箭头函数中，`this` 的指向是词法作用域的，它继承自外围作用域。箭头函数没有自己的 `this` 值，它会使用外围作用域的 `this` 值。这使得箭头函数在处理函数上下文时更加方便。

3. `arguments` 对象：匿名函数中可以使用 `arguments` 对象访问函数的参数列表。而箭头函数没有自己的 `arguments` 对象，它会继承外围作用域中的 `arguments` 对象。

4. 构造函数：匿名函数可以用作构造函数来创建新对象。而箭头函数没有原型对象，因此不能用作构造函数，尝试使用 `new` 关键字调用箭头函数会抛出错误。

5. 箭头函数的简洁语法：箭头函数提供了更简洁的语法，尤其是在处理简单的函数体时。当函数体只有一条表达式时，可以省略花括号和 `return` 关键字，并将表达式的结果隐式返回。

这些是匿名函数和箭头函数之间的一些主要区别。选择使用哪种函数形式取决于具体的使用场景和需求。匿名函数适用于更传统的函数定义和需要动态 `this` 指向的情况，而箭头函数则提供了更简洁的语法和更方便的函数上下文处理。

# 运算符

## ~

在 JavaScript 中，`~` 符号是按位取反运算符。它将操作数的每个二进制位取反，即将 0 变为 1，将 1 变为 0。然后返回这个值的负数加一。

例如，对于十进制数 10，它的二进制表示为 1010，按位取反后变为 0101，即 5。因此，`~10` 的结果为 -11。

# 性能优化

## 防抖（debounce）

> 多次触发 只执行最后一次

**作用：**高频率触发的事件，在指定的单位时间内，只相应最后一次，如果在指定时间内再次触发，则重新计算时间。

防抖类似于英雄联盟回城6秒，如果回城中被打断，再次回城需要再等6秒

![image-20230918145946833](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230918145946833.png)

**实现代码：**

```javascript
<body>
    <input type="text" id="inp">
    <script>

        // 1.封装防抖函数
        function debounce(fn, time) {
            // 4.创建一个标记用来存放定时器的返回值
            let timeout = null;
            return function () {
                // 5.每当用户触发input事件  把前一个 setTimeout 清楚掉
                clearTimeout(timeout);
                // 6.然后又创建一个新的 setTimeout, 这样就能保证输入字符后等待的间隔内 还有字符输入的话，就不会执行 setTimeout里面的内容
                timeout = setTimeout(() => {
                    // 7.这里进行防抖的内容
                    fn();
                }, time);
            };
        }

        // 2.获取inpt元素
        var inp = document.getElementById('inp');
		// 8. 测试防抖临时使用的函数
        function sayHi() {
            console.log('防抖成功');
        }
        // 3.给inp绑定input事件  调用封装的防抖函数  传入要执行的内容与间隔事件
        inp.addEventListener('input', debounce(sayHi, 5000));

    </script>
</body>
```

**使用场景：**

search搜索时，用户在不断输入值时，用防抖来节约请求资源。

## 节流（throttle）

> 规定时间内 只触发一次

**作用：**高频率触发的事件，在指定的单位时间内，只响应第一次

节流类似于英雄联盟里的技能 触发一次必须等技能刷新后才能再次触发

![image-20230918151523728](https://markdownhexo.oss-cn-hangzhou.aliyuncs.com/img/image-20230918151523728.png)

**实现代码：**

```javascript
<script>
    // 1.封装节流函数
    function throttle(fn, time) {
        //3. 通过闭包保存一个 "节流阀" 默认为false
        let temp = false;
        return function () {
            //8.触发事件被调用 判断"节流阀" 是否为true  如果为true就直接trurn出去不做任何操作
            if (temp) {
                return;
            } else {
                //4. 如果节流阀为false  立即将节流阀设置为true
                temp = true; //节流阀设置为true
                //5.  开启定时器
                setTimeout(() => {
                    //6. 将外部传入的函数的执行放在setTimeout中
                    fn.apply(this, arguments);
                    //7. 最后在setTimeout执行完毕后再把标记'节流阀'为false(关键)  表示可以执行下一次循环了。当定时器没有执行的时候标记永远是true，在开头被return掉
                    temp = false;
                }, time);
            }
        };
    }
    function sayHi(e) {
        // 打印当前 document 的宽高
        console.log(e.target.innerWidth, e.target.innerHeight);
    }
    // 2.绑定事件，绑定时就调用节流函数
    // 敲黑板！！！ 这里是重点 绑定是就要调用一下封装的节流函数 触发事件是触发封装函数内部的函数
    window.addEventListener('resize', throttle(sayHi, 2000));
</script>
```

**使用场景：**

鼠标不断点击触发，mousedown（单位时间内只触发一次）

监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断

# Map 键值对

## 遍历MAP

### keys() 方法

该方法返回一个新的迭代器对象，它包括`Map`对象中每个元素的键。

```js
const map = new Map();
map.set('name', 'Alice');
map.set('age', 25);

for (const key of map.keys()) {
  console.log(key);
}
// 输出：'name' 'age'
```

### values() 方法

该方法返回一个新的迭代器对象，它包括`Map`对象中每个元素的值。

```js
const map = new Map();
map.set('name', 'Alice');
map.set('age', 25);

for (const value of map.values()) {
  console.log(value);
}
// 输出：'Alice' 25
```

### entries() 方法

该方法返回一个新的迭代器对象，它包括`Map`对象中每个元素的键值对。

```js
const map = new Map();
map.set('name', 'Alice');
map.set('age', 25);

for (const [key, value] of map.entries()) {
  console.log(key + ': ' + value);
}
// 输出：'name: Alice' 'age: 25'
```

### forEach() 方法

此方法接受一个回调函数作为参数，`Map`对象中的每个元素都会调用一次这个回调函数。回调函数中的参数依次为：`value`、`key`、`mapObject`。

```js
const map = new Map();
map.set('name', 'Alice');
map.set('age', 25);

map.forEach((value, key) => {
  console.log(key, value);
});
// 输出：'name' 'Alice' 'age' 25
```

## 进阶用法

### Map 和 Array 的相互转化

有时我们需要在 `Map` 和 `Array` 之间相互转化，比如将数组转换为字典，或者从字典转换为数组时，我们就可以结合 `Array` 构造函数和扩展运算符来实现。

```js
let kvArray = [['key1', 'value1'], ['key2', 'value2']];
let myMap = new Map(kvArray);
console.log(myMap); // Map(2) {"key1" => "value1", "key2" => "value2"}

let arrayFromMap = Array.from(myMap);
console.log(arrayFromMap); // [["key1", "value1"], ["key2", "value2"]]
```

### Map 的合并和复制