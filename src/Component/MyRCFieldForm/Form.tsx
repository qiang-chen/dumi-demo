/**
 * @description
 * @author cq
 * @Date 2021-03-26 18:30:01
 * @LastEditTime 2021-04-06 14:45:29
 * @LastEditors cq
 */
import React, { FC, useEffect } from 'react';
import useForm from './useForm';
import FieldContext from './FieldContext';

type FormProps = {
  children: Element | any;
  onFinish: (value: any) => void;
  onFinishFailed: (err: any, value: any) => void;
  form: any;
};

const Form: FC<FormProps> = (
  { children, onFinish, onFinishFailed, form },
  ref,
) => {
  const [FormStore] = useForm(form);

  React.useImperativeHandle(ref, () => FormStore);

  FormStore.setCallback({
    onFinish,
    onFinishFailed,
  });

  return (
    <FieldContext.Provider value={FormStore}>
      <form
        onSubmit={e => {
          e.preventDefault();
          FormStore.submit();
        }}
      >
        {children}
      </form>
    </FieldContext.Provider>
  );
};

export default Form;
