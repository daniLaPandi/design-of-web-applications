'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../../lib/slices/authSlice';
import type { RootState, AppDispatch } from '../../../lib/store';

export default function Register() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [validationError, setValidationError] = useState('');

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
        setValidationError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setValidationError('Password must be at least 6 characters');
            return;
        }

        dispatch(register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
        }));
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
                        <h2 className="text-center mb-4">Register</h2>

                        {(error || validationError) && (
                            <Alert variant="danger">{error || validationError}</Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    placeholder="Choose a username"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email"
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
                                    minLength={6}
                                    placeholder="Enter password"
                                />
                                <Form.Text className="text-muted">
                                    Must be at least 6 characters
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm password"
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mb-3"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </Form>

                        <div className="text-center">
                            <p className="mb-0">
                                Already have an account?{' '}
                                <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                                    Login here
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
