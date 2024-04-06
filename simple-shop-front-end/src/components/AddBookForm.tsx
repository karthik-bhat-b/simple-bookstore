import React from 'react';
import { Button, Form, Input, InputNumber, Modal, notification } from 'antd';
import axios from 'axios';
import { FormikHelpers, useFormik } from 'formik';
import xss from 'xss';

interface FormValues {
  name: string;
  author: string;
  isbn: string;
  price: number;
  description: string;
}

const AddBookForm: React.FC<{ onAddBook: () => void; onClose: () => void }> = ({ onAddBook, onClose }) => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      author: '',
      isbn: '',
      price: 0,
      description: '',
    },
    onSubmit: async (values, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
      try {
        const sanitizedValues = {
          name: xss(values.name),
          author: xss(values.author),
          isbn: xss(values.isbn),
          price: values.price,
          description: xss(values.description),
        };
        await axios.post(`${process.env.BASE_URL}/api/v1/admin/add-book`, sanitizedValues, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        notification.success({ message: 'Book added successfully' });
        onAddBook();
        onClose();
        resetForm();
      } catch (error) {
        notification.error({ message: 'Error adding book' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Form layout="vertical" onFinish={formik.handleSubmit}>
      <Form.Item label="Name" required>
        <Input name="name" onChange={formik.handleChange} value={formik.values.name} />
      </Form.Item>
      <Form.Item label="Author" required>
        <Input name="author" onChange={formik.handleChange} value={formik.values.author} />
      </Form.Item>
      <Form.Item label="ISBN" required>
        <Input name="isbn" onChange={formik.handleChange} value={formik.values.isbn} />
      </Form.Item>
      <Form.Item label="Price" required>
        <InputNumber name="price" onChange={(value) => formik.setFieldValue('price', value)} value={formik.values.price} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Description" required>
        <Input.TextArea name="description" rows={4} onChange={formik.handleChange} value={formik.values.description} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
          Add Book
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddBookForm;
