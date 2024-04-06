// components/AddUserForm.tsx
import React from 'react';
import { Form, Input, Button, Select, notification } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

export interface IUserFormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AddUserFormProps {
  onAddUser: (values: IUserFormValues) => void;
}

const userSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required').max(255, 'First name must be less than 255 characters'),
  lastname: Yup.string().required('Last name is required').max(255, 'Last name must be less than 255 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!&()@])[A-Za-z\d!&()@]{8,}$/, 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character (!&()@), and no spaces'
  ),
  role: Yup.string().oneOf(['ADMIN', 'CUSTOMER']).required('Role is required'),
});

const AddUserForm: React.FC<AddUserFormProps> = ({ onAddUser }) => {
  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'CUSTOMER' as 'ADMIN' | 'CUSTOMER',
      }}
      validationSchema={userSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        onAddUser(values);
        setSubmitting(false);
        resetForm();
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form layout="vertical" onFinish={() => handleSubmit()}>
          <Form.Item
            label="First Name"
            help={touched.firstname && errors.firstname ? errors.firstname : ""}
            validateStatus={touched.firstname && errors.firstname ? 'error' : undefined}
          >
            <Input name="firstname" onChange={handleChange} value={values.firstname} />
          </Form.Item>
          <Form.Item
            label="Last Name"
            help={touched.lastname && errors.lastname ? errors.lastname : ""}
            validateStatus={touched.lastname && errors.lastname ? 'error' : undefined}
          >
            <Input name="lastname" onChange={handleChange} value={values.lastname} />
          </Form.Item>
          <Form.Item
            label="Email"
            help={touched.email && errors.email ? errors.email : ""}
            validateStatus={touched.email && errors.email ? 'error' : undefined}
          >
            <Input name="email" onChange={handleChange} value={values.email} />
          </Form.Item>
          <Form.Item
            label="Password"
            help={touched.password && errors.password ? errors.password : ""}
            validateStatus={touched.password && errors.password ? 'error' : undefined}
          >
            <Input.Password name="password" onChange={handleChange} value={values.password} />
          </Form.Item>
          <Form.Item label="Role">
            <Select onChange={value => handleChange({ target: { name: 'role', value } })} value={values.role}>
              <Option value="ADMIN">Admin</Option>
              <Option value="CUSTOMER">Customer</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add User
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddUserForm;
