const express = require('express');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  getTopRatedMovies,
  getLatestMovies,
  getMovieStats
} = require('../controllers/movieController');

const { protect, authorize } = require('../middleware/auth');
const {
  validateMovie,
  validateMovieUpdate
} = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management endpoints
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies with advanced filtering and pagination
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of movies per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, director
 *         example: batman
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *         example: Action
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (prefix with - for descending)
 *         example: -rating
 *       - in: query
 *         name: rating[gte]
 *         schema:
 *           type: number
 *         description: Minimum rating
 *         example: 8.0
 *       - in: query
 *         name: releaseDate[gte]
 *         schema:
 *           type: string
 *           format: date
 *         description: Movies released after this date
 *         example: 2020-01-01
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Select specific fields (comma separated)
 *         example: title,rating,genre
 *     responses:
 *       200:
 *         description: List of movies with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     next:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 2
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                     prev:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/', getMovies);

/**
 * @swagger
 * /movies/top-rated:
 *   get:
 *     summary: Get top rated movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top movies to return
 *     responses:
 *       200:
 *         description: List of top rated movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/top-rated', getTopRatedMovies);

/**
 * @swagger
 * /movies/latest:
 *   get:
 *     summary: Get latest movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of latest movies to return
 *     responses:
 *       200:
 *         description: List of latest movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/latest', getLatestMovies);

/**
 * @swagger
 * /movies/genre/{genre}:
 *   get:
 *     summary: Get movies by genre
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Sci-Fi, Sport, Thriller, War, Western]
 *         description: Movie genre
 *         example: Action
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of movies per page
 *     responses:
 *       200:
 *         description: List of movies in the specified genre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get('/genre/:genre', getMoviesByGenre);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getMovie);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - genre
 *               - director
 *               - rating
 *               - duration
 *               - releaseDate
 *               - language
 *               - country
 *               - posterUrl
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: The Matrix
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: A computer programmer discovers reality isn't what it seems.
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Sci-Fi, Sport, Thriller, War, Western]
 *                 example: [Action, Sci-Fi]
 *               director:
 *                 type: string
 *                 maxLength: 100
 *                 example: The Wachowskis
 *               cast:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Keanu Reeves
 *                     role:
 *                       type: string
 *                       example: Neo
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 example: 8.7
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 136
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: 1999-03-31
 *               language:
 *                 type: string
 *                 example: English
 *               country:
 *                 type: string
 *                 example: USA
 *               posterUrl:
 *                 type: string
 *                 format: url
 *                 example: https://example.com/matrix-poster.jpg
 *               trailerUrl:
 *                 type: string
 *                 format: url
 *                 example: https://youtube.com/watch?v=example
 *               budget:
 *                 type: number
 *                 minimum: 0
 *                 example: 63000000
 *               boxOffice:
 *                 type: number
 *                 minimum: 0
 *                 example: 467222824
 *               awards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Academy Award
 *                     year:
 *                       type: integer
 *                       example: 2000
 *                     category:
 *                       type: string
 *                       example: Best Visual Effects
 *               imdbId:
 *                 type: string
 *                 example: tt0133093
 *               status:
 *                 type: string
 *                 enum: [active, inactive, coming-soon]
 *                 default: active
 *                 example: active
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', protect, validateMovie, createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: The Matrix Reloaded
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Updated description
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Sci-Fi, Sport, Thriller, War, Western]
 *                 example: [Action, Sci-Fi]
 *               director:
 *                 type: string
 *                 maxLength: 100
 *                 example: The Wachowskis
 *               cast:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Keanu Reeves
 *                     role:
 *                       type: string
 *                       example: Neo
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 example: 8.5
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 138
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2003-05-15
 *               language:
 *                 type: string
 *                 example: English
 *               country:
 *                 type: string
 *                 example: USA
 *               posterUrl:
 *                 type: string
 *                 format: url
 *                 example: https://example.com/matrix-reloaded-poster.jpg
 *               trailerUrl:
 *                 type: string
 *                 format: url
 *                 example: https://youtube.com/watch?v=example2
 *               budget:
 *                 type: number
 *                 minimum: 0
 *                 example: 150000000
 *               boxOffice:
 *                 type: number
 *                 minimum: 0
 *                 example: 742128461
 *               awards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: MTV Movie Award
 *                     year:
 *                       type: integer
 *                       example: 2004
 *                     category:
 *                       type: string
 *                       example: Best Fight
 *               imdbId:
 *                 type: string
 *                 example: tt0234215
 *               status:
 *                 type: string
 *                 enum: [active, inactive, coming-soon]
 *                 example: active
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized or not movie owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', protect, validateMovieUpdate, updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized or not movie owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', protect, deleteMovie);

/**
 * @swagger
 * /movies/admin/stats:
 *   get:
 *     summary: Get movie statistics (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movie statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalMovies:
 *                           type: integer
 *                           example: 150
 *                         avgRating:
 *                           type: number
 *                           example: 7.8
 *                         avgDuration:
 *                           type: number
 *                           example: 125.5
 *                         totalBudget:
 *                           type: number
 *                           example: 2500000000
 *                         totalBoxOffice:
 *                           type: number
 *                           example: 15000000000
 *                     byGenre:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: Action
 *                           count:
 *                             type: integer
 *                             example: 25
 *                           avgRating:
 *                             type: number
 *                             example: 7.5
 *                     byYear:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: integer
 *                             example: 2023
 *                           count:
 *                             type: integer
 *                             example: 15
 *                           avgRating:
 *                             type: number
 *                             example: 8.2
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/admin/stats', protect, authorize('admin'), getMovieStats);

module.exports = router;
