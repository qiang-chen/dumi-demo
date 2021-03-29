/**
 * @description
 * @author cq
 * @Date 2021-03-26 18:07:37
 * @LastEditTime 2021-03-29 16:20:37
 * @LastEditors cq
 */

import Form, { Field } from '../../Component/MyRCFieldForm/index';
import style from './index.less';

import React from 'react';

export default function MyForm() {
  const handSubmit = () => {
    alert();
  };

  return (
    <Form>
      <div className={style.form}>
        <Field name="userName">
          <input className={style.input} placeholder="userName" type="text" />
        </Field>
        <Field name="possword">
          <input className={style.input} placeholder="possword" type="text" />
        </Field>
        <button className={style.input} onClick={handSubmit}>
          提交
        </button>
      </div>
    </Form>
  );
}
