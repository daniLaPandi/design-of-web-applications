'use client';

import { useState } from 'react';
import Image from 'next/image';

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
  name: string;
  comment: string;
}

const sw: Movie[] = [
  {
    episode: "1",
    title: "The phantom menace",
    year: 1999,
    poster: "SW1-The_phantom_menace.jpg",
    best_character: {
      name: "Qui-Gon Jinn",
      affiliation: "Jedi",
      image: "Qui-Gon_Jinn.png",
      bio: "Qui-Gon Jinn, a Force-sensitive human male, was a venerable if maverick Jedi Master who lived during the last years of the Republic Era. He was a wise and well-respected member of the Jedi Order, and was offered a seat on the Jedi Council, but chose to reject and follow his own path. Adhering to a philosophy centered around the Living Force, Jinn strove to follow the will of the Force even when his actions conflicted with the wishes of the High Council. After encountering Anakin Skywalker, Jinn brought him to the Jedi Temple on Coruscant, convinced he had found the Chosen One. His dying wish was for Skywalker to become a Jedi and ultimately restore balance to the Force.",
    },
  },
  {
    episode: "2",
    title: "Attack of the clones",
    year: 2002,
    poster: "SW2-Attack_of_the_Clones.jpg",
    best_character: {
      name: "Obi-wan Kenobi",
      affiliation: "Jedi",
      image: "Obi-wan_Kenobi.png",
      bio: "Obi-Wan Kenobi was a legendary Force-sensitive human male Jedi Master who served on the Jedi High Council during the final years of the Republic Era. As a Jedi General, Kenobi served in the Grand Army of the Republic that fought against the Separatist Droid Army during the Clone Wars. Kenobi, however, was forced into exile as a result of the Great Jedi Purge. As a mentor, Kenobi was responsible for training two members of the Skywalker family, Anakin and Luke Skywalker, both of whom served in turn as his Padawan in the ways of the Force.",
    },
  },
  {
    episode: "3",
    title: "Revenge of the Sith",
    year: 2005,
    poster: "SW3-Revenge_of_the_sith.jpg",
    best_character: {
      name: "Anakin Skywalker",
      affiliation: "Sith",
      image: "Anakin_Skywalker.png",
      bio: "Anakin Skywalker was a legendary Force-sensitive human male who was a Jedi Knight of the Galactic Republic and the prophesied Chosen One of the Jedi Order, destined to bring balance to the Force. Also known as 'Ani' during his childhood, Skywalker earned the moniker 'Hero With No Fear' from his accomplishments in the Clone Wars. His alter ego, Darth Vader, the Dark Lord of the Sith, was created when Skywalker turned to the dark side of the Force, pledging his allegiance to the Sith Lord Darth Sidious at the end of the Republic Era.",
    },
  },
  {
    episode: "4",
    title: "A new hope",
    year: 1977,
    poster: "SW4-A_new_hope.jpg",
    best_character: {
      name: "Leia Organa",
      affiliation: "Rebellion",
      image: "Leia_Organa.jpeg",
      bio: "Leia Skywalker Organa Solo was a Force-sensitive human Alderaanian female politician, Jedi, and military leader who served in the Alliance to Restore the Republic during the Imperial Era and the New Republic and Resistance in the subsequent New Republic Era. Shortly after birth, she was adopted into the House of Organa—the Alderaanian royal family—and was raised as Princess Leia Organa of Alderaan, a planet in the Core Worlds known for its dedication to pacifism. The princess was raised as the daughter of Senator Bail Prestor Organa and his wife, Queen Breha Organa, making her the heir to the Alderaanian monarchy. Instilled with the values of her adopted homeworld, Organa devoted her life to the restoration of democracy by opposing authoritarian regimes, such as the Galactic Empire and the First Order.",
    },
  },
  {
    episode: "5",
    title: "The empire strikes back",
    year: 1980,
    poster: "SW5-The_empire_strikes_back.jpg",
    best_character: {
      name: "Darth Vader",
      affiliation: "Empire",
      image: "Darth_Vader.jpeg",
      bio: "Once the heroic Jedi Knight named Anakin Skywalker, Darth Vader was seduced by the dark side of the Force. Forever scarred by his defeat on Mustafar, Vader was transformed into a cybernetically-enhanced Sith Lord. At the dawn of the Empire, Vader led the Empire's eradication of the Jedi Order and the search for survivors. He remained in service of the Emperor -- the evil Darth Sidious -- for decades, enforcing his Master's will and seeking to crush the Rebel Alliance and other detractors. But there was still good in him…",
    },
  },
  {
    episode: "6",
    title: "The return of the Jedi",
    year: 1983,
    poster: "SW6-The_return_of_the_jedi.jpg",
    best_character: {
      name: "Luke Skywalker",
      affiliation: "Jedi",
      image: "Luke_Skywalker.jpeg",
      bio: "Luke Skywalker, a Force-sensitive human male, was a legendary Jedi Master who fought in the Galactic Civil War during the reign of the Galactic Empire. Along with his companions, Princess Leia Organa and General Han Solo, Skywalker served as a revolutionary on the side of the Alliance to Restore the Republic—an organization committed to the downfall of the Galactic Empire and the restoration of democracy. Following the war, Skywalker became a living legend, and was remembered as one of the greatest Jedi in galactic history.",
    },
  },
];

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
  return evilAffiliations.includes(affiliation) ? 'red' : 'blue';
};

interface MovieCardProps {
  movie: Movie;
  onShowDetails: () => void;
  likes: number;
  dislikes: number;
  onLike: () => void;
  onDislike: () => void;
}

const MovieCard = ({ movie, onShowDetails, likes, dislikes, onLike, onDislike }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const affiliationLogo = getAffiliationLogo(movie.best_character.affiliation);
  const affiliationColor = getAffiliationColor(movie.best_character.affiliation);

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 w-full">
        {isHovered && affiliationLogo ? (
          <div className={`h-full w-full flex items-center justify-center bg-${affiliationColor === 'blue' ? 'blue' : 'red'}-50`}>
            <img
              src={`/images/${affiliationLogo}`}
              alt={movie.best_character.affiliation}
              className="h-64 w-64 object-contain"
              style={{
                filter: affiliationColor === 'blue'
                  ? 'brightness(0) saturate(100%) invert(27%) sepia(97%) saturate(3447%) hue-rotate(202deg) brightness(94%) contrast(101%)'
                  : 'brightness(0) saturate(100%) invert(16%) sepia(93%) saturate(7471%) hue-rotate(359deg) brightness(95%) contrast(117%)'
              }}
            />
          </div>
        ) : (
          <img
            src={`/images/${movie.poster}`}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 capitalize">{movie.title}</h3>
        <p className="text-gray-600">Year: {movie.year}</p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onLike}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
          >
            👍 Like ({likes})
          </button>
          <button
            onClick={onDislike}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
          >
            👎 Dislike ({dislikes})
          </button>
        </div>
        <button
          onClick={onShowDetails}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          More...
        </button>
      </div>
    </div>
  );
};

interface CharacterDetailsProps {
  movie: Movie;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
}

const CharacterDetails = ({ movie, comments, onAddComment }: CharacterDetailsProps) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && comment.trim()) {
      onAddComment({ name: name.trim(), comment: comment.trim() });
      setName('');
      setComment('');
    }
  };

  return (
    <div className="mt-8 bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Character Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img
              src={`/images/${movie.best_character.image}`}
              alt={movie.best_character.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{movie.best_character.name}</h3>
            <p className="text-gray-700 leading-relaxed">{movie.best_character.bio}</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h4 className="text-xl font-bold mb-4 text-gray-800">Comments</h4>

          <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="mb-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Write your comment"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
            >
              Add Comment
            </button>
          </form>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((c, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  <p className="text-gray-700 mt-1">{c.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [votes, setVotes] = useState<{ [key: string]: { likes: number; dislikes: number } }>(
    sw.reduce((acc, movie) => {
      acc[movie.episode] = { likes: 0, dislikes: 0 };
      return acc;
    }, {} as { [key: string]: { likes: number; dislikes: number } })
  );
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>(
    sw.reduce((acc, movie) => {
      acc[movie.episode] = [];
      return acc;
    }, {} as { [key: string]: Comment[] })
  );

  const handleLike = (episode: string) => {
    setVotes(prev => ({
      ...prev,
      [episode]: {
        ...prev[episode],
        likes: prev[episode].likes + 1
      }
    }));
  };

  const handleDislike = (episode: string) => {
    setVotes(prev => ({
      ...prev,
      [episode]: {
        ...prev[episode],
        dislikes: prev[episode].dislikes + 1
      }
    }));
  };

  const handleAddComment = (episode: string, comment: Comment) => {
    setComments(prev => ({
      ...prev,
      [episode]: [...prev[episode], comment]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 text-yellow-400 tracking-wider">
          STAR WARS MOVIES
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sw.map((movie) => (
            <MovieCard
              key={movie.episode}
              movie={movie}
              onShowDetails={() => setSelectedMovie(movie)}
              likes={votes[movie.episode].likes}
              dislikes={votes[movie.episode].dislikes}
              onLike={() => handleLike(movie.episode)}
              onDislike={() => handleDislike(movie.episode)}
            />
          ))}
        </div>

        {selectedMovie && (
          <CharacterDetails
            movie={selectedMovie}
            comments={comments[selectedMovie.episode]}
            onAddComment={(comment) => handleAddComment(selectedMovie.episode, comment)}
          />
        )}
      </div>
    </div>
  );
}
