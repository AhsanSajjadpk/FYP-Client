import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';

const validationSchema = Yup.object({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    phoneNumber: Yup.string()
        .matches(/^\d{4}-\d{7}$/, 'Phone number must be in format ####-#######')
        .required('Phone number is required'),
    address: Yup.string()
        .required('Address is required')
        .min(10, 'Address must be at least 10 characters'),
    postalCode: Yup.string()
        .required('Postal code is required')
        .matches(/^\d{5}(-\d{4})?$/, 'Postal code must be in format ##### or #####-####'),
    cityId: Yup.number()
        .required('City is required'),
    usernameregister: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[A-Z])(?=.*[0-9!@#$%^&*()-_=+{};:'",.<>?/\\|[\]`~])/,
            'Password must contain at least one uppercase letter and one number or special character'
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
});

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    postalCode: '',
    cityId: '',
    usernameregister: '',
    password: '',
    confirmPassword: ''
};

const Account = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);

    const API_URL = 'https://instagrocerrenderserver.up.railway.app/api';

    // Fetch cities and warehouses on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const citiesResponse = await axios.get(`${API_URL}/Cities`);
                setCities(citiesResponse.data);
            } catch (err) {
                setError('Error fetching data');
            }
        };

        fetchData();
    }, [API_URL]);

    const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError, setFieldTouched }) => {
        setError('');
        setLoading(true);
        try {
            // Hash the password using SHA256
            const hashedPassword = CryptoJS.SHA256(values.password).toString();

            const response = await axios.post(`${API_URL}/customers/`, {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone_number: values.phoneNumber,
                address: values.address,
                postal_code: values.postalCode,
                city_id: values.cityId,
                username: values.usernameregister,
                password: hashedPassword
            });

            if (response.data) {
                resetForm();
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'You can now login with your credentials',
                    showConfirmButton: true,
                    confirmButtonText: 'Go to Login',
                    confirmButtonColor: '#3085d6',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/account');
                    }
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.log(errorMessage);

            if (errorMessage.toLowerCase().includes('username')) {
                setFieldError('usernameregister', errorMessage);
                setFieldTouched('usernameregister', true, false);
                document.getElementById('usernameregister').focus();
            } else if (errorMessage.toLowerCase().includes('email')) {
                setFieldError('email', errorMessage);
                setFieldTouched('email', true, false);
                document.getElementById('email').focus();
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const handleLoginSubmit = async (values, { setSubmitting }) => {
        try {
            // Hash the password using SHA256
            const hashedPassword = CryptoJS.SHA256(values.loginPassword).toString();
            const response = await axios.post(`${API_URL}/customers/login`, {
                username: values.loginUsername,
                password: hashedPassword
            });
            
            console.log(response.data);
            if (response.data) {
                // Save customer ID to localStorage
                const customerData = {
                    customerId: response.data.customer_id,
                    city_id: response.data.city_id,
                    address: response.data.address,
                    email: response.data.email,
                };
                localStorage.setItem('customerData', JSON.stringify(customerData));
                
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'Welcome back!',
                    showConfirmButton: true,
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    // Navigate to home page after successful login
                    navigate('/');
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
            setError(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage,
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="account py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    {/* Login Card Start */}
                    <div className="col-xl-6 pe-xl-5">
                        <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                            <h6 className="text-xl mb-32">Login</h6>
                            <Formik
                                initialValues={{ loginUsername: '', loginPassword: '' }}
                                onSubmit={handleLoginSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="loginUsername"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Username or email address <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="text"
                                                className="common-input"
                                                id="loginUsername"
                                                name="loginUsername"
                                                placeholder="Enter username or email"
                                            />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="loginPassword"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Password <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="password"
                                                className="common-input"
                                                id="loginPassword"
                                                name="loginPassword"
                                                placeholder="Enter password"
                                            />
                                        </div>
                                        <div className="mb-24 mt-48">
                                            <div className="flex-align gap-48 flex-wrap">
                                                <button
                                                    type="submit"
                                                    className="btn btn-main py-18 px-40"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Logging in...' : 'Log in'}
                                                </button>
                                                <div className="form-check common-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        id="remember"
                                                    />
                                                    <label
                                                        className="form-check-label flex-grow-1"
                                                        htmlFor="remember"
                                                    >
                                                        Remember me
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-48">
                                            <Link
                                                to="#"
                                                className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    {/* Login Card End */}
                    {/* Register Card Start */}
                    <div className="col-xl-6">
                        <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
                            <h6 className="text-xl mb-32">Register</h6>
                            {error && (
                                <div className="alert alert-danger mb-3" role="alert">
                                    {error}
                                </div>
                            )}
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="firstName"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                First Name <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="text"
                                                className="common-input"
                                                id="firstName"
                                                name="firstName"
                                                placeholder="Enter First Name"
                                            />
                                            <ErrorMessage name="firstName" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="lastName"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Last Name <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="text"
                                                className="common-input"
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Enter Last Name"
                                            />
                                            <ErrorMessage name="lastName" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="email"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Email <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="email"
                                                className="common-input"
                                                id="email"
                                                name="email"
                                                placeholder="Enter Email"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="phoneNumber"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Phone Number <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="text"
                                                className="common-input"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                placeholder="Enter Phone Number (####-#######)"
                                            />
                                            <ErrorMessage name="phoneNumber" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="address"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Address <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                as="textarea"
                                                className="common-input"
                                                id="address"
                                                name="address"
                                                placeholder="Enter Address"
                                                rows={3}
                                                style={{ resize: 'none' }}
                                            />
                                            <ErrorMessage name="address" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="postalCode"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Postal Code <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="text"
                                                className="common-input"
                                                id="postalCode"
                                                name="postalCode"
                                                placeholder="Enter Postal Code (##### or #####-####)"
                                            />
                                            <ErrorMessage name="postalCode" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="cityId"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                City <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                as="select"
                                                className="common-input"
                                                id="cityId"
                                                name="cityId"
                                            >
                                                <option value="">Select a city</option>
                                                {cities.map((city) => (
                                                    <option key={city.city_id} value={city.city_id}>
                                                        {city.city_name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="cityId" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="usernameregister"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Username <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="text"
                                                className="common-input"
                                                id="usernameregister"
                                                name="usernameregister"
                                                placeholder="Enter Username"
                                            />
                                            <ErrorMessage name="usernameregister" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="password"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Password <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="password"
                                                className="common-input"
                                                id="password"
                                                name="password"
                                                placeholder="Enter Password"
                                            />
                                            <ErrorMessage name="password" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="mb-24">
                                            <label
                                                htmlFor="confirmPassword"
                                                className="text-neutral-900 text-lg mb-8 fw-medium"
                                            >
                                                Confirm Password <span className="text-danger">*</span>{" "}
                                            </label>
                                            <Field
                                                type="password"
                                                className="common-input"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                placeholder="Confirm Password"
                                            />
                                            <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-2" />
                                        </div>
                                        <div className="my-48">
                                            <p className="text-gray-500">
                                                Your personal data will be used to process your order, support
                                                your experience throughout this website, and for other purposes
                                                described in our
                                                <Link to="#" className="text-main-600 text-decoration-underline">
                                                    {" "}
                                                    privacy policy
                                                </Link>
                                            </p>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-main py-18 px-40"
                                            disabled={isSubmitting || loading}
                                        >
                                            {loading ? 'Registering...' : 'Register'}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    {/* Register Card End */}
                </div>
            </div>
        </section>
    );
};

export default Account;