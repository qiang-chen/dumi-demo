/**
 * @description
 * @author cq
 * @Date 2021-03-26 18:07:37
 * @LastEditTime 2021-04-02 18:18:24
 * @LastEditors cq
 */

import Form, { Field } from '../../Component/MyRCFieldForm/index';
import style from './index.less';
import React from 'react';

const nameRules = { required: true, message: '请输入姓名！' };
const passworRules = { required: true, message: '请输入密码！' };

export default function MyForm() {
  const handSubmit = () => {
    alert();
  };

  const onFinish = (value: any) => {
    console.log('onFinish', value);
  };

  const onFinishFailed = (err: any, value: any) => {
    console.log('onFinishFailed', err, value);
  };

  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <div className={style.form}>
        <Field name="userName" rules={[nameRules]}>
          <input className={style.input} placeholder="userName" type="text" />
        </Field>
        <Field name="possword" rules={[passworRules]}>
          <input className={style.input} placeholder="possword" type="text" />
        </Field>
        <button className={style.input}>提交</button>
      </div>
    </Form>
  );
}
