'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';

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

interface Votes {
  likes: number;
  dislikes: number;
}

const API_URL = '/api';

const getAffiliationLogo = (affiliation: string): string => {
  const affiliationMap: { [key: string]: string } = {
    'Jedi': 'jedi.png',
    'Sith': 'sith.png',
    'Empire': 'empire.png',
    'Rebellion': 'rebel.png',
  };
  return affiliationMap[affiliation] || '';
};

const getAffiliationColor = (affiliation: string): string => {
  const evilAffiliations = ['Sith', 'Empire'];
  return evilAffiliations.includes(affiliation) ? 'danger' : 'primary';
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: Votes }>({});
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
    fetchAllVotes();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/movies`);
      const data = await response.json();
      setMovies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const fetchAllVotes = async () => {
    try {
      const response = await fetch(`${API_URL}/votes`);
      const data = await response.json();
      const votesMap: { [key: string]: Votes } = {};
      data.forEach((vote: any) => {
        votesMap[vote.movieEpisode] = {
          likes: vote.likes,
          dislikes: vote.dislikes
        };
      });
      setVotes(votesMap);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleVote = async (episode: string, type: 'like' | 'dislike') => {
    try {
      const response = await fetch(`${API_URL}/votes/${episode}/${type}`, {
        method: 'POST',
      });
      const data = await response.json();
      setVotes(prev => ({
        ...prev,
        [episode]: {
          likes: data.likes,
          dislikes: data.dislikes
        }
      }));
    } catch (error) {
      console.error(`Error ${type}ing movie:`, error);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h2>Loading...</h2>
      </Container>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)',
      paddingTop: '3rem',
      paddingBottom: '3rem'
    }}>
      <Container>
        <h1 className="text-center mb-5" style={{
          color: '#FFD700',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          STAR WARS MOVIES
        </h1>

        <Row xs={1} md={2} lg={3} className="g-4">
          {movies.map((movie) => {
            const affiliationLogo = getAffiliationLogo(movie.best_character.affiliation);
            const affiliationColor = getAffiliationColor(movie.best_character.affiliation);
            const isHovered = hoveredMovie === movie.episode;
            const movieVotes = votes[movie.episode] || { likes: 0, dislikes: 0 };

            return (
              <Col key={movie.episode}>
                <Card
                  className="h-100 shadow-lg"
                  style={{
                    transition: 'transform 0.3s',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseEnter={() => setHoveredMovie(movie.episode)}
                  onMouseLeave={() => setHoveredMovie(null)}
                >
                  <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
                    {isHovered && affiliationLogo ? (
                      <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: affiliationColor === 'danger' ? '#fee' : '#eef'
                      }}>
                        <img
                          src={`/images/${affiliationLogo}`}
                          alt={movie.best_character.affiliation}
                          style={{
                            maxHeight: '300px',
                            maxWidth: '300px',
                            objectFit: 'contain',
                            filter: affiliationColor === 'primary'
                              ? 'brightness(0) saturate(100%) invert(27%) sepia(97%) saturate(3447%) hue-rotate(202deg) brightness(94%) contrast(101%)'
                              : 'brightness(0) saturate(100%) invert(16%) sepia(93%) saturate(7471%) hue-rotate(359deg) brightness(95%) contrast(117%)'
                          }}
                        />
                      </div>
                    ) : (
                      <Card.Img
                        variant="top"
                        src={`/images/${movie.poster}`}
                        alt={movie.title}
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title className="text-capitalize" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                      {movie.title}
                    </Card.Title>
                    <Card.Text className="text-muted">
                      Year: {movie.year}
                    </Card.Text>

                    <div className="d-flex gap-2 mb-3">
                      <Button
                        variant="success"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleVote(movie.episode, 'like')}
                      >
                        👍 Like ({movieVotes.likes})
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleVote(movie.episode, 'dislike')}
                      >
                        👎 Dislike ({movieVotes.dislikes})
                      </Button>
                    </div>

                    <Link href={`/movie/${movie.episode}`} passHref legacyBehavior>
                      <Button variant={affiliationColor} className="w-100">
                        More...
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}
