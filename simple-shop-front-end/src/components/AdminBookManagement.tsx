// pages/admin/books/BookManagement.tsx
import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, notification, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import AddBookForm from './AddBookForm'; // Import the AddBookForm component

export interface Book {
    id: number;
    name: string;
    author: string;
    isbn: string;
    price: number;
    description: string;
    createDate?: string;
    lastModified?: string | null;
    createdBy?: number;
    lastModifiedBy?: number | null;
  }

  
const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const fetchBooks = async () => {
    try {
      const response = await axios.get<Book[]>(`${process.env.BASE_URL}/api/v1/books`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      notification.error({ message: 'Error fetching books' });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const showAddBookModal = () => setIsModalVisible(true);
  const handleAddBookModalClose = () => setIsModalVisible(false);

  const deleteBook = async (bookId: number) => {
    try {
      await axios.delete(`${process.env.BASE_URL}/api/v1/admin/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      notification.success({ message: 'Book deleted successfully' });
      fetchBooks();
    } catch (error) {
      notification.error({ message: 'Error deleting book' });
    }
  };

  const confirmDelete = (bookId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this book?',
      onOk: () => deleteBook(bookId),
    });
  };

  const columns: ColumnsType<Book> = [
    {
      title: 'Book Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
    },
    {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
      },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => confirmDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={showAddBookModal} type="primary" style={{ marginBottom: 16 }}>
        Add New Book
      </Button>
      <Table dataSource={books} columns={columns} rowKey="id" />
      <Modal
        title="Add New Book"
        open={isModalVisible}
        onCancel={handleAddBookModalClose}
        footer={null}
      >
        <AddBookForm onAddBook={fetchBooks} onClose={handleAddBookModalClose} />
      </Modal>
    </div>
  );
};

export default BookManagement;
