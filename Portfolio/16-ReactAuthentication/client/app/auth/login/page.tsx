'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../../lib/slices/authSlice';
import type { RootState, AppDispatch } from '../../../lib/store';

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)',
            paddingTop: '5rem',
            paddingBottom: '3rem'
        }}>
            <Container style={{ maxWidth: '500px' }}>
                <Card className="shadow-lg">
                    <Card.Body className="p-5">
                        <h2 className="text-center mb-4">Login</h2>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter username"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter password"
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mb-3"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Form>

                        <div className="text-center">
                            <p className="mb-0">
                                Don't have an account?{' '}
                                <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                                    Register here
                                </Link>
                            </p>
                            <Link href="/" style={{ textDecoration: 'none' }}>
                                Back to Home
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
