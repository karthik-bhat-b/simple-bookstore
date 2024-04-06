"use client";
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: any; password: any; }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.BASE_URL}/api/v1/auth/authenticate`, {
        email: values.email,
        password: values.password
      });
      localStorage.setItem('accessToken', response.data.access_token);
      message.success('Login successful');
      router.push('/home');
    } 
    catch (error) {
      if(error instanceof AxiosError){
        message.error('Login failed: '+ error?.response?.data);
      }else{
        message.error('Login failed');
      }
      
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1>Login</h1>
      <img src="bookstore.png" alt="Banner" style={{ width: '30%', marginBottom: '20px' }} />
      <div style={{ width: '30%' }}>
        <Form
          name="loginForm"
          onFinish={onFinish}
        >
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
              { max:255, message: 'Maximum length at least 255 charecters'},
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!&()@])[A-Za-z\d!&()@]{8,}$/, message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character (!&()@), and No spaces' }
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
          </Form.Item>
        </Form>
        <p>Don't have an account? <a href="/register">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;
