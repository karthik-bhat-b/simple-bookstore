"use client";
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { firstname: any; lastname: any; email: any; password: any; }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.BASE_URL}/api/v1/auth/register`, {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password
      });
      message.success('Registration successful. Redirecting to login...');

      // Display loading message for 1.5 seconds
      const timer = setTimeout(() => {
        clearTimeout(timer);
        router.push('/login'); // Redirect to login page after successful registration
      }, 1500);
    } catch (error) {
      message.error('Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1>Signup</h1>
      <img src="bookstore.png" alt="Banner" style={{ width: '30%', marginBottom: '20px' }} />
      <div style={{ width: '30%' }}>
        <Form
          name="signupForm"
          onFinish={onFinish}
        >
          <Form.Item
            name="firstname"
            rules={[
              { required: true, message: 'Please enter your first name' }
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastname"
            rules={[
              { required: true, message: 'Please enter your last name' }
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' },
              { pattern: /^(?!.*--)[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, message: 'Email id should be of the format abcd@abc.xyz' }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 8, message: 'Password must be at least 8 characters long' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!&()@])[A-Za-z\d!&()@]{8,}$/, message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character (!&()@), and no spaces' }
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Signup</Button>
          </Form.Item>
        </Form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Signup;
