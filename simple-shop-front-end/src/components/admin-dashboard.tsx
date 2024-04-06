import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Modal, Menu } from 'antd';
import axios from 'axios';
import AdminOrders from './AdminOrders';
import { Layout, Typography } from 'antd';
import BookManagement from './AdminBookManagement';
import UserManagement from './AdminUserManagement';

const { Header } = Layout;
const { Title } = Typography;

export default function AdminBoard() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken){
            fetchOrders();
        }
    }, []);
    const fetchOrders = async () => {
        try {
            
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${process.env.BASE_URL}/api/v1/admin/valid`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setIsAdmin(true);
        } catch (error) {
            setIsAdmin(false)
        }
    };

    return (
        <div>
        <AdminOrders />
        <br />
        <Header style={{ background: '#fff', padding: 0 }}>
        <Title level={2} style={{ margin: 16 }}>Admin Book Management</Title>
        </Header>
        <BookManagement />
        <UserManagement />
        </div>
        
    )
}