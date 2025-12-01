'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../lib/store';
import Navbar from '../../../components/Navbar';
import api from '../../../lib/api';

interface Character {
  name: string;
  affiliation: string;
  image: string;
  bio: string;
}

interface Movie {
  episode: string;
  title: string;
  year: number;
  poster: string;
  best_character: Character;
}

interface Comment {
  _id?: string;
  name: string;
  comment: string;
  createdAt?: string;
}

interface Votes {
  likes: number;
  dislikes: number;
}

const API_URL = '/api';

export default function MovieDetails({ params }: { params: Promise<{ episode: string }> }) {
  const { episode } = use(params);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [votes, setVotes] = useState<Votes>({ likes: 0, dislikes: 0 });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
    fetchComments();
    fetchVotes();
  }, [episode]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`${API_URL}/movies/${episode}`);
      const data = await response.json();
      setMovie(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie:', error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/comments/${episode}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchVotes = async () => {
    try {
      const response = await fetch(`${API_URL}/votes/${episode}`);
      const data = await response.json();
      setVotes({ likes: data.likes, dislikes: data.dislikes });
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to comment');
      return;
    }

    if (!comment.trim()) return;

    try {
      const response = await api.post('/comments', {
        movieEpisode: episode,
        comment: comment.trim(),
      });

      if (response.status === 201) {
        setComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Please log in to add comments');
    }
  };

  const handleVote = async (type: 'like' | 'dislike') => {
    if (!isAuthenticated) {
      alert('Please log in to vote');
      return;
    }

    try {
      const response = await api.post(`/votes/${episode}/${type}`);
      setVotes({ likes: response.data.likes, dislikes: response.data.dislikes });
    } catch (error) {
      console.error(`Error ${type}ing movie:`, error);
      alert('Please log in to vote');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-5 text-center">
          <h2>Loading...</h2>
        </Container>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Navbar />
        <Container className="mt-5 text-center">
          <h2>Movie not found</h2>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)',
        paddingTop: '3rem',
        paddingBottom: '3rem'
      }}>
        <Container>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="outline-light" className="mb-4">
              ← Back to Movies
            </Button>
          </Link>

          <Card className="mb-4 shadow-lg">
            <Row className="g-0">
              <Col md={4}>
                <Card.Img
                  src={`/images/${movie.poster}`}
                  alt={movie.title}
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </Col>
              <Col md={8}>
                <Card.Body>
                  <Card.Title as="h1" className="text-capitalize mb-3">
                    {movie.title}
                  </Card.Title>
                  <Card.Text className="text-muted h5">
                    Episode {movie.episode} • Year: {movie.year}
                  </Card.Text>

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      variant="success"
                      onClick={() => handleVote('like')}
                      disabled={!isAuthenticated}
                      title={isAuthenticated ? '' : 'Please log in to vote'}
                    >
                      👍 Like ({votes.likes})
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleVote('dislike')}
                      disabled={!isAuthenticated}
                      title={isAuthenticated ? '' : 'Please log in to vote'}
                    >
                      👎 Dislike ({votes.dislikes})
                    </Button>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>

          <Card className="mb-4 shadow-lg">
            <Card.Body>
              <Card.Title as="h2" className="mb-4">
                Featured Character
              </Card.Title>
              <Row>
                <Col md={4}>
                  <img
                    src={`/images/${movie.best_character.image}`}
                    alt={movie.best_character.name}
                    className="w-100 rounded shadow"
                  />
                </Col>
                <Col md={8}>
                  <h3>{movie.best_character.name}</h3>
                  <p className="badge bg-info text-dark mb-3">
                    {movie.best_character.affiliation}
                  </p>
                  <p className="lead">{movie.best_character.bio}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title as="h2" className="mb-4">
                Comments
              </Card.Title>

              {isAuthenticated ? (
                <Form onSubmit={handleSubmit} className="mb-4 p-4 bg-light rounded">
                  <Form.Group className="mb-3">
                    <Form.Label>Your Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your comment"
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Add Comment
                  </Button>
                </Form>
              ) : (
                <Alert variant="warning" className="mb-4">
                  <strong>Please log in to add comments.</strong>
                  <div className="mt-2">
                    <Link href="/auth/login">
                      <Button variant="primary" size="sm" className="me-2">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="outline-primary" size="sm">Register</Button>
                    </Link>
                  </div>
                </Alert>
              )}

              <div>
                {comments.length === 0 ? (
                  <p className="text-muted fst-italic">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((c) => (
                    <Card key={c._id} className="mb-3">
                      <Card.Body>
                        <Card.Title className="h5">{c.name}</Card.Title>
                        <Card.Text>{c.comment}</Card.Text>
                        {c.createdAt && (
                          <Card.Text className="text-muted small">
                            {new Date(c.createdAt).toLocaleString()}
                          </Card.Text>
                        )}
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}
