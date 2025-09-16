const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Movie = require('../models/Movie');
const connectDB = require('../config/database');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    bio: 'System Administrator'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    bio: 'Movie enthusiast and critic'
  }
];

const movies = [
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: ['Drama'],
    director: 'Frank Darabont',
    cast: [
      { name: 'Tim Robbins', role: 'Andy Dufresne' },
      { name: 'Morgan Freeman', role: 'Ellis Boyd Redding' }
    ],
    rating: 9.3,
    duration: 142,
    releaseDate: new Date('1994-09-23'),
    language: 'English',
    country: 'USA',
    posterUrl: 'https://via.placeholder.com/300x450.png?text=Shawshank+Redemption',
    budget: 25000000,
    boxOffice: 16000000
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    genre: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    cast: [
      { name: 'Marlon Brando', role: 'Don Vito Corleone' },
      { name: 'Al Pacino', role: 'Michael Corleone' }
    ],
    rating: 9.2,
    duration: 175,
    releaseDate: new Date('1972-03-24'),
    language: 'English',
    country: 'USA',
    posterUrl: 'https://via.placeholder.com/300x450.png?text=The+Godfather',
    budget: 6000000,
    boxOffice: 246120974
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman' },
      { name: 'Heath Ledger', role: 'Joker' }
    ],
    rating: 9.0,
    duration: 152,
    releaseDate: new Date('2008-07-18'),
    language: 'English',
    country: 'USA',
    posterUrl: 'https://via.placeholder.com/300x450.png?text=The+Dark+Knight',
    budget: 185000000,
    boxOffice: 1004558444
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    genre: ['Crime', 'Drama'],
    director: 'Quentin Tarantino',
    cast: [
      { name: 'John Travolta', role: 'Vincent Vega' },
      { name: 'Samuel L. Jackson', role: 'Jules Winnfield' }
    ],
    rating: 8.9,
    duration: 154,
    releaseDate: new Date('1994-10-14'),
    language: 'English',
    country: 'USA',
    posterUrl: 'https://via.placeholder.com/300x450.png?text=Pulp+Fiction',
    budget: 8000000,
    boxOffice: 214179088
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man.',
    genre: ['Drama', 'Romance'],
    director: 'Robert Zemeckis',
    cast: [
      { name: 'Tom Hanks', role: 'Forrest Gump' },
      { name: 'Robin Wright', role: 'Jenny Curran' }
    ],
    rating: 8.8,
    duration: 142,
    releaseDate: new Date('1994-07-06'),
    language: 'English',
    country: 'USA',
    posterUrl: 'https://via.placeholder.com/300x450.png?text=Forrest+Gump',
    budget: 55000000,
    boxOffice: 677387716
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Delete existing data
    await User.deleteMany();
    await Movie.deleteMany();

    console.log('Existing data deleted...');

    // Create users
    const createdUsers = await User.create(users);
    console.log('Users imported...');

    // Add createdBy to movies
    const moviesWithCreator = movies.map(movie => ({
      ...movie,
      createdBy: createdUsers[0]._id // Admin user
    }));

    // Create movies
    await Movie.create(moviesWithCreator);
    console.log('Movies imported...');

    console.log('Data import successful!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Movie.deleteMany();

    console.log('Data deleted successfully!');
    process.exit();
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Usage:');
  console.log('Import data: node utils/seedData.js -i');
  console.log('Delete data: node utils/seedData.js -d');
  process.exit();
}
