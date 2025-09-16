const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movies API Documentation',
      version: '1.0.0',
      description: 'Complete Node.js backend for Movies Management with Authentication',
      contact: {
        name: 'API Support',
        email: 'support@moviesapi.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Local Development Server'
      },
      {
        url: 'https://movie-handler-api.onrender.com/api',
        description: 'Production Server (Render)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 50,
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
              example: 'user'
            },
            avatar: {
              type: 'string',
              format: 'url',
              description: 'Profile picture URL',
              example: 'https://via.placeholder.com/150x150.png?text=User'
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              example: '+1234567890'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth',
              example: '1990-01-01'
            },
            bio: {
              type: 'string',
              maxLength: 500,
              description: 'User biography',
              example: 'Movie enthusiast and critic'
            },
            isActive: {
              type: 'boolean',
              description: 'Account status',
              example: true
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Movie: {
          type: 'object',
          required: ['title', 'description', 'genre', 'director', 'rating', 'duration', 'releaseDate', 'language', 'country', 'posterUrl'],
          properties: {
            _id: {
              type: 'string',
              description: 'Movie ID',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              maxLength: 200,
              description: 'Movie title',
              example: 'The Shawshank Redemption'
            },
            description: {
              type: 'string',
              maxLength: 2000,
              description: 'Movie description',
              example: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
            },
            genre: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western']
              },
              description: 'Movie genres',
              example: ['Drama']
            },
            director: {
              type: 'string',
              maxLength: 100,
              description: 'Director name',
              example: 'Frank Darabont'
            },
            cast: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Actor name',
                    example: 'Tim Robbins'
                  },
                  role: {
                    type: 'string',
                    description: 'Character name',
                    example: 'Andy Dufresne'
                  }
                }
              },
              description: 'Movie cast'
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 10,
              description: 'Movie rating (0-10)',
              example: 9.3
            },
            duration: {
              type: 'integer',
              minimum: 1,
              description: 'Duration in minutes',
              example: 142
            },
            releaseDate: {
              type: 'string',
              format: 'date',
              description: 'Release date',
              example: '1994-09-23'
            },
            language: {
              type: 'string',
              description: 'Movie language',
              example: 'English'
            },
            country: {
              type: 'string',
              description: 'Country of origin',
              example: 'USA'
            },
            posterUrl: {
              type: 'string',
              format: 'url',
              description: 'Poster image URL',
              example: 'https://via.placeholder.com/300x450.png?text=Movie+Poster'
            },
            trailerUrl: {
              type: 'string',
              format: 'url',
              description: 'Trailer video URL',
              example: 'https://youtube.com/watch?v=example'
            },
            budget: {
              type: 'number',
              minimum: 0,
              description: 'Production budget',
              example: 25000000
            },
            boxOffice: {
              type: 'number',
              minimum: 0,
              description: 'Box office earnings',
              example: 16000000
            },
            awards: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Award name',
                    example: 'Academy Award'
                  },
                  year: {
                    type: 'integer',
                    description: 'Award year',
                    example: 1995
                  },
                  category: {
                    type: 'string',
                    description: 'Award category',
                    example: 'Best Picture'
                  }
                }
              },
              description: 'Movie awards'
            },
            imdbId: {
              type: 'string',
              description: 'IMDB ID',
              example: 'tt0111161'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'coming-soon'],
              description: 'Movie status',
              example: 'active'
            },
            createdBy: {
              type: 'string',
              description: 'Creator user ID',
              example: '507f1f77bcf86cd799439011'
            },
            updatedBy: {
              type: 'string',
              description: 'Last updater user ID',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            token: {
              type: 'string',
              description: 'JWT token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            data: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Validation error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string',
                    example: 'Email is required'
                  },
                  param: {
                    type: 'string',
                    example: 'email'
                  },
                  location: {
                    type: 'string',
                    example: 'body'
                  }
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
