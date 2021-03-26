---
nav:
  title: ReactStudy
  path: /ReactStudy
  order: 5
---

# react-study

## context 使用

- 注意 在 Provider 的 value 中不能直接引用类型，否则会因为 diff 算法在不停的刷新
- 从而导致重复渲染，应该使用 state 的值来控制

```tsx
import React from 'react';
import { Context } from 'dumi-demo';

export default () => <Context />;
```
