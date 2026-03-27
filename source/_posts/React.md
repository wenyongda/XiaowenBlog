---
title: React
date: 2025-07-23 15:56:46
tags:
---

# Vue 转 React 指南

## JSX

先介绍 React 唯一的一个语法糖：JSX。

理解 JSX 语法并不困难，简单记住一句话，遇到 `{}` 符号内部解析为 JS 代码，遇到成对的 `<>` 符号内部解析为 HTML 代码。

当你写下这个 React 组件时：

```jsx
import React from 'react';

function MyComponent(props) {
    return <div>{props.hello}</div>
}
```

最终会被自动工具翻译成：

```jsx
import React from 'react';

function MyComponent(props) {
    return React.createElement('div', null, props.hello);
}
```

React 就是通过这个小小语法糖，实现在 JS 里面写 HTML，可能有小伙伴会说 HTML 与 JS 分离不是更好吗？责职分明，混合只会更乱。但当你体验到代码自动提示，自动检查，以及调试时精确定位到一行代码的好处时，就清楚 React 和 Vue 的差距了。

## 文本插值

**vue种采用双括号**

```vue
<span>Message: {{ msg }}</span>
```

**react采用单括号**

```jsx
function MyComponent(props) {
    let msg = 'XXX'
    return <div>{ msg }</div>
}
```

## Attribute 绑定

**vue中 想要响应式地绑定一个 attribute，应该使用 `v-bind` 指令**

```vue
<div v-bind:id="dynamicId"></div>
<div :id="dynamicId"></div>
```

**react中，使用单引号，或者使用单括号包裹表示动态绑定**

```jsx
function App () {
  let tmpID = '12'
  return (
    <div className='App'>
      <div id='12'>id</div>
      <div id={tmpID}>id</div>
    </div>
  );
}
```

动态绑定多值：

```jsx
function App () {
  let tmpObject = {
    id: 13,
    className: 'wrapper'
  }
  return (
    <div className='App'>
      <div {...tmpObject}>id</div>
    </div>
  );
}

即：

<div id="13" class="wrapper">id</div>
```

## 参数 Arguments

**某些指令会需要一个“参数”，Vue在指令名后通过一个冒号隔开做标识。例如用 `v-bind` 指令**

```vue
<a v-bind:href="url"> ... </a>

<!-- 简写 -->
<a :href="url"> ... </a>
```

**React中则没有指令一说，而是采用如下方式：**

```jsx
// href跳转
function App () {
  let tmpURL = 'https://www.XXXXXXXX'
  return (
    <div className='App'>
      <a href={tmpURL}></a>
    </div>
  );
}
```

## 使用 JS 表达式

**React 遇到 `{}` 符号内部解析为 JS 代码**

```jsx
function App () {
  let tmpString = '--';
  return (
    <div className='App'>
      <div >{1 + 1}</div>
      <div >{'a' + 'b'}</div>
      <div >{`1${tmpString}1`}</div>
    </div>
  );
}
```

即：

```html
<div>2</div>
<div>ab</div>
<div>1--1</div>
```

## 事件处理

**Vue中绑定事件处理：**

```vue
<!-- `greet` 是上面定义过的方法名 -->
<button @click="greet">Greet</button>
```

**React可以通过在组件中声明 事件处理 函数来响应事件**

React中点击事件使用小驼峰形式：onClick

在标签上写函数：

```jsx
function App () {
  return (
    <div className='App'>
      <div onClick={() => alert('点击出现弹框')}>按钮</div>
    </div>
  );
}
```

提前声明函数：

```jsx
function App () {
  function myFun () {
    alert('点击出现弹框')
  }
  return (
    <div className='App'>
      <div onClick={myFun}>按钮</div>
    </div>
  );
}
```

注意，`onClick={handleClick}` 的结尾没有小括号！不要 **调用** 事件处理函数：你只需 **传递给事件** 即可。当用户点击按钮时，React 会调用你的事件处理函数。

函数传参：

```jsx
function App () {
  function myFun (str) {
    alert(str)
  }
  return (
    <div className='App'>
      <div onClick={() => myFun('点击出现弹框')}>按钮</div>
    </div>
  );
}
```

## 动态参数

**Vue在指令参数上也可以使用一个 JavaScript 表达式，需要包含在一对方括号内：**

```vue
<a v-bind:[attributeName]="url"> ... </a>

<!-- 简写 -->
<a :[attributeName]="url"> ... </a>
```

举例来说，如果你的组件实例有一个数据属性 `attributeName`，其值为 `"href"`，那么这个绑定就等价于 `v-bind:href`。

**React 也可以通过动态参数绑定**

```jsx
function App () {
  const obj = {
    onClick: () => alert('点击出现弹框'),
    // ...还可以写更多事件
  }
  return (
    <div className='App'>
      <div {...obj}>按钮</div>
    </div>
  );
}
```

## 修饰符 Modifiers

vue 修饰符是以点开头的特殊后缀

表明指令需要以一些特殊的方式被绑定。例如 `.prevent` 修饰符会告知 `v-on` 指令对触发的事件调用 `event.preventDefault()`：

```vue
<form @submit.prevent="onSubmit">...</form>
```

React 则是依靠于JS基础

```jsx
function App () {
  function onSubmit(e){
    e.preventDefault();
    e.stopPropagation();
  }
  return (
    <div className='App'>
      <form onSubmit={onSubmit}>
        <button type='submit'></button>
      </form>
    </div>
  );
}
```

## 响应式

**为了实现视图更新，VUE中响应式是一个重要的概念**

**而 React 中并没有响应式这个概念，要实现视图更新，需要在 React 引入 `useState`**

通常，你会希望你的组件 “记住” 一些信息并展示出来。例如，也许你想计算一个按钮被点击的次数。要做到这一点，你需要在你的组件中添加 **state**。

首先，从 React 引入 `useState`：

```jsx
import { useState } from 'react';
```

现在你可以在你的组件中声明一个 **state 变量**：

```jsx
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

你将从 `useState` 中获得两样东西：当前的 state（`count`），以及用于更新它的函数（`setCount`）。你可以给它们起任何名字，但按照惯例，需要像这样 `[something, setSomething]` 为它们命名。

第一次显示按钮时，`count` 的值为 `0`，因为你把 `0` 传给了 `useState()`。当你想改变 state 时，调用 `setCount()` 并将新的值传递给它。点击该按钮计数器将递增：

```jsx
function MyButton() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React 将再次调用你的组件函数。这次，`count` 会变成 `1`。接着，变成 `2`。以此类推。

如果你多次渲染同一个组件，每个组件都会拥有自己的 state。你可以尝试点击不同的按钮：

## 计算属性

Vue中使用 computed 来实现计算属性（缓存计算的结果）

**React 在组件的顶层调用 `useMemo` 来缓存每次重新渲染都需要计算的结果**

```jsx
import { useState } from 'react';
import { useMemo } from 'react';

function App () {
  const [user] = useState({ firstname: 'a', lastname: 'b' })

  const fullname = useMemo(() => {
    return user.firstname + user.lastname;
  }, [user.firstname, user.lastname])

  return (
    <div className='App'>
      {fullname}
    </div>
  );
}
```

**useMemo(calculateValue, dependencies)**

参数

- `calculateValue`：要缓存计算值的函数。它应该是一个没有任何参数的纯函数，并且可以返回任意类型。React 将会在首次渲染时调用该函数；在之后的渲染中，如果 `dependencies` 没有发生变化，React 将直接返回相同值。否则，将会再次调用 `calculateValue` 并返回最新结果，然后缓存该结果以便下次重复使用。
- `dependencies`：所有在 `calculateValue` 函数中使用的响应式变量组成的数组。响应式变量包括 props、state 和所有你直接在组件中定义的变量和函数。如果你在代码检查工具中 [配置了 React](https://react.docschina.org/learn/editor-setup#linting)，它将会确保每一个响应式数据都被正确地定义为依赖项。依赖项数组的长度必须是固定的并且必须写成 `[dep1, dep2, dep3]` 这种形式。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 将每个依赖项与其之前的值进行比较。

## 绑定 HTML class

数据绑定的一个常见需求场景是操纵元素的 CSS class 列表和内联样式。因为 `class` 和 `style` 都是 attribute

Vue中可以给 `:class` (`v-bind:class` 的缩写) 传递一个对象来动态切换 class：

```vue
<div :class="{ active: isActive }"></div>
```

上面的语法表示 `active` 是否存在取决于数据属性 `isActive` 的真假值。

React实现方式基于js语法，其实有多种实现方式，列举三元运算符方式如下：

```jsx
function App () {
  let showColor = false
  return (
    // 现有box-show、box-hide两个class样式
    <div className={showColor ? 'box-show' : 'box-hide'}></div>
  );
}
```

## 语法糖转换

习惯 Vue 的同学都知道很多语法糖，比如 `v-if`、`v-for`、`v-bind`、`v-on` 等，相比 Vue，React 只有一个语法糖，那就是 jsx/tsx。`v-if` 这些功能在 React 上都是通过原生 javascript 实现的，慢慢你会发现，其实你学的不是 React，而是 Javascipt，React 赋予你通过 js 完整控制组件的能力，这部分明显比 Vue 的语法糖更加灵活，糖太多容易引来虫子（Bug）

条件渲染

vue 中写法是这样：

```vue
<div>
    <h1 v-if="ishow">Vue is awesome!</h1>
    <h1 v-else>else</h1>
</div>
```

在 React 函数组件中，只需使用 js 三目运算符语法即可完成条件渲染的功能。或者使用 && 逻辑，记住下面一句话就能过理解了：

> 遇到 `{}` 符号内部解析为 JS 代码，遇到成对的 `<>` 符号内部解析为 HTML 代码

```jsx
function App () {
  const ishow = false
  return (
    <div>
      {ishow ? <div>awesome</div> : <div>else</div>}
      {ishow && <h1>React!</h1>}
    </div>
  );
}
```

## 列表渲染

Vue中通过v-for进行列表渲染

**React 通过 js 的数组语法 map，将数据对象映射为 DOM 对象**。只需学会 js，无需记住各种指令，如果要做列表过滤，直接使用 `items.filter(...).map(...)` 链式调用即可，语法上更加灵活，如果为了提高渲染性能，使用 useMemo 进行优化即可，类似 Vue 的 computed。

```jsx
function App () {
  const arr = [{ message: 'react' }, { message: 'JS' }]
  return (
    <div>
      {arr.map((items, index) => <li key={index}>{items.message}</li>)}
    </div >
  );
}
```

## 侦听器

Vue中使用 watch监听数据变化，触发回调

React中可以使用 useEffect 实现

```jsx
function App () {
  const [user, setUser] = useState({
    firstname: 'a',
    lastname: 'b'
  })
  useEffect(() => {
    console.log("1111")
  }, [user.firstname])
  return (
    <div>
      <button onClick={() => setUser({ ...user, firstname: 'a2' })}></button>
    </div >
  );
}
```



# 父子组件传递事件

## 子组件是模态框，确定按钮需要增加loading状态

### **子组件：增加 `confirmLoading` 状态并优化 `handleOk` 方法**

```tsx
import React, { useState } from 'react';
import { Modal, Checkbox, Input, message } from 'antd';
import { useTranslation } from 'react-i18next'

const { TextArea } = Input;

interface FeedbackModalProps {
  open: boolean;
  onOk: (selectedOption: number | null, feedbackText: string) => Promise<void>;
  onCancel: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, onOk, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const { t } = useTranslation()
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    if (!feedbackText) {
      message.warning('请填写反馈建议');
      return;
    }
    setConfirmLoading(true)
    try {
      await onOk(selectedOption, feedbackText);
    } finally {
      setConfirmLoading(false)
    }

  };

  return (
    <Modal
      title="反馈"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={`${t('common.operation.confirm')}`}
      cancelText={`${t('common.operation.cancel')}`}
      confirmLoading={confirmLoading}
    >
      {/* <div>
        <Checkbox
          checked={selectedOption === 0}
          onChange={() => setSelectedOption(0)}
        >
          新增
        </Checkbox>
        <Checkbox
          checked={selectedOption === 1}
          onChange={() => setSelectedOption(1)}
        >
          修改
        </Checkbox>
      </div> */}
      <TextArea
        rows={4}
        placeholder="请输入您的反馈建议"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      />
    </Modal>
  );
};

export default FeedbackModal;

```

### **父组件：确保 `handleFeedbackSubmit` 返回 Promise**

```tsx
  const handleFeedbackSubmit = useCallback(
    async (selectedOption: number | null, feedbackText: string) => {
      console.log(currentMessageId);
      console.log(currentFeedback);

      try {
        // 构造请求参数
        const requestBody = {
          operationType: currentFeedback!.rating, // 0 或 1
          feedbackText, // 用户反馈建议
          conversationId: currentConversationId, // 会话 ID
          messageId: currentMessageId, // 消息 ID
          username: getCookieValue('username'), // 用户名
        };

        // 调用 Java 接口
        const javaResponse = await fetch(
          `/dev-api/api/conversation/feedback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        // 调用原有的 updateFeedback 函数
        await updateFeedback(
          {
            url: `/messages/${currentMessageId}/feedbacks`,
            body: { rating: currentFeedback!.rating },
          },
          // isInstalledApp,
          // appId
        );

        // 显示成功通知
        notify({ type: "success", message: t("common.api.success") });

        if (resolveFeedback) {
          resolveFeedback(true); // 用户取消了反馈
          setResolveFeedback(null);
        }

        // 关闭对话框
        setIsFeedbackModalVisible(false);
      } catch (error) {
        console.error("Error:", error);
        notify({ type: "error", message: t("common.api.failed") });
      } finally {
        setIsSubmittingNow(false);
      }
    },
    [
      currentMessageId,
      currentFeedback,
      currentConversationId,
      isInstalledApp,
      appId,
      notify,
      t,
    ]
  );
```

父组件调用子组件部分

```tsx
      <FeedbackModal
        open={isFeedbackModalVisible}
        onOk={handleFeedbackSubmit}
        onCancel={() => {
          if (resolveFeedback) {
            resolveFeedback(false); // 用户取消了反馈
            setResolveFeedback(null);
          }
          setIsFeedbackModalVisible(false)
         }}
      />
```

### **关键点说明**

1. **子组件内部管理加载状态**
   通过 `useState` 创建 `isLoading` 状态，并在 `handleOk` 中控制其值。点击按钮时，`isLoading` 变为 `true`，请求结束后变为 `false`。
2. **`okButtonProps` 绑定加载状态**
   Ant Design 的 `Modal` 组件支持通过 `okButtonProps` 自定义按钮属性，这里将 `loading` 绑定到 `isLoading` 状态。
3. **`onOk` 作为异步函数传递**
   父组件的 `handleFeedbackSubmit` 是 `async` 函数，返回 Promise。子组件通过 `await onOk()` 确保加载状态在请求结束后更新。
4. **错误处理不影响加载状态**
   使用 `try...finally` 确保无论请求成功或失败，`isLoading` 都会被重置。
