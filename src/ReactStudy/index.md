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

### 柯里化 currying

```js
function currying(a, b) {
  return a + b;
}

function fn(params) {
  return currying => params + currying;
}

console.log(currying(1, 2));
console.log(fn(1)(2));
```

### 什么是 reducer

- reducer 就是一个纯函数，接受旧的 state 和 action 返回新的 state （可以联想 reduce 方法）
- 纯函数的目的是为了结果好预测

### 只支持同步的 redux

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

### applyMiddleware 的刨析

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

### combineReducers 的刨析

```js
function combineReducers(reducers) {
  return (state = {}, action) => {
    let nextState = {};
    let ishas = false;
    for (const key in reducers) {
      const reducer = reducers[key];
      nextState[key] = reducer(state[key], action);
      ishas = ishas || nextState[key] !== state[key];
    }
    // 为了防止state的改变需要区分下长度  比如{a:1,b:2}变成{a:1}
    ishas =
      ishas || Object.keys(nextState).length !== Object.keys(state).length;
    return ishas ? nextState : state;
  };
}
```

### bindActionCreators 的刨析

```js
function bindActionCreators(creators, dispatch) {
  for (const key in creators) {
    const fn = creators[key];
    // fn(dispatch)
    creators[key] = () => dispatch(fn());
  }
  return creators;
}
```

### redux-thunk

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

### redux-logger

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

## react-redux 相关方法

### Provider 方法

```js
// 通过Context传递store
// *step1 创建一个Context对象
const Context = React.createContext();
// *step2 通过Provider组件传递value（store）
export function Provider({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
```

### connect 方法

```js
// hoc 函数，参数是组件，返回值是个新组件
export const connect = (
  mapStateToProps = state => state,
  mapDispatchToProps,
) => WrappedComponent => props => {
  const store = useContext(Context);
  const { getState, dispatch, subscribe } = store;
  // store state
  const stateProps = mapStateToProps(getState());

  let dispatchProps = { dispatch };

  if (typeof mapDispatchToProps === 'object') {
    dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
  } else if (typeof mapDispatchToProps === 'function') {
    dispatchProps = mapDispatchToProps(dispatch);
  }
  // 让函数强制更新的方法
  // const [, forceUpdate] = useReducer(x => x + 1, 0);
  // const [, forceUpdate] = useState({});

  const forceUpdate = useForceUpdate();
  // * useEffect _ _  DOM变更  effect执行(订阅)
  // * useLayoutEffect __   DOM变更-effect执行(订阅)

  // 订阅
  //

  useLayoutEffect(() => {
    //有订阅 一定要有取消订阅
    const unsubscribe = store.subscribe(() => {
      // todo 让函数组件更新
      forceUpdate();
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [store]);

  return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
};
```

### 自定义 hooks 刷新方法 useForceUpdate

```js
function useForceUpdate() {
  const [state, setState] = useState(0);
  const update = useCallback(() => {
    setState(prev => prev + 1);
  }, []);

  return update;
}
```

### useSelector 方法

```js
export function useSelector(selector) {
  const store = useStore();
  const { getState } = store;

  const selectState = selector(getState());

  const forceUpdate = useForceUpdate();
  // * useEffect _ _  DOM变更  effect执行(订阅)
  // * useLayoutEffect __   DOM变更-effect执行(订阅)

  // 订阅
  //

  useLayoutEffect(() => {
    //有订阅 一定要有取消订阅
    const unsubscribe = store.subscribe(() => {
      // todo 让函数组件更新
      forceUpdate();
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [store]);

  return selectState;
}
```

### useStore 方法

```js
function useStore() {
  const store = useContext(Context);
  return store;
}
```

### useDispatch 方法

```js
export function useDispatch() {
  const store = useStore();
  return store.dispatch;
}
```

## react-router

### 牛刀小试

- react-router 渲染方式有三种 优先级是 children>component>render
  > > 其中 children 无需匹配 每个页面都能加载 但是放在 switch 里面就不会了
- component 不能使用函数加载
  > > 原因是渲染 component 的时候会调用 React.createElement，如果使用下面这种匿名函数的形式每次都会生成一个新的匿名的函数，导致生成的组件的 type 总是不相同，这个时候会产生重复的卸载和挂载

```js
<div className="App">
  <BrowserRouter>
    <nav>
      <Link to="/">首页</Link>
      <Link to="/user">用户中心</Link>
    </nav>
    <button onClick={handClick}>{state}</button>
    {/* 根路由要添加exact，实现精确匹配 */}
    <Route
      exact
      path="/"
      // children 是不管是否匹配都会出现
      // children={() => <div>我是children渲染结果</div>}
      // render={() => <div>我是render渲染结果</div>}
      // component={() => <HomePage/>} 错误写法
      component={HomePage}
    />
    <Route path="/user" component={UserPage} />
    <Route render={() => <h1>404</h1>} />
  </BrowserRouter>
</div>
```

## react-router-dom 全家桶

### context 管理

- 首先定义一个 context 管理作为全局的数据流

```js
import React from 'react';

// 使用Context跨层级传递数据
// step1: 先创建一个Context对象
const RouterContext = React.createContext();

// step2: 使用Provider传递value

// step3: 子孙组件消费value: Consumer、useContext、contextType
// useContext只能用在函数组件或者自定义hook中
// contextType 只能用在类组件，并且只能订阅单一的context来源

export default RouterContext;
```

### BrowserRouter 的实现

```js
import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import RouterContext from './RouterContext';

export default class BrowserRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: createBrowserHistory().location,
    };
    this.history = createBrowserHistory();
    this.unlisten = this.history.listen(location => {
      this.setState({ location });
    });
  }
  static computeRootMatch(pathname) {
    return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
  }
  render() {
    // return <RouteContext>
    return (
      <RouterContext.Provider
        value={{
          history: this.history,
          location: this.state.location,
          match: BrowserRouter.computeRootMatch(this.state.location.pathname),
        }}
      >
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}
```

### Route 的实现

```js
import React, { createElement, Component } from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';

export default class Route extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const { location } = context;
          const {
            path,
            children,
            component,
            render,
            computedMatch,
          } = this.props;
          const match = computedMatch
            ? computedMatch
            : path
            ? matchPath(location.pathname, this.props)
            : context.match; // location.pathname === path;
          // const match = path
          //   ? matchPath(location.pathname, this.props)
          //   : context.match; // location.pathname === path;

          const props = {
            ...context,
            location,
            match,
          };
          console.log(match, 'match');
          //match children, component, render, null
          // 不match children(function), null

          // ()
          // return createElement(this.props.component)
          // 修改了match重新订阅一下
          return (
            <RouterContext.Provider value={props}>
              {match
                ? children
                  ? typeof children === 'function'
                    ? children(props)
                    : children
                  : component
                  ? createElement(this.props.component, props)
                  : render
                  ? render(props)
                  : null
                : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
```

### Switch 的实现

```js
import React, { Component } from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';

// 独占路由
// 渲染与该地址匹配的第一个子节点 <Route> 或者 <Redirect>。
// 遍历子节点，找到匹配的，就走了
class Switch extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const location = this.props.location || context.location;
          let match; //标记匹配
          let element; //记录匹配的元素

          React.Children.forEach(this.props.children, child => {
            if (match == null && React.isValidElement(child)) {
              element = child;

              match = child.props.path
                ? matchPath(location.pathname, child.props)
                : context.match;
            }
          });

          return match
            ? React.cloneElement(element, { computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}
export default Switch;
```

### Redirect 的实现

```js
import React, { Component } from 'react';
import RouterContext from './RouterContext';

export default class Redirect extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const { history } = context;
          const { to, push = false } = this.props;
          // 因为在return里面没法做拦截处理  只能在写一个组件
          return (
            <LifeCycle
              onMount={() => {
                push ? history.push(to) : history.replace(to);
              }}
            />
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

class LifeCycle extends Component {
  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount.call(this, this);
    }
  }
  render() {
    return null;
  }
}
```

### withRouter 的实现

- 其实这个方法就是简单的把一个类组件变成纯函数然后挂载了下 props 而已

```js
import RouterContext from './RouterContext';

const withRouter = WrappedComponent => props => {
  return (
    <RouterContext.Consumer>
      {context => <WrappedComponent {...props} {...context} />}
    </RouterContext.Consumer>
  );
};

export default withRouter;
```

### Link 的实现

```js
import React from 'react';
import RouterContext from './RouterContext';

export default function Link({ to, children }) {
  const context = React.useContext(RouterContext);

  const handClick = e => {
    e.preventDefault();
    context.history.push(to);
  };

  return (
    <a href={to} onClick={handClick}>
      {children}
    </a>
  );
}
```

### matchPath 的实现

- 上述代码所用到的 matchPath 就是对路由路径做了下拆分处理
- 这里直接 copy 源码了

```js
import pathToRegexp from 'path-to-regexp';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options = {}) {
  if (typeof options === 'string' || Array.isArray(options)) {
    options = { path: options };
  }

  const { path, exact = false, strict = false, sensitive = false } = options;

  const paths = [].concat(path);

  return paths.reduce((matched, path) => {
    if (!path && path !== '') return null;
    if (matched) return matched;

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive,
    });
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {}),
    };
  }, null);
}

export default matchPath;
```

### Prompt 的实现

```js
import React, { Component } from 'react';
import RouterContext from './RouterContext';

export default function Prompt({ message, when = true }) {
  return (
    <RouterContext.Consumer>
      {context => {
        if (!when) {
          return null;
        }
        let method = context.history.block;
        return (
          <LifeCycle
            onMount={self => {
              self.release = method(message);
            }}
            onUnmount={self => {
              self.release();
            }}
          />
        );
      }}
    </RouterContext.Consumer>
  );
}

class LifeCycle extends Component {
  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount.call(this, this);
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount', this);
    if (this.props.onUnmount) {
      this.props.onUnmount.call(this, this);
    }
  }
  render() {
    return null;
  }
}
```

### 几个 hooks 获取的小方法

```js
import RouterContext from './RouterContext';
import { useContext } from 'react';

export function useHistory() {
  return useContext(RouterContext).history;
}

export function useLocation() {
  return useContext(RouterContext).location;
}
export function useRouteMatch() {
  return useContext(RouterContext).match;
}
export function useParams() {
  const match = useContext(RouterContext).match;
  return match ? match.params : {};
}
```
