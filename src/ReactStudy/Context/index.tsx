/**
 * @description Context的使用
 * @author cq
 * @Date 2021-03-26 15:10:29
 * @LastEditTime 2021-03-26 17:27:03
 * @LastEditors cq
 */
import React, { Component } from 'react';
import UseContextPage from './UseContextPage';
import ContextPage from './ContextPage';
import { ThemeContext, UserContext } from './ThemeContext';

export default class Context extends Component {
  constructor(props: any | Readonly<any>) {
    super(props);
    this.state = {
      theme: { color: 'red' },
      userName: '玉麟',
    };
  }

  handClick = () => {
    this.setState({
      theme:
        this.state.theme.color == 'red' ? { color: 'green' } : { color: 'red' },
    });
  };
  render() {
    const { theme, userName } = this.state as any;
    return (
      <div>
        <button onClick={this.handClick}>一键换肤</button>
        <hr />
        <ThemeContext.Provider value={theme}>
          <UserContext.Provider value={userName}>
            <ContextPage />
          </UserContext.Provider>
        </ThemeContext.Provider>
        <hr />
        <ThemeContext.Provider value={theme}>
          <UserContext.Provider value={userName}>
            <UseContextPage />
          </UserContext.Provider>
        </ThemeContext.Provider>
      </div>
    );
  }
}
