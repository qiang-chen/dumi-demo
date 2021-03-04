/**
 * @description
 * @author cq
 * @Date 2021-01-06 20:18:38
 * @LastEditTime 2021-03-03 19:59:07
 * @LastEditors cq
 */
import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Hello 玉麟',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/umijs/dumi',
    },
  ],
  base: '/dumi_demo',
  publicPath: '/dumi_demo/',
  exportStatic: { htmlSuffix: true },
  // more config: https://d.umijs.org/config
});
