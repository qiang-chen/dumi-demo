/**
 * @description
 * @author cq
 * @Date 2021-03-26 15:21:46
 * @LastEditTime 2021-03-26 17:26:06
 * @LastEditors cq
 */
import React, { Component } from 'react';
import { ThemeContext, UserContext } from './ThemeContext';

export default class ContextPage extends Component {
  static contextType = ThemeContext;
  // static contextType =  UserContext
  // 注意 static contextType只能使用一次
  render() {
    return (
      <>
        <div style={this.context}>我是class类的演示</div>
        <ThemeContext.Consumer>
          {value => <div style={value as any}>Consumer测试</div>}
        </ThemeContext.Consumer>

        <UserContext.Consumer>
          {value => <div>用户名：{value}</div>}
        </UserContext.Consumer>
      </>
    );
  }
}
