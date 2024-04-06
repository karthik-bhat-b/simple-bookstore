import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Modal, Menu } from 'antd';
import axios from 'axios';

export default function MainNav() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.get(`${process.env.BASE_URL}/api/v1/auth/logout`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            localStorage.removeItem('accessToken');
            router.push('/login');
        } catch (error) {
            console.error(error);
            localStorage.removeItem('accessToken');
            router.push('/login');
        }
    };
    const handleHomeClick = () => {
        router.push('/home');
    }
    const handleMyordersClick = () => {
        router.push('/my-orders');
    }
    const handleChangePasswordClick = () => {
        router.push('/change-password');
    }
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {

            isAdminCheck();
        }
    }, []);
    const isAdminCheck = async () => {
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
    const menuItems = [
        {
            key: 'home',
            label: 'Home',
            onClick: handleHomeClick,
        },
        {
            key: 'profile',
            label: 'Profile',
            children: [
                ...(!isAdmin
                    ? [
                        {
                            key: 'profile:1',
                            label: 'My Orders',
                            onClick: handleMyordersClick,
                        },
                    ]
                    : []),
                {
                    key: 'profile:2',
                    label: 'Change My Password',
                    onClick: handleChangePasswordClick,
                }
            ],
        },
        {
            key: 'logout',
            label: 'Logout',
            onClick: handleLogout,
        }
    ];

    return (
        <Menu mode="horizontal" items={menuItems} style={{ justifyContent: 'flex-end' }} />
    )
}