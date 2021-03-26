/**
 * @description
 * @author cq
 * @Date 2021-03-26 16:13:45
 * @LastEditTime 2021-03-26 17:24:28
 * @LastEditors cq
 */
import React, { useContext } from 'react';
import { ThemeContext, UserContext } from './ThemeContext';

export default function UseContextPage() {
  const theme: any = useContext(ThemeContext);
  const userName: any = useContext(UserContext);
  return (
    <>
      <div style={theme}>函数组件</div>
      <div>用户名是： {userName}</div>
    </>
  );
}
