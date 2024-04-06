"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Modal, Menu } from 'antd';
import axios from 'axios';
import MainNav from '@/components/nav';
import AdminBoard from '@/components/admin-dashboard';

const { Meta } = Card;

interface Book {
    id: number;
    name: string;
    author: string;
    isbn: string;
    description: string;
    createDate: string;
    lastModified: string | null;
    createdBy: number;
    lastModifiedBy: number | null;
}

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const fetchBooks = async () => {
                try {

                    console.log(accessToken)
                    const response = await axios.get<Book[]>(`${process.env.BASE_URL}/api/v1/books`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setBooks(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    router.push('/login');
                }
            };
            isAdminCheck();
            fetchBooks();
        } else {
            router.push('/login');
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


    const handleCardClick = (book: Book) => {
        setSelectedBook(book);
        setModalVisible(true);
    };

    const handleOrderNow = (bookId: number | any) => {
        router.push(`/orderbook/${bookId}`);
    };

    return (
        <div>
            <MainNav />
            {!isAdmin ?
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {loading ? <p>Loading...</p> :
                        books.map(book => (
                            <Card
                                key={book.id}
                                hoverable
                                style={{ width: 300, margin: '20px 0' }}
                                cover={<img alt="Book" src="book.jpg" />}
                                onClick={() => handleCardClick(book)}
                            >
                                <Meta title={book.name} description={book.author} />
                            </Card>
                        ))
                    }
                    <Modal
                        title="Book Details"
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={[
                            <Button key="orderNow" type="primary" onClick={() => handleOrderNow(selectedBook?.id)}>Order Now</Button>
                        ]}
                    >
                        {selectedBook &&
                            <>
                                <p>Name: {selectedBook.name}</p>
                                <p>Author: {selectedBook.author}</p>
                                <p>ISBN: {selectedBook.isbn}</p>
                                <p>Description: {selectedBook.description}</p>
                            </>
                        }
                    </Modal>
                </div> :
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {loading ? <p>Loading...</p> :
                        <AdminBoard />}
                </div>
            }
        </div>
    );
}
