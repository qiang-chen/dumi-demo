/**
 * @description
 * @author cq
 * @Date 2021-03-26 18:30:01
 * @LastEditTime 2021-03-29 16:17:03
 * @LastEditors cq
 */
import React, { FC } from 'react';
import useForm from './useForm';
import FieldContext from './FieldContext';

type FormProps = {
  children: Element | any;
};

const Form: FC<FormProps> = ({ children }) => {
  const [FormStore] = useForm();
  return (
    <FieldContext.Provider value={FormStore}>
      <form>{children}</form>
    </FieldContext.Provider>
  );
};

export default Form;
