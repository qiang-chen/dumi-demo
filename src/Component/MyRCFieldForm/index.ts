/**
 * @description
 * @author cq
 * @Date 2021-03-26 18:29:29
 * @LastEditTime 2021-04-06 14:34:04
 * @LastEditors cq
 */

import React from 'react';
// import Form from './Form';
import _Form from './Form';
import Field from './Field';
import useForm from './useForm';

// forwardRef  主要为了接受类组件传过来的ref  也就是转发
const Form = React.forwardRef(_Form);
Form.useForm = useForm;

// Form.useForm = useForm;

export { Field };

export default Form;
