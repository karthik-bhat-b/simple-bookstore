"use client"
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import MainNav from '@/components/nav';

const ResetPasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!&()@])[A-Za-z\d!&()@]{8,}$/, 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character (!&()@), and no spaces')
        .required('New password is required'),
    confirmationPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirming new password is required'),
});

const ResetPassword = () => {

    const [isSubmitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            router.push('/login');
        }
    }, []);


    const handleSubmit = async (values: any) => {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/api/v1/users/change-password`, values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            message.success('Password successfully updated');
        } catch (error) {
            message.error('An error occurred');
        }
        setSubmitting(false);
    };

    return (
        <div>
            <MainNav />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <h2>Reset Password</h2>
                <div style={{ width: '30%' }}>
                    <Formik
                        initialValues={{ currentPassword: '', newPassword: '', confirmationPassword: '' }}
                        validationSchema={ResetPasswordSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <label htmlFor="currentPassword">Current Password</label>
                            <Field type="password" name="currentPassword" as={Input} />
                            <ErrorMessage name="currentPassword" component="div" />
                            <br /><br />

                            <label htmlFor="newPassword">New Password</label>
                            <Field type="password" name="newPassword" as={Input} />
                            <ErrorMessage name="newPassword" component="div" />
                            <br /><br />

                            <label htmlFor="confirmationPassword">Confirm New Password</label>
                            <Field type="password" name="confirmationPassword" as={Input} />
                            <ErrorMessage name="confirmationPassword" component="div" />
                            <br /><br />

                            <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                                Reset Password
                            </Button>
                        </Form>

                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
