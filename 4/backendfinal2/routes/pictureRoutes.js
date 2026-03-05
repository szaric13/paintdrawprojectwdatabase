const express = require('express');
const { createPicture, listPictures, getPictureById, updatePicture, deletePicture } = require('../controllers/pictureController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/', authMiddleware, createPicture);


router.get('/', listPictures);


router.get('/:pictureId', getPictureById);


router.patch('/:pictureId', authMiddleware, updatePicture);


router.delete('/:pictureId', authMiddleware, deletePicture);

module.exports = router;
