---
title: Vue3
date: 2023-11-18 10:30:31
author: 文永达
tags: [Vue3, Vue, 响应式, 前端框架]
categories: [前端开发, Vue]
---
# 响应式

在Vue 3中，响应式是通过`reactive`函数和`ref`函数实现的。`reactive`函数用于创建一个响应式对象，而`ref`函数用于创建一个包装对象，将基本类型的值转换为响应式对象。

具体来说，`reactive`函数接收一个普通对象作为参数，并返回一个响应式对象，如下所示：

```ts
import { reactive } from 'vue';

const state = reactive({
  count: 0
});
```

在这个例子中，我们使用`reactive`函数创建了一个响应式对象`state`，它包含一个属性`count`，初始值为0。

在组件中，你可以使用`setup`函数来访问响应式对象，如下所示：

```vue
<template>
  <div>
    <p>Count: {{ state.count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  setup() {
    const state = reactive({
      count: 0
    });

    const increment = () => {
      state.count++;
    };

    return {
      state,
      increment
    };
  }
}
</script>
```

在这个例子中，我们在`setup`函数中访问了响应式对象`state`，并将它绑定到模板中。当点击按钮时，我们调用`increment`函数来增加`state.count`的值。由于`state`是响应式对象，当`state.count`的值发生变化时，模板中的内容也会自动更新。

除了`reactive`函数外，Vue 3还提供了`ref`函数，用于将基本类型的值转换为响应式对象。例如，你可以使用`ref`函数来创建一个响应式的计数器，如下所示：

```ts
import { ref } from 'vue';

const count = ref(0);
```

在这个例子中，我们使用`ref`函数创建了一个响应式对象`count`，它的初始值为0。

在组件中，你可以使用`setup`函数来访问响应式对象，如下所示：

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);

    const increment = () => {
      count.value++;
    };

    return {
      count,
      increment
    };
  }
}
</script>
```

在这个例子中，我们在`setup`函数中访问了响应式对象`count`，并将它绑定到模板中。当点击按钮时，我们调用`increment`函数来增加`count.value`的值。由于`count`是响应式对象，当`count.value`的值发生变化时，模板中的内容也会自动更新。

总之，Vue 3中的响应式是通过`reactive`函数和`ref`函数实现的。`reactive`函数用于创建一个响应式对象，而`ref`函数用于将基本类型的值转换为响应式对象。你可以在`setup`函数中访问响应式对象，并将它们绑定到模板中。

# 依赖注入

Vue 3中的依赖注入是通过provide和inject实现的。provide和inject是一对API，用于在父组件和子组件之间共享数据。具体来说，provide用于在父组件中提供数据，而inject用于在子组件中注入数据。

在父组件中，你可以使用provide来提供数据，如下所示：

```vue
<script>
import { provide } from 'vue';

export default {
  setup() {
    const data = 'Hello, World!';
    provide('data', data);
  }
}
</script>
```

在子组件中，你可以使用inject来注入数据，如下所示：

```vue
<script>
import { inject } from 'vue';

export default {
  setup() {
    const data = inject('data');
    console.log(data); // 输出：Hello, World!
  }
}
</script>
```

在这个例子中，父组件提供了一个名为'data'的数据，子组件通过inject来注入这个数据。注意，子组件中的inject必须在setup函数中使用，而且必须在模板中使用才能生效。

总之，Vue 3中的依赖注入是通过provide和inject实现的，它可以帮助你在父组件和子组件之间共享数据。

# 插槽

## 默认插槽

Vue 3中的插槽是通过`<slot>`元素实现的。插槽允许你在组件中定义一些占位符，然后在使用组件时填充这些占位符。具体来说，你可以在组件中使用`<slot>`元素来定义插槽，如下所示：

```vue
<template>
  <div>
    <h2>{{ title }}</h2>
    <slot></slot>
  </div>
</template>
```

在这个例子中，我们定义了一个名为`title`的属性和一个插槽。插槽使用了`<slot>`元素，它表示这里是一个插槽占位符，可以在使用组件时填充内容。

在使用组件时，你可以在组件标签中填充内容，如下所示：

```vue
<template>
  <div>
    <my-component title="Hello, World!">
      <p>This is the content of the slot.</p>
    </my-component>
  </div>
</template>
```

在这个例子中，我们使用了`<my-component>`组件，并在组件标签中填充了一个`<p>`元素。这个`<p>`元素就是填充了组件中定义的插槽。

除了默认插槽外，Vue 3还支持具名插槽和作用域插槽。具名插槽允许你定义多个插槽，并在使用组件时指定要填充哪个插槽。作用域插槽允许你将数据传递给插槽内容，以便在插槽中使用。

总之，Vue 3中的插槽是通过`<slot>`元素实现的，它允许你在组件中定义占位符，并在使用组件时填充内容。除了默认插槽外，Vue 3还支持具名插槽和作用域插槽。

## 具名插槽

在Vue 3中，具名插槽允许你定义多个插槽，并在使用组件时指定要填充哪个插槽。具名插槽可以通过在`<slot>`元素上添加`name`属性来定义，如下所示：

```vue
<template>
  <div>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>
```

在这个例子中，我们定义了三个插槽，其中第一个和第三个是具名插槽，分别使用了`name`属性来定义。第二个插槽没有使用`name`属性，它是默认插槽。

在使用组件时，你可以使用`v-slot`指令来指定要填充哪个插槽，如下所示：

```vue
<template>
  <div>
    <my-component>
      <template v-slot:header>
        <h1>This is the header slot.</h1>
      </template>
      <p>This is the default slot.</p>
      <template v-slot:footer>
        <p>This is the footer slot.</p>
      </template>
    </my-component>
  </div>
</template>
```

在这个例子中，我们使用了`<my-component>`组件，并在组件标签中填充了三个插槽。使用`v-slot`指令来指定要填充哪个插槽，语法为`v-slot:name`，其中`name`是插槽的名称。

除了`v-slot`指令外，Vue 3还支持另一种简写语法`#`，如下所示：

```vue
<template>
  <div>
    <my-component>
      <template #header>
        <h1>This is the header slot.</h1>
      </template>
      <p>This is the default slot.</p>
      <template #footer>
        <p>This is the footer slot.</p>
      </template>
    </my-component>
  </div>
</template>
```

在这个例子中，我们使用了`#`来代替`v-slot`指令，语法更加简洁。

总之，Vue 3中的具名插槽允许你定义多个插槽，并在使用组件时指定要填充哪个插槽。你可以使用`v-slot`指令或`#`来指定要填充哪个插槽。

## 作用域插槽

在Vue 3中，作用域插槽允许你将数据传递给插槽内容，以便在插槽中使用。作用域插槽可以通过在`<slot>`元素上添加`v-bind`指令来定义，如下所示：

```vue
<template>
  <div>
    <slot v-bind:user="user"></slot>
  </div>
</template>
```

在这个例子中，我们定义了一个作用域插槽，并使用了`v-bind`指令来将`user`数据传递给插槽内容。

在使用组件时，你可以在插槽标签中使用`v-slot`指令来定义插槽，并在插槽内容中使用传递的数据，如下所示：

```vue
<template>
  <div>
    <my-component>
      <template v-slot:default="slotProps">
        <p>{{ slotProps.user.name }}</p>
        <p>{{ slotProps.user.age }}</p>
      </template>
    </my-component>
  </div>
</template>
```

在这个例子中，我们使用了`<my-component>`组件，并在组件标签中填充了一个作用域插槽。使用`v-slot`指令来定义插槽，并使用`default`作为插槽的名称。在插槽内容中，我们可以通过`slotProps`来访问传递的数据。

除了`v-slot`指令外，Vue 3还支持另一种简写语法`#`，如下所示：

```vue
<template>
  <div>
    <my-component>
      <template #default="slotProps">
        <p>{{ slotProps.user.name }}</p>
        <p>{{ slotProps.user.age }}</p>
      </template>
    </my-component>
  </div>
</template>
```

在这个例子中，我们使用了`#`来代替`v-slot`指令，语法更加简洁。

总之，Vue 3中的作用域插槽允许你将数据传递给插槽内容，以便在插槽中使用。你可以在`<slot>`元素上使用`v-bind`指令来定义作用域插槽，并在插槽标签中使用`v-slot`指令或`#`来定义插槽，并在插槽内容中使用传递的数据。

# 比较重要的知识点总结

## 对vue.js的响应式数据的理解

### Vue 2.x

**对象类型**：通过`object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）

**数组类型**：通过重写更新数组的一系列方法来实现拦截（对数组的变更方法进行了包裹）

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/BOlSgLkrCDYqyTILUJ6mZmQ4qviaPgxpAaxTicvl4Ac1015TlUpn1HtF31qOwxu9AwqwTepicgyrFYoKIhMh3RObg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

- 当你把一个普通的JavaScript对象传入Vue实例作为**data**选项，Vue将遍历此对象所有的property，并使用**Object.defineProperty**把这些property全部转为**getter/setter**。

	- **Object.defineProperty**是ES5中一个无法shim的特性，这也就是Vue不支持IE8以及更低版本浏览器的原因。

- 当使用这些数据属性是，会进行依赖收集（收集到当前组件的watcher）
	- 每个组件都对应一个watcher实例，它会在组件渲染的过程中把“接触”过的数据记录为依赖之后当依赖项的setter触发时，会通知watcher，从而使它关联的组件重新渲染

**存在问题**：

- 新增属性、删除属性，界面不会更新
- 直接通过下标修改数组，界面不会自动更新

### Vue 3.x

**通过Proxy（代理）**：拦截对象中任意属性的变化，包括：属性值的读写，属性的增加，属性的删除等。

**通过Reffect（反射）**：对源对象的属性进行操作

`Proxy`是 ECMAScript 6 中新增的属性。

Proxy对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

被Proxy代理虚拟化的对象。它常被作为代理得存储后端。根据目标验证关于对象不可扩展性或不可配置属性的不变量（保持不变的语义）。

语法：

```javascript
const p = new Proxy(target, handler)
```

参数：

target：

要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

handler：

一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。

# 组合式函数(Hook)

## 概述

在 Vue 应用的概念中，“组合式函数”（Composables）是一个利用 Vue 的组合式 API 来封装和复用**有状态逻辑**的函数。

当构建前端应用时，我们常常需要复用公共任务的逻辑。例如为了在不同地方格式化时间，我们可能会抽取一个可复用的日期格式化函数。这个函数封装了**无状态的逻辑**：它在接受一些输入后立刻返回所期望的输出。复用无状态逻辑的库很多，比如你可能已经用过的lodash或是date-fns。

相比之下，有状态逻辑负责管理会随时间而变化的状态。一个简单的例子是跟踪当前鼠标在页面中的位置。在实际应用中，也可能是像触摸手势或与数据库的连接状态这样的更复杂的逻辑。

## 约定和最佳实践

### 命名

组合式函数约定用驼峰命名法命名，并以“use”作为开头。

### 输入参数

即便不依赖于 ref 或 getter 的响应性，组合式函数也可以接受它们作为参数。如果你正在编写一个可能被其他开发者使用的组合式函数，最好处理一下输入参数是 ref 或 getter 而非原始值的情况。可以利用`toValue()`工具函数来实现：

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // 如果 maybeRefOrGetter 是一个 ref 或 getter，
  // 将返回它的规范化值。
  // 否则原样返回。
  const value = toValue(maybeRefOrGetter)
}
```

如果你的组合式函数在输入参数是 ref 或 getter 的情况下创建了响应式 effect，为了让它能够被正确追踪，请确保要么使用`watch()`显式地监视 ref 或 getter，要么在`watchEffect()`中调用`toValue()`。

## 封装下拉框Hook

```ts
import { onMounted, reactive, ref } from 'vue';
// 定义下拉框接收的数据格式
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  key?: string;
}
// 定义入参格式
interface FetchSelectProps {
  apiFun: () => Promise<any[]>;
}

export function useFetchSelect(props: FetchSelectProps) {
  const { apiFun } = props;

  const options = ref<SelectOption[]>([]);

  const loading = ref(false);

  /* 调用接口请求数据 */
  const loadData = () => {
    loading.value = true;
    options.value = [];
    return apiFun().then(
      (data) => {
        loading.value = false;
        options.value = data;
        return data;
      },
      (err) => {
        // 未知错误，可能是代码抛出的错误，或是网络错误
        loading.value = false;
        options.value = [
          {
            value: '-1',
            label: err.message,
            disabled: true,
          },
        ];
        // 接着抛出错误
        return Promise.reject(err);
      }
    );
  };

  //   onMounted 中调用接口
  onMounted(() => {
    loadData();
  });

  return reactive({
    options,
    loading,
  });
}
```

组件调用

```vue
<script setup name="DDemo" lang="ts">
  import { useFetchSelect } from './hook';

  //   模拟调用接口
  function getRemoteData() {
    return new Promise<any[]>((resolve, reject) => {
      setTimeout(() => {
        // 模拟接口调用有概率出错
        if (Math.random() > 0.5) {
          resolve([
            {
              key: 1,
              name: '苹果',
              value: 1,
            },
            {
              key: 2,
              name: '香蕉',
              value: 2,
            },
            {
              key: 3,
              name: '橘子',
              value: 3,
            },
          ]);
        } else {
          reject(new Error('不小心出错了！'));
        }
      }, 3000);
    });
  }

   // 将之前用的 options,loading，和调用接口的逻辑都抽离到hook中
  const selectBind = useFetchSelect({
    apiFun: getRemoteData,
  });
</script>

<template>
  <div>
    <!-- 将hook返回的接口，通过 v-bind 绑定给组件 -->
    <a-select v-bind="selectBind" />
  </div>
</template>
```

## Loading状态hook

```ts
import { Ref, ref } from 'vue';

type TApiFun<TData, TParams extends Array<any>> = (...params: TParams) => Promise<TData>;

interface AutoRequestOptions {
   // 定义一下初始状态
  loading?: boolean;
  // 接口调用成功时的回调
  onSuccess?: (data: any) => void;
}

type AutoRequestResult<TData, TParams extends Array<any>> = [Ref<boolean>, TApiFun<TData, TParams>];

/* 控制loading状态的自动切换hook */
export function useAutoRequest<TData, TParams extends any[] = any[]>(fun: TApiFun<TData, TParams>, options?: AutoRequestOptions): AutoRequestResult<TData, TParams> {
  const { loading = false, onSuccess } = options || { loading: false };

  const requestLoading = ref(loading);

  const run: TApiFun<TData, TParams> = (...params) => {
    requestLoading.value = true;
    return fun(...params)
      .then((res) => {
        onSuccess && onSuccess(res);
        return res;
      })
      .finally(() => {
        requestLoading.value = false;
      });
  };

  return [requestLoading, run];
}
```

组件调用

```vue
<script setup name="Index" lang="ts">
import { useAutoRequest } from "./hook";
import { Button } from "ant-design-vue";
import { submitApi } from "@/api";

const [loading, submit] = useAutoRequest(submitApi);

function onSubmit() {
   submit("aaa").then((res) => {
    console.log("res", res);
  });
}
</script>

<template>
  <div class="col">
    <Button :loading="loading" @click="onSubmit">提交</Button>
  </div>
</template>
```

