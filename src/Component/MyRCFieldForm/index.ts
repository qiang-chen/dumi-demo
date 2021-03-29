/**
 * @description
 * @author cq
 * @Date 2021-03-26 18:29:29
 * @LastEditTime 2021-03-29 14:26:31
 * @LastEditors cq
 */

import React from 'react';
import Form from './Form';
import Field from './Field';
import useForm from './useForm';

// const Form = React.forwardRef((props, ref) => {
//   return <_Form { ...props } />
// });
// Form.useForm = useForm;

Form.useForm = useForm;

export { Field };

export default Form;
