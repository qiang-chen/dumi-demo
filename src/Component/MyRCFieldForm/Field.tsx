/**
 * @description
 * @author cq
 * @Date 2021-03-26 18:30:21
 * @LastEditTime 2021-03-29 19:51:12
 * @LastEditors cq
 */
import React, { Component, FC, useContext, useEffect, useReducer } from 'react';
import FieldContext from './FieldContext';

type FieldProps = {
  name: string;
  children: Element;
};

class Field extends Component<any, FieldProps> {
  constructor(props: FieldProps) {
    super(props);
  }

  static contextType = FieldContext;

  componentDidMount() {
    const { registerEntity } = this.context as any;
    registerEntity(this);
  }

  getCntrolled = () => {
    const { getFieldValue, setFieldValue } = this.context as any;
    const { name } = this.props;
    return {
      value: getFieldValue(name) || '', // 从formStore当中读取数据
      onChange: (e: any) => {
        const newValue = e.target.value;
        // 设置formStore的数据
        setFieldValue({ [name]: newValue });
      },
    };
  };

  onStoreChange = () => {
    this.forceUpdate();
  };

  render() {
    const { children } = this.props;
    return React.cloneElement(children, this.getCntrolled());
  }
}

export default Field;
