'use client';

import { useEffect } from 'react';
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout, loadUser } from '../lib/slices/authSlice';
import type { RootState, AppDispatch } from '../lib/store';

export default function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (token && !user) {
            dispatch(loadUser());
        }
    }, [token, user, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    return (
        <BSNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
            <Container>
                <Link href="/" passHref legacyBehavior>
                    <BSNavbar.Brand style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', color: '#FFD700' }}>
                        STAR WARS
                    </BSNavbar.Brand>
                </Link>
                <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BSNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isAuthenticated ? (
                            <>
                                <BSNavbar.Text className="me-3" style={{ color: '#fff' }}>
                                    Welcome, <strong>{user?.username}</strong>
                                </BSNavbar.Text>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" passHref legacyBehavior>
                                    <Button variant="outline-light" size="sm" className="me-2">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/auth/register" passHref legacyBehavior>
                                    <Button variant="primary" size="sm">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
}
