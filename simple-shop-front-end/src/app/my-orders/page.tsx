"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import { useRouter } from 'next/navigation';
import MainNav from '@/components/nav';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            router.push('/login');
        }else{
            fetchOrders();
        }
  }, []);
  const fetchOrders = async () => {
    const accessToken = localStorage.getItem('accessToken'); // Make sure you handle authentication appropriately
    try {
      const response = await axios.get(`${process.env.BASE_URL}/api/v1/orders`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      router.push('/home')
    }
  };
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
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Book Name',
      dataIndex: 'bookName',
      key: 'bookName',
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
    },
    {
      title: 'Total Price $',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Order Count',
      dataIndex: 'orderCount',
      key: 'orderCount',
    },
    {
      title: 'Order Date',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (text:string) => <span>{formatDate(text)}</span>,
    },
  ];

  return (
    <div><MainNav />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      
    <Table dataSource={orders} columns={columns} rowKey="id" />
    </div>
    </div>
  );
};

export default MyOrders;
