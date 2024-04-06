import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Layout, Typography, notification } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const accessToken = localStorage.getItem('accessToken'); // Ensure proper handling of the access token
      try {
        const response = await axios.get(`${process.env.BASE_URL}/api/v1/orders/all`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching all orders:', error);
        // Possibly handle error, e.g., unauthorized access
        notification.error({
          message: 'Fetch Failed',
          description: 'Failed to fetch orders. Please make sure you are logged in as an admin.',
        });
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(dateString));
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'User ID', dataIndex: 'userId', key: 'userId' },
    { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
    { title: 'User Name', dataIndex: 'userName', key: 'userName' },
    { title: 'Book ID', dataIndex: 'bookId', key: 'bookId' },
    { title: 'Book Name', dataIndex: 'bookName', key: 'bookName' },
    { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
    { title: 'Address', dataIndex: 'billingAddress', key: 'billingAddress' },
    { title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice' },
    { title: 'Order Count', dataIndex: 'orderCount', key: 'orderCount' },
    { title: 'Order Date', dataIndex: 'createDate', key: 'createDate', render: (text: string) => <span>{formatDate(text)}</span> },
  ];

  return (
    <Layout>
      <Header style={{ background: '#fff', padding: 0 }}>
        <Title level={2} style={{ margin: 16 }}>Admin Order Processing</Title>
      </Header>
      <Table dataSource={orders} columns={columns} rowKey="id" />
    </Layout>
  );
};

export default AdminOrders;
