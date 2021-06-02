---
nav:
  title: WebpackStudy
  path: /WebpackStudy
  order: 5
---

# WebpackStudy

## webpack 安装与执行

```js

  npm install --save-dev webpack  //安装核⼼库
  npm install --save-dev webpack-cli //安装命令⾏⼯具
  // npm i -D webpack@4.44.

  "scripts": {
    "test": "webpack"
  }
  // npm run test 的原理就是通过shell脚本在node_modules/.bin⽬录下创建⼀个软链接

```

## webpack 配置核⼼概念

- chunk：指代码块，⼀个 chunk 可能由多个模块组合⽽成，也⽤于代码合并与分割。
- bundle：资源经过 Webpack 流程解析编译后最终结输出的成果⽂件。
- entry：顾名思义，就是⼊⼝起点，⽤来告诉 webpack ⽤哪个⽂件作为构建依赖图的起点。
- webpack 会根据 entry 递归的去寻找依赖，每个依赖都将被它处理，最后输出到打包成果中。
- output：output 配置描述了 webpack 打包的输出配置，包含输出⽂件的命名、位置等信息。
- loader：默认情况下，webpack 仅⽀持 .js .json ⽂件，通过 loader，可以让它解析其他类型的
  ⽂件，充当翻译官的⻆⾊。理论上只要有相应的 loader，就可以处理任何类型的⽂件。
- plugin：loader 主要的职责是让 webpack 认识更多的⽂件类型，⽽ plugin 的职责则是让其可以控制
  构建流程，从⽽执⾏⼀些特殊的任务。插件的功能⾮常强⼤，可以完成各种各样的任务。
- webpack 的功能补充
  mode：4.0 开始，webpack ⽀持零配置，旨在为开发⼈员减少上⼿难度，同时加⼊了 mode 的概
  念，⽤于指定打包的⽬标环境，以便在打包的过程中启⽤ webpack 针对不同的环境下内置的优
  化。。

## webpack 简易配置说明

- webpack 有默认的配置⽂件，叫 webpack.config.js
- 不使⽤⾃定义配置⽂件，⽐如 webpackconfig.js，可以通过--config webpackconfig.js 来指定 webpack 使⽤哪个配置⽂件来执⾏构建

### 简易模版

```js
module.exports = {
  entry: './src/index.js', //打包⼊⼝⽂件
  output: './dist', //输出结构
  mode: 'production', //打包环境
  module: {
    rules: [
      //loader模块处理
      {
        test: /\.css$/,
        use: 'style-loader',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()], //插件配置
};
```

### entry

- 单⼊⼝ SPA，本质是个字符串

```js
entry: {
  main: './src/index.js';
}
// 相当于 entry:"./src/index.js"
```

- 多⼊⼝ entry 是个对象

```js

  entry:{
    index:"./src/index.js",
    login:"./src/login.js"
  }

```

### output 输出文件

```js

  output: {
    filename: "bundle.js",//输出⽂件的名称
    path: path.resolve(__dirname, "dist")//输出⽂件到磁盘的⽬录，必须是绝对路径
  },

  //多⼊⼝的处理
  output: {
    filename: "[name][chunkhash:8].js",//利⽤占位符，⽂件名称不要重复
    path: path.resolve(__dirname, "dist")//输出⽂件到磁盘的⽬录，必须是绝对路径
  },

```

### mode

- Mode ⽤来指定当前的构建环境 production development none
- 开发阶段的开启会有利于热更新的处理，识别哪个模块变化
- ⽣产阶段的开启会有帮助模块压缩，处理副作⽤等⼀些功能

### loader

- 模块解析，模块转换器，⽤于把模块原内容按照需求转换成新内容。
- 但是 webpack 默认只知道如何处理 js 和 JSON 模块，那么其他格式的模块处理，和处理⽅式就需要 loader

```js

  // 处理loader路径 第二个参数为我们自定义loader
  resolveLoader: {
  modules: ["node_modules", "./loader"]
  },

```

### moudle

- 模块，在 Webpack ⾥⼀切皆模块，⼀个模块对应着⼀个⽂件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- 当 webpack 处理到不认识的模块时，需要在 webpack 中的 module 处进⾏配置，当检测到是什么格式的
  模块，使⽤什么 loader 来处理。

### Plugins：webpack 的扩展补充

- 作⽤于 webpack 打包整个过程
- webpack 的打包过程是有（⽣命周期概念）钩⼦
- plugin 可以在 webpack 运⾏到某个阶段的时候，帮你做⼀些事情，类似于⽣命周期的概念扩展插件，在 Webpack 构建流程中的特定时机注⼊扩展逻辑来改变构建结果或做你想要的事情。作⽤于整个构建过程

## 简易 Loader 的编写

```js

  //  字符串替换replaceLoader
  const loaderUtils = require("loader-utils");
  module.exports = function(source) {
    // console.log(source, this, this.query);
    // this.query 通过this.query来接受配置⽂件传递进来的参数
    // this.callback :如何返回多个信息，不⽌是处理好的源码，可以使⽤this.callback来处理
    this.callback(
       err: Error | null,
       content: string | Buffer,
       sourceMap?: SourceMap,
       meta?: any
    );

    // this.async：如果loader⾥⾯有异步的事情要怎么处理呢

    // 定义⼀个异步处理，告诉webpack,这个loader⾥有异步事件,在⾥⾯调⽤下这个异步
    // callback 就是 this.callback 注意参数的使⽤
    const options = loaderUtils.getOptions(this);
    const callback = this.async();
    setTimeout(() => {
        const result = source.replace("hello", options.name);
        callback(null, result);
    }, 3000);

    return source.replace('hello','你好')
  };

```

## .npmrc 设置你的下载镜像源

```js
  registry=https://registry.npm.taobao.org
```

## postcss

- postcss 主要功能只有两个：第⼀就是把 css 解析成 JS 可以操作的抽象语法树 AST,第⼆就是调⽤插
  件来处理 AST 并得到结果；
- 所以 postcss ⼀般都是通过插件来处理 css，并不会直接处理 比如：⾃动补⻬浏览器前缀: autoprefixer，css 压缩等 cssnano

## sourceMap

- 源代码与打包后的代码的映射关系，通过 sourceMap 定位到源代码。
- devtool： none 关闭
- eval:速度最快,使⽤ eval 包裹模块代码, source-map： 产⽣ .map ⽂件 cheap:较快，不包含列信息 Module：第三⽅模块，包含 loader 的 sourcemap（⽐如 jsx to js ，babel 的 sourcemap） inline： 将 .map 作为 DataURI 嵌⼊，不单独⽣成 .map ⽂件

- devtool:"cheap-module-eval-source-map",// 开发环境配置
- devtool:"cheap-module-source-map", // 线上⽣成配置 不需要监控则不用开启

## webpack ⽂件指纹策略：hash chunkhash contenthash

- hash 策略 是以项⽬为单位的，项⽬内容改变，则会⽣成新的 hash,内容不变则 hash 不变
- chunkhash 以 chunk 为单位，当⼀个⽂件内容改变，则整个 chunk 组的模块 hash 都会改变
- contenthash 以⾃身内容为单位

## Babel 处理 ES6

- 中⽂⽹站：https://www.babeljs.cn/
- Babel 是 JavaScript 编译器，能将 ES6 代码转换成 ES5 代码，让我们开发过程中放⼼使⽤ JS 新特性⽽不⽤担⼼兼容性问题。并且还可以通过插件机制根据需求灵活的扩展。
- Babel 在执⾏编译的过程中，会从项⽬根⽬录下的 .babelrc JSON ⽂件中读取配置。没有该⽂件会从
  loader 的 options 地⽅读取配置。

- npm i babel-loader @babel/core @babel/preset-env -D
- babel-loader 是 webpack 与 babel 的通信桥梁，不会做把 es6 转成 es5 的⼯作，这部分⼯作需要⽤到
  @babel/preset-env 来做

- 默认的 Babel 只⽀持 let 等⼀些基础的特性转换，Promise 等⼀些还有转换过来，这时候需要借助@babel/polyfill，把 es 的新特性都装进来，来弥补低版本浏览器中缺失的特性
- npm install --save @babel/polyfill

按需加载，减少冗余

```js
//Webpack.config.js
options: {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          edge: '17',
          firefox: '60',
          chrome: '67',
          safari: '11.1',
        },
        corejs: 2, //新版本需要指定核⼼库版本
        useBuiltIns: 'usage', //按需注⼊
      },
      '@babel/preset-react', //babel与react转换的插件
    ],
  ];
}
```

- useBuiltIns 选项是 babel 7 的新功能，这个选项告诉 babel 如何配置 @babel/polyfill 。 它有三个参数可以使⽤： ①entry: 需要在 webpack 的⼊⼝⽂件⾥ import "@babel/polyfill" ⼀次。 babel 会根据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。 ②usage: 不需要 import ，全⾃动检测，但是要安装 @babel/polyfill 。 ③false: 如果你 import "@babel/polyfill" ，它不会排除掉没有使⽤的垫⽚，程序体积会庞⼤。(不推荐)

- .babelrc 直接把 options 的对象移动过去即可

## 自定义 Plugin

### 基本结构

```js
class MyPlugin {
  constructor(options) {}
  // 插件运⾏⽅法apply
  apply(compiler) {
    // 插件hooks
    compiler.hooks.done.tap('My Plugin', (/* xxx */) => {
      // 插件处理逻辑
    });
  }
}
```

### 基本流程

Webpack 的基本流程可以分为 3 个阶段：

- 准备阶段：主要任务是创建 Compiler 和 Compilation 对象；
- 编译阶段：这个阶段任务是完成 modules 解析，并且⽣成 chunks；
- module 解析：包含了三个主要步骤，创建实例、loaders 应⽤和依赖收集；
- chunks ⽣成，主要步骤是找到每个 chunk 所需要包含的 modules 。
- 产出阶段：这个阶段的主要任务是根据 chunks ⽣成最终⽂件，主要有三个步骤：模板 Hash 更
  新，模板渲染 chunk，⽣成⽂件。

#### Compiler

Compiler 模块是 Webpack 最核⼼的模块。每次执⾏ Webpack 构建的时候，在 Webpack 内部，会⾸先实例化⼀个 Compiler 对象，然后调⽤它的 run ⽅法来开始⼀次完整的编译过程。我们直接使⽤
Webpack API webpack(options) 的⽅式得到的就是⼀个 Compiler 实例化的对象，这时候 Webpack 并不会⽴即开始构建，需要我们⼿动执⾏ comipler.run() 才可以。

```js
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
// 只传⼊ config
const compiler = webpack(webpackConfig);
// 开始执⾏
compiler.run(callback);
// 上⾯两句等价于
webpack(webpackConfig, callback);
```

- 使⽤ webpack-dev-server API ⽅式时，只需要传⼊ compiler 对象给 dev server 即可，不
  需要⼿动执⾏ compiler.run()

- 我们如果要⼿动实例化⼀个 Compiler 对象，可以通过 const Compiler = webpack.Compiler 来获取它的类，⼀般只有⼀个⽗ Compiler ，⽽⼦ Compiler 可以⽤来处理⼀些特殊的事件。
- 在 webpack plugin 中，每个插件都有个 apply ⽅法。这个⽅法接收到的参数就是 Compiler 对象，我们可以通过在对应的钩⼦时机绑定处理函数来编写插件，

#### Compiler 钩⼦

```js

  const compiler = webpack(config);
  // 遍历hooks，添加回调，输出`hookName`
  Object.keys(compiler.hooks).forEach(hookName => {
      if (compiler.hooks[hookName].tap) {
          compiler.hooks[hookName].tap('anyString', () => {
          console.log(`run -> ${hookName}`);
        });
      }
    });
  // 触发webpack的编译流程
  compiler.run();
  // 打印结果
  run -> beforeRun
  run -> run
  run -> normalModuleFactory
  run -> contextModuleFactory
  run -> beforeCompile
  run -> compile
  run -> thisCompilation
  run -> compilation
  run -> make
  run -> afterCompile
  run -> shouldEmit
  run -> emit
  run -> afterEmit
  run -> done

```

- 常用钩子相关意思

| 钩⼦         |            类型 |                              什么时候调⽤                               |
| :----------- | --------------: | :---------------------------------------------------------------------: |
| run          | AsyncSeriesHook |                       在编译器开始读取记录前执⾏                        |
| compile      |        SyncHook |                   在⼀个新的 compilation 创建之前执⾏                   |
| compilation  |        SyncHook |                    在⼀次 compilation 创建后执⾏插件                    |
| make         | AsyncSeriesHook |                          完成⼀次编译之前执⾏                           |
| emit         | AsyncSeriesHook |         在⽣成⽂件到 output ⽬录之前执⾏，回调参数:compilation          |
| afterEmit    | AsyncSeriesHook |                    在⽣成⽂件到 output ⽬录之后执⾏                     |
| assetEmitted | AsyncSeriesHook | ⽣成⽂件的时候执⾏，提供访问产出⽂件信息的⼊⼝，回调参数： file ， info |
| done         | AsyncSeriesHook |                  ⼀次编译完成后执⾏，回调参数： stats                   |

———————————————————————————————————————————————————————————————————————————————

### 开发⼀个⽂件清单插件

我希望每次 webpack 打包后，⾃动产⽣⼀个打包⽂件清单，上⾯要记录⽂件名、⽂件数量等信息。

- 显然这个操作需要在⽂件⽣成到 dist ⽬录之前进⾏，所以我们要注册的是 Compiler 上的 emit 钩
  ⼦
- emit 是⼀个异步串⾏钩⼦，我们⽤ tapAsync 来注册。
- 在 emit 的回调函数⾥我们可以拿到 compilation 对象，所有待⽣成的⽂件都在它的 assets
  属性上。
- 通过 compilation.assets 获取我们需要的⽂件信息，并将其整理为新的⽂件内容准备输出。
- 然后往 compilation.assets 添加这个新的⽂件。
- 插件完成后，最后将写好的插件放到 webpack 配置中，这个包含⽂件清单的⽂件就会在每次打包的时候⾃动⽣成了。

```js
class FileListPlugin {
  constructor(options) {
    // 获取插件配置项
    this.filename =
      options && options.filename ? options.filename : 'FILELIST.md';
  }
  apply(compiler) {
    // 注册 compiler 上的 emit 钩⼦
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
      // 通过 compilation.assets 获取⽂件数量
      let len = Object.keys(compilation.assets).length;
      // 添加统计信息
      let content = `# ${len} file${len > 1 ? 's' : ''} emitted by webpack\n\n`;
      // 通过 compilation.assets 获取⽂件名列表
      for (let filename in compilation.assets) {
        content += `- ${filename}\n`;
      }
      // 往 compilation.assets 中添加清单⽂件
      compilation.assets[this.filename] = {
        // 写⼊新⽂件的内容
        source: function() {
          return content;
        },
        // 新⽂件⼤⼩（给 webapck 输出展示⽤）
        size: function() {
          return content.length;
        },
      };
      // 执⾏回调，让 webpack 继续执⾏
      cb();
    });
  }
}

module.exports = FileListPlugin;
```

### 创建一个简易的 bundle.js

- 推荐使⽤@babel/parser，这是 babel7 的⼯具，来帮助我们分析内部的语法，包括 es6，返回
  ⼀个 ast 抽象语法树
- npm install @babel/parser --save

```js
const fs = require('fs');
const parser = require('@babel/parser');
const fenximokuai = filename => {
  const content = fs.readFileSync(filename, 'utf-8');
  const Ast = parser.parse(content, {
    sourceType: 'module',
  });
  console.log(Ast.program.body);
};
```

- 接下来我们就可以根据 body ⾥⾯的分析结果，遍历出所有的引⼊模块，但是⽐较麻烦，这⾥还是推
  荐 babel 推荐的⼀个模块@babel/traverse，来帮我们处理 npm install @babel/traverse --save

```js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fenximokuai = filename => {
  const content = fs.readFileSync(filename, 'utf-8');
  const Ast = parser.parse(content, {
    sourceType: 'module',
  });
  const dependencies = [];
  //分析ast抽象语法树，根据需要返回对应数据，
  //根据结果返回对应的模块，定义⼀个数组，接受⼀下node.source.value的值
  traverse(Ast, {
    ImportDeclaration({ node }) {
      console.log(node);
      dependencies.push(node.source.value);
    },
  });
  console.log(dependencies);
};
fenximokuai('./index.js');

// 处理现在的路径问题：

// 需要⽤到path模块
const parser = require('@babel/parser');
// 修改 dependencies 为对象，保存更多的信息
const dependencies = {};
// 分析出引⼊模块，在项⽬中的路径
const newfilename = './' + path.join(path.dirname(filename), node.source.value);
// 保存在dependencies⾥
dependencies[node.source.value] = newfilename;

// 把代码处理成浏览器可运⾏的代码，需要借助@babel/core，和@babel/preset-env，把ast语法树转换成合适的代码

const babel = require('@babel/core');
const { code } = babel.transformFromAst(Ast, null, {
  presets: ['@babel/preset-env'],
});
```

完整版

```js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = parser.parse(content, {
    sourceType: 'module',
  });
  const dependencies = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const newFile = './' + path.join(dirname, node.source.value);
      dependencies[node.source.value] = newFile;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });
  return {
    filename,
    dependencies,
    code,
  };
};

const makeDependenciesGraph = entry => {
  const entryModule = moduleAnalyser(entry);
  const graphArray = [entryModule];
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i];
    const { dependencies } = item;
    if (dependencies) {
      for (let j in dependencies) {
        graphArray.push(moduleAnalyser(dependencies[j]));
      }
    }
  }
  const graph = {};
  graphArray.forEach(item => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code,
    };
  });
  return graph;
};

const generateCode = entry => {
  const graph = JSON.stringify(makeDependenciesGraph(entry));
  return `
        (function(graph){
          function require(module) {
            function localRequire(relativePath) {
              return require(graph[module].dependencies[relativePath]);
            }
            var exports = {};
            (function(require, exports, code){
              eval(code)
            })(localRequire, exports, graph[module].code);
            return exports;
          };
          require('${entry}')
        })(${graph});
  `;
};
const code = generateCode('./src/index.js');
console.log(code);
```

## 几个小优化

### 优化 loader

- 因为使用 babel 打包项目需要转换代码成字符串生成 AST（抽象语法树），然后又将 AST 转变生成最终的代码，所以项目越大，效率越低。

  - 优化 Loader 的文件搜索范围，给 babel 的搜索范围做一个限制，比如只搜索 css 文件等
  - 将 Babel 编译过的文件缓存起来，下次只需要编译更改过的代码文件即可

```js
loader: 'babel-loader?cacheDirectory=true';
```

### HappyPack 开启多线程

- 因为 node 是单线程运行的，所以 Webpack 打包的过程中也是单线程的，所以在执行 loader 的时候，会导致等待的情况。HappyPack 可以将 Loader 的同步执行转换成并行的

```js

  module:{
      loader:[
          {
              //js文件才使用babel
              test:/\.js$/,
              //只在src文件夹下查找
              include:[resolve('src')]，
              exclude:/node_modules/,
              //id后面的内容对应下面
              loader:'happypack/loader?id=happypack'
          }
      ]
  },
  plugins:[
      new HappyPack({
          id:'happypack',
          loaders:['babel-loader?cacheDirectory'],
          //开启4个线程
          threads:4
      })
  ]

```

### DllPlugin 减少打包次数

- 可以将特定的类库提前打包然后引入。极大的减少了打包类库的次数，只有当类库更新版本才需要重新打包，也实现了将共欧诺个代码抽历程单独文件的优化方案

```js
// webpack.dll.conf.js
const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    //想统一打包的库
    vendor: ['react'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '[name]-[hash]',
  },
  plugins: [
    new webpack.DllPlugin({
      //name必须和output.library一致
      name: '[name]-[hash]',
      //该属性需要与DllReferencePlugin中一致
      context: __dirname,
      path: path.join(__dirname, 'dist', '[name]-mainfest.json'),
    }),
  ],
};
```

然后需要执行这个配置文件生成依赖文件，接下来需要使用 DllReferencePluhin 将依赖文件引入项目中

```js
// webpack.conf.js
new webpack.DllReferencePlugin({
  context: __dirname,
  mainfest: require('./dist/vendor-mainfest.json'),
});
```

### 按需加载

- 1. Scope Hoisting: 可以分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中

```js
// 如果在webpack4中希望开启这个功能，只需要启用optimization.concatenateModules就可以了
module,
  (exports = {
    optimization: {
      // optimization: 优化
      concatenateModules: true, // concatenate: 合并
    },
  });
```

### resolve.modules

- resolve.modules ⽤于配置 webpack 去哪些⽬录下寻找第三⽅模块，默认是['node_modules']
  寻找第三⽅模块，默认是在当前项⽬⽬录下的 node_modules ⾥⾯去找，如果没有找到，就会去上⼀级
  ⽬录../node_modules 找，再没有会去../../node_modules 中找，以此类推，和 Node.js 的模块寻找机制很类似。

如果我们的第三⽅模块都安装在了项⽬根⽬录下，就可以直接指明这个路径。

```js
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, './node_modules')],
  },
};
```

### 优化 resolve.alias 配置

resolve.alias 配置通过别名来将原导⼊路径映射成⼀个新的导⼊路径
拿 react 为例，我们引⼊的 react 库，⼀般存在两套代码

- cjs 采⽤ commonJS 规范的模块化代码
- umd 已经打包好的完整代码，没有采⽤模块化，可以直接执⾏

默认情况下，webpack 会从⼊⼝⽂件./node_modules/bin/react/index 开始递归解析和处理依赖的
⽂件。我们可以直接指定⽂件，避免这处的耗时。

```js

  alias: {
    "@": path.join(__dirname, "./pages"),
    react: path.resolve(
    __dirname,
    "./node_modules/react/umd/react.production.min.js"
    ),
    "react-dom": path.resolve(
    __dirname,
    "./node_modules/react-dom/umd/react-dom.production.min.js"
    )
  }

  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "../src/images/"),
    },
  },

  //html-css中使⽤
  .sprite3 {
    background: url("~@assets/s3.png");
  }

```

### resolve.extensions

resolve.extensions 在导⼊语句没带⽂件后缀时，webpack 会⾃动带上后缀后，去尝试查找⽂件是否存
在。
默认值：extensions:['.js','.json','.jsx','.ts']

- 后缀尝试列表尽量的⼩
- 导⼊语句尽量的带上后缀。

### 使⽤ externals 优化 cdn 静态资源

```js

  module.exports = {
  //...
    externals: {
    //jquery通过script引⼊之后，全局中即有了 jQuery 变量
     'jquery': 'jQuery'
    }
  }

  output:{
    publicPath: '//cdnURL.com', //指定存放JS⽂件的CDN地址 静态资源文件
  }

```

## 推荐一遍小配置

```js
// resolve用来拼接绝对路径的方法
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 提取css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 压缩css代码
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
  // webpack配置
  entry: './src/index.js', // 入口
  output: {
    // 输出
    filename: 'built.js', // 输出文件名
    // __dirname: nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'build'), // 输入路径
    // 针对页面中引入的资源的路径做对应的补全，常见于在css或者html中引入的图片
    publicPath: './',
  },
  // loader 配置
  module: {
    rules: [
      // 详细loader配置
      // 不同文件得配置不同loader
      {
        // 匹配哪些文件
        test: /\.(css|less)$/,
        // 使用哪些loader
        use: [
          // use数组中loader执行顺序：从后到前依次执行
          // 'style-loader', // 创建一个style标签，将js中的css样式资源插入进去,添加到head中生效
          // 提取js中的css成单独文件，取代style-loader
          MiniCssExtractPlugin.loader,
          'css-loader', // 将css文件变成commonjs的模块加载js中，里面内容是样式字符串
          'less-loader', // 将less文件编译成css文件
          /**
           * css 兼容性处理
           */
          // 第一种用法：使用loader的默认配置： 'postcss-loader'
          // 第二种写法：对象
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // 帮助postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
                require('postcss-preset-env')(),
              ],
            },
          },
        ],
      },
      {
        // 默认处理不了html中的img图片
        // 处理图片资源
        test: /\.(jpg|png|gif|jpeg)$/,
        // 使用多个loader用use， 一个loader的时候可以直接用loader
        // 需要下载url-loader 和 file-loader
        loader: 'url-loader',
        options: {
          // 图片小于8kb的时候，就会被base64处理
          // base64优点：减少请求数量，减轻服务器压力
          // 缺点：图片体积会变大，文件请求速度更慢
          limit: 8 * 1024,
          // 因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs，解析时会出错
          // 解决： 关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          // 给图片重命名
          // [hash:10]取图片的hash前10位
          // [ext]取文件原来扩展名
          name: '[hash:10].[ext]',
        },
      },
      {
        test: /.html$/,
        // 处理html文件中的img图片， 负责引入img，从而能被url-loader进行处理
        loader: 'html-loader',
      },
      // 打包其他资源
      {
        // 排除资源
        exclude: /\.(css|js|ts|less|html|jsx|tsx|json|jpg|png|gif|jpeg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
        },
      },
      // {
      //     test: /\.(js|ts|jsx|tsx)$/,
      //     exclude: /node_modules/,
      //     loader: 'eslint-loader',
      //     options: {}
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  edge: '11',
                  firefox: '60',
                  chrome: '58',
                  safari: '11',
                },
              },
            ],
          ],
        },
      },
    ],
  },
  // 插件
  plugins: [
    // 详细plugins配置
    // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源
    new HtmlWebpackPlugin({
      // template: 配置参数，复制html文件并自动引入打包输出的所有资源
      template: './src/index.html',
      minify: {
        //移除空格
        collapseWhitespace: true,
        //移除注释
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  // mode: 'development', // 编译模式 development || production
  mode: 'production',
  // 开发服务器 devServer 用来自动化编译、自动打开浏览器、自动刷新浏览器等功能
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动指令: webpack-dev-server
  devServer: {
    // 指定额外的静态资源路径,可以是一个字符串或者一个数组
    // 因为在开发阶段我们一般不会去打包public、images等静态资源目录,只有在上线前才会去将其打包,所以在这里配置一下，如果output中配置了publicPath属性，一定要注释掉publicPath，不然会加载不出图片等静态资源
    contentBase: './build',
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 默认打开浏览器
    open: true,
  },
};
```
