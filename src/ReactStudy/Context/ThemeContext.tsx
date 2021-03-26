/**
 * @description context的抛出
 * @author cq
 * @Date 2021-03-26 16:54:40
 * @LastEditTime 2021-03-26 17:00:30
 * @LastEditors cq
 */

import React from 'react';

//创建一个 主题色配置context  其中括号里面的为默认值
const ThemeContext = React.createContext(null);

//创建一个用户信息的context

const UserContext = React.createContext(null);

export { ThemeContext, UserContext };
