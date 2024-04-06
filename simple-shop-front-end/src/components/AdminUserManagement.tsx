import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, Table } from 'antd';
import axios from 'axios';
import AddUserForm, { IUserFormValues } from './AddUserForm';

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const fetchUsers = async () => {
    try {
      const response = await axios.get<IUser[]>(`${process.env.BASE_URL}/api/v1/users/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      notification.error({ message: 'Error fetching users' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showAddUserModal = () => setIsModalVisible(true);
  const handleAddUserModalClose = () => setIsModalVisible(false);

  const handleAddUser = async (values: IUserFormValues) => {
    try {
      await axios.post(`${process.env.BASE_URL}/api/v1/admin/create-account`, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      notification.success({ message: 'User added successfully' });
      fetchUsers();
      handleAddUserModalClose();
    } catch (error) {
      notification.error({ message: 'Error adding user' });
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstname',
      key: 'firstname',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastname',
      key: 'lastname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  return (
    <div>
      <Button onClick={showAddUserModal} type="primary" style={{ marginBottom: 16 }}>
        Add New User
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />
      <Modal
        title="Add New User"
        open={isModalVisible}
        onCancel={handleAddUserModalClose}
        footer={null}
      >
        <AddUserForm onAddUser={handleAddUser} />
      </Modal>
    </div>
  );
};

export default UserManagement;
