---
nav:
  title: Play
  path: /play
  order: 3
---

# 好玩的方法

## 文字模糊的方法

```css
color: transparent;
text-shadow: #111 0 0 5px;
```

## 毛玻璃效果

```css
/*想要图片模糊化处理只需要加下面属性即可*/

filter: blur(10px);
```

## 多重边框

```css
box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.2), 0 0 0 12px rgba(0, 0, 0, 0.2),
  0 0 0 18px rgba(0, 0, 0, 0.2), 0 0 0 24px rgba(0, 0, 0, 0.2);
height: 200px;
margin: 50px auto;
width: 400px;
```

## js 两个变量快速交换

```js
var a = 1,
  b = 2;
a = [b, (b = a)][0];
```

## 去掉某块区域的鼠标

```css
cursor: none !important;
```

## 修改原生 console 样式

```js
var _log = console.log;
console.log = function() {
  _log.call(
    console,
    '%c' + [].slice.call(arguments).join(' '),
    'color:transparent;text-shadow:0 0 2px rgba(0,0,0,.5);',
  );
};
```

Demo:

```tsx
import React from 'react';
import { Play } from 'dumi-demo';

export default () => <Play title="First Demo" />;
```

More skills for writing demo: https://d.umijs.org/guide/demo-principle
