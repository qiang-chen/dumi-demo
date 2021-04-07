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

## 手写 rc-form

```tsx
import React from 'react';
import { MyForm } from 'dumi-demo';

export default () => <MyForm />;
```

## redux 源码刨析

### 聚合模式 compose 函数

```js
function f1(params) {
  console.log(params, 'f1');
  return params;
}
function f2(params) {
  console.log(params, 'f2');
  return params;
}
function f3(params) {
  console.log(params, 'f3');
  return params;
}

// f1(f2(f3("omg")))

function compose(...funcs) {
  console.log(funcs);
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((pre, cur) => {
    return (...arg) => pre(cur(...arg));
  });
}

console.log(compose(f1, f2, f3)('omg'));
```

### 什么是 reducer

- reducer 就是一个纯函数，接受旧的 state 和 action 返回新的 state （可以联想 reduce 方法）
- 纯函数的目的是为了结果好预测

## 只支持同步的 redux

```js
export default function createStore(reducer) {
  let curState;
  let curListen = [];

  function getState(params) {
    return curState;
  }

  function dispatch(action) {
    curState = reducer(curState, action);
    curListen.forEach(item => item());
  }

  function subscribe(listen) {
    curListen.push(listen);
    // 取消订阅
    return () => {
      const index = curListen.findIndex(el => el === listen);
      curListen.splice(index, 1);
    };
  }

  // 手动触发一次dispatch派发初始值

  dispatch({
    type: '随机字符串',
  });

  return {
    getState,
    dispatch,
    subscribe,
  };
}
```

## applyMiddleware 的刨析

### applyMiddleware 的本质就是利用中间件增强 dispatch 的扩展性

```js
export default (...middle) => {
  return createStore => reducer => {
    //先拿到我们原来的store
    const store = createStore(reducer);
    let dispatch = store.dispatch; //加强版的dispatch默认值取之前的dispatch

    // todo 修改一份支持异步请求的dispatch

    const midApi = {
      getState: store.getState,
      // 写成函数是因为多个中间件形成的作用域互不影响
      dispatch: action => dispatch(action),
    };

    // 先把中间件执行一遍 把所需要的参数 getState dispatch 传进去
    const middlewareChain = middle.map(middleware => middleware(midApi));
    // 重新赋值一个函数
    // 每次执行dispatch都要把所有的dispatch都执行一遍
    dispatch = compose(...middlewareChain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
};

// 聚合执行
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

## redux-thunk

```js
function thunk({ dispatch, getState }) {
  return next => action => {
    // action 数据类型是？对象 | 函数
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
  };
}
```

## redux-logger

```js
function logger({ dispatch, getState }) {
  return next => action => {
    // next 就是层传进来的dispatch
    // action 就是要执行的动作
    console.log(`next`, next);
    console.log('action', action);
    console.log('++++++++++++++++++++++++++');

    console.log(action.type + '执行了！！！');

    const prevState = getState();
    console.log('prev state', prevState);

    // todo  执行玩新的dispatch在拿getState就是最新的值了
    const returnValue = next(action);

    const nextState = getState();
    console.log('cur state', nextState);

    console.log('++++++++++++++++++++++++++');

    return returnValue;
  };
}
```
