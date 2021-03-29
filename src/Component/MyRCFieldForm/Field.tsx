/**
 * @description
 * @author cq
 * @Date 2021-03-26 18:30:21
 * @LastEditTime 2021-03-29 16:26:01
 * @LastEditors cq
 */
import React, { FC, useContext } from 'react';
import FieldContext from './FieldContext';

type FieldProps = {
  name: string;
  children: Element | any;
};

const Field: FC<FieldProps> = ({ children, name }) => {
  //传入的children属性我们需要进行神拷贝一份
  //然后在上面绑定change属性 进行数据的双向绑定

  const context = useContext(FieldContext);

  const getCntrolled = function() {
    console.log(context);
    const { getFieldValue, setFieldValue } = context as any;
    return {
      value: getFieldValue(name) || '', // 从formStore当中读取数据
      onChange: (e: any) => {
        const newValue = e.target.value;
        // 设置formStore的数据
        setFieldValue({ [name]: newValue });
      },
    };
  };
  return React.cloneElement(children, getCntrolled());
};

export default Field;
