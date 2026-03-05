const express = require('express');
const { createPicture, listPictures, getPictureById, updatePicture, deletePicture } = require('../controllers/pictureController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ failed: true, code: 'INVALID_DATA', extra: err.errors });
  }

  if (err.name === 'AuthenticationError') {
    return res.status(401).json({ failed: true, code: 'NOT_AUTHENTICATED' });
  }

  if (err.name === 'AuthorizationError') {
    return res.status(403).json({ failed: true, code: 'NOT_YOURS' });
  }

  if (err.name === 'EntityNotFoundError') {
    return res.status(404).json({ failed: true, code: 'NO_SUCH_ENTITY' });
  }

  if (err.name === 'DuplicateError') {
    return res.status(400).json({ failed: true, code: 'DUPLICATE_USERNAME' });
  }

  res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
};


router.post('/', authMiddleware, createPicture);


router.get('/', listPictures);


router.get('/:pictureId', getPictureById);


router.patch('/:pictureId', authMiddleware, updatePicture);


router.delete('/:pictureId', authMiddleware, deletePicture);


router.use(errorHandler);

module.exports = router;
