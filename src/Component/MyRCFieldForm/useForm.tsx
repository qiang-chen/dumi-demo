/**
 * @description 自定义hook
 * @author cq
 * @Date 2021-03-26 18:30:32
 * @LastEditTime 2021-03-29 16:27:00
 * @LastEditors cq
 */
import React, { createRef, forwardRef, useRef } from 'react';

class FormStore {
  stote: any;
  constructor() {
    // 这里储存一下form的变量
    this.stote = {};
  }

  // 定义一个获取属性的方法
  getFieldValue(name: any) {
    console.log(this, 111);
    return this.stote[name];
  }

  //设置属性的方法

  setFieldValue(newStore: any) {
    this.stote = {
      ...this.stote,
      ...newStore,
    };
    //把仓库的数据更新完毕后要带着组件更新  否则页面不会有变化
  }

  getForm() {
    return {
      setFieldValue: this.setFieldValue,
      getFieldValue: this.getFieldValue,
    };
  }
}

export default function useForm() {
  const formRef = useRef(null);
  if (!formRef.current) {
    const FormFn = new FormStore();
    formRef.current = FormFn.getForm() as any;
  }
  return [formRef.current || {}];
}
