"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Menu, Input, Form, notification, Col, Row } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import axios from 'axios';
import MainNav from '@/components/nav';
import xss from 'xss';

const { SubMenu } = Menu;

interface Book {
  price: number;
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

type OrderDetails = {
  studentId: string;
  cardNumber: string;
  cardHoldersName: string;
  cvv: string;
  expiryDate: string;
  billingAddress: string;
  orderCount: number;
  bookId?: number;
};


// Helper function for expiry date validation
const validateExpiryDate = (value: any) => {
  if (!value) return false;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [month, year] = value.split('/');
  const expiryYear = parseInt(`20${year}`, 10);
  const expiryMonth = parseInt(month, 10);

  return expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentMonth);
};

// Define a schema for the form validation
// Validation schema
const OrderSchema = Yup.object().shape({
  studentId: Yup.string()
    .matches(/^[0-9]{7}$/, "Student ID must be 7 digit (number)")
    .required('Student ID is required and must be 7 digits (number)'),
  cardNumber: Yup.string()
    .matches(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/, "Card number must be in the format 1234 5678 1234 1234")
    .required('Card Number is required in the format 1234 5678 1234 1234'),
  cardHoldersName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Cardholder's name must only contain letters")
    .required("Cardholder's name is required and must only contain letters"),
  cvv: Yup.string()
    .matches(/^[0-9]{3}$/, "CVV must be 3 digits")
    .required('CVV is required and must be 3 digits'),
  expiryDate: Yup.string()
    .test('is-expiry-date-valid', "Expiry date is invalid or has passed", validateExpiryDate)
    .required('Expiry Date is required'),
  billingAddress: Yup.string().max(100, 'maximum limit of 100 characters.').required('Billing Address is required'),
  orderCount: Yup.number().min(1, 'Must order at least one').max(5,'Cannot order more than 5 at a time ').required('Order count is required'),
});



export default function OrderBook({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<Book | undefined>();

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
          const book = response.data.find((b) => b.id.toString() === params.slug);
          setBook(book);
          setLoading(false);
        } catch (error) {
          console.error(error);
          router.push('/login');
        }
      };

      fetchBooks();
    } else {
      router.push('/login');
    }
  }, []);


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
  const handleSubmit = (values: OrderDetails, { resetForm }: any) => {
    console.log(values)
    const orderPayload = {
      "studentId": values.studentId,
      "cardNumber": values.cardNumber,
      "cardHoldersName": values.cardHoldersName,
      "cvv": values.cvv,
      "expiryDate": values.expiryDate,
      "billingAddress": xss(values.billingAddress),
      "orderCount": values.orderCount,
      "bookId": book?.id
    }
    const accessToken = localStorage.getItem('accessToken');
    axios.post(`${process.env.BASE_URL}/api/v1/orders`, orderPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then((response) => {
      notification.success({
        message: 'Reservation Successful',
        description: `Your order for ${values.orderCount} copy/copies of "${book?.name}" is confirmed. Please collect it from our bookstore with your student ID.`,
        duration: 10,
      });
    }).catch(() => {
      notification.error({
        message: 'Reservation Failed',
        description: `Your order for ${values.orderCount} copy/copies of "${book?.name}" Failed`,
        duration: 10,
      });
    })

    resetForm();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>Book not found</p>;
  }
  return (
    <div>
      <MainNav />
      <Card title={book.name} style={{ margin: '20px' }}>
        <p>Author: {book.author}</p>
        <p>ISBN: {book.isbn}</p>
        <p>Description: {book.description}</p>
        <p>Price: ${book.price}</p>
      </Card>

      <Row justify="center" style={{ marginTop: '20px' }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Formik
            initialValues={{
              studentId: '',
              cardNumber: '',
              cardHoldersName: '',
              cvv: '',
              expiryDate: '',
              billingAddress: '',
              orderCount: 1
            }}
            validationSchema={OrderSchema}
            onSubmit={handleSubmit}
            validateOnMount={true} 
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => (
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Order Count" help={errors.orderCount ? errors.orderCount : ""}
                  validateStatus={touched.orderCount && errors.orderCount ? 'error' : undefined}>
                  <Input name="orderCount" type="number" onChange={(event) => setFieldValue('orderCount', event.target.value)} value={values.orderCount} min={1} />
                </Form.Item>

                <Form.Item label="Student ID" help={ errors.studentId ? errors.studentId : ""}
                  validateStatus={touched.studentId && errors.studentId ? 'error' : undefined}>
                  <Input name="studentId" onChange={(event) => setFieldValue('studentId', event.target.value)} value={values.studentId} />
                </Form.Item>

                <Form.Item label="Card Number" help={ errors.cardNumber ? errors.cardNumber : ""}
                  validateStatus={touched.cardNumber && errors.cardNumber ? 'error' : undefined}>
                  <InputMask
                    mask="9999 9999 9999 9999"
                    value={values.cardNumber}
                    onChange={(event: any) => {
                      // Trim the input to adhere to the mask's length of 19 characters
                      const trimmedValue = event.target.value.slice(0, 19);
                      setFieldValue("cardNumber", trimmedValue);
                    }}
                    maskChar={null}>
                    {(inputProps: any) => <Input {...inputProps} />}
                  </InputMask>
                </Form.Item>

                <Form.Item label="Cardholder's Name" help={ errors.cardHoldersName ? errors.cardHoldersName : ""}
                  validateStatus={touched.cardHoldersName && errors.cardHoldersName ? 'error' : undefined}>
                  <Input name="cardHoldersName" onChange={(event) => setFieldValue('cardHoldersName', event.target.value)} value={values.cardHoldersName} />
                </Form.Item>

                <Form.Item label="CVV" help={errors.cvv ? errors.cvv : ""}
                  validateStatus={touched.cvv && errors.cvv ? 'error' : undefined}>
                  <Input name="cvv" onChange={(event) => setFieldValue('cvv', event.target.value)} value={values.cvv} />
                </Form.Item>

                <Form.Item label="Expiry Date (MM/YY)" help={ errors.expiryDate ? errors.expiryDate : ""}
                  validateStatus={touched.expiryDate && errors.expiryDate ? 'error' : undefined}>
                  <InputMask
                    mask="99/99"
                    value={values.expiryDate}
                    onChange={(event: any) => {
                      const trimmedValue = event.target.value.slice(0, 5);
                      setFieldValue("expiryDate", trimmedValue)}
                    }
                    maskChar={null}>
                    {(inputProps: any) => <Input {...inputProps} />}
                  </InputMask>
                </Form.Item>

                <Form.Item label="Billing Address" help={touched.billingAddress && errors.billingAddress ? errors.billingAddress : ""}
                  validateStatus={touched.billingAddress && errors.billingAddress ? 'error' : undefined}>
                  <Input name="billingAddress" onChange={(event) => setFieldValue('billingAddress', event.target.value)} value={values.billingAddress} />
                </Form.Item>



                <Button type="primary" htmlType="submit">Place Reservation</Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </div>
  );
}
