/**
 * @description 自定义hook
 * @author cq
 * @Date 2021-03-26 18:30:32
 * @LastEditTime 2021-04-12 17:14:37
 * @LastEditors cq
 */
import React, { createRef, forwardRef, useRef } from 'react';

class FormStore {
  stote: any;
  fieldEntities: any;
  callbacks: {};
  constructor() {
    // 这里储存一下form的变量
    this.stote = {};
    // 需要更新的组件
    this.fieldEntities = {};
    this.callbacks = {};
  }
  //将传入的失败和成功函数存储起来
  setCallback = (callback: {}) => {
    this.callbacks = {
      ...this.callbacks,
      ...callback,
    };
  };

  // 定义一个获取属性的方法
  getFieldValue = (name: any) => {
    return this.stote[name];
  };

  registerEntity = (entity: any) => {
    this.fieldEntities = {
      ...this.fieldEntities,
      [entity?.props?.name]: entity,
    };
    //销毁
    return () => {
      delete this.fieldEntities[entity?.props?.name];
    };
  };

  //设置属性的方法
  setFieldValue = (newStore: any) => {
    this.stote = {
      ...this.stote,
      ...newStore,
    };
    //把仓库的数据更新完毕后要带着组件更新  否则页面不会有变化
    // 将传入的值进行更新
    Object.keys(newStore).forEach(name => {
      this.fieldEntities[name].onStoreChange();
    });
  };

  // 验证函数
  validate = () => {
    let err: { [x: string]: any; value: any }[] = [];

    // 遍历this.store
    Object.keys(this.fieldEntities).forEach(key => {
      const entity = this.fieldEntities[key];
      const { rules } = entity.props || {};
      const rule = rules && rules[0];
      const value = this.getFieldValue(key);

      if (rule && rule.required && value === undefined) {
        err.push({
          [key]: rule.message,
          value,
        });
      }
    });

    return err;
  };

  // 提交函数
  submit = () => {
    const { onFinish, onFinishFailed } = this.callbacks as any;
    let err = this.validate();

    if (err.length === 0) {
      onFinish && onFinish({ ...this.stote });
    } else {
      onFinishFailed && onFinishFailed(err, { ...this.stote });
    }
  };

  getForm() {
    return {
      setFieldValue: this.setFieldValue,
      getFieldValue: this.getFieldValue,
      registerEntity: this.registerEntity,
      submit: this.submit,
      setCallback: this.setCallback,
    };
  }
}

export default function useForm(form) {
  const formRef = useRef(null);
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const FormFn = new FormStore();
      formRef.current = FormFn.getForm() as any;
    }
  }
  return [formRef.current];
}
