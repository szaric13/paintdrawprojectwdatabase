const Picture = require('../models/Picture');
const { z } = require('zod');

const pictureSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character long').max(40, 'Name must not exceed 40 characters'),
  picture_data: z
    .array(z.array(z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid color format')))
    .min(1, 'Picture data must be at least 1x1')
    .max(24, 'Picture data must not exceed 24x24')
    .refine((data) => data.every((row) => row.length === data[0].length), {
      message: 'Picture data must be a square matrix',
    }),
});

const createPicture = async (req, res) => {
  try {
    const validation = pictureSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        failed: true,
        code: 'INVALID_DATA',
        extra: validation.error.errors,
      });
    }

    const { name, picture_data } = req.body;
    const picture = new Picture({
      name,
      picture_data,
      author: req.user.user_id,
    });
    await picture.save();
    res.status(201).json({ failed: false, picture_id: picture._id });
  } catch (error) {
    res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
  }
};

const listPictures = async (req, res) => {
  try {
    const { limit = 10, page = 1, author, older_first } = req.query;
    if (limit < 1 || limit > 25 || page < 1) {
      return res.status(400).json({ failed: true, code: 'INVALID_DATA', extra: 'Invalid pagination parameters' });
    }

    const query = author ? { author } : {};
    const sort = older_first === 'true' ? { created_at: 1 } : { created_at: -1 };

    const pictures = await Picture.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Picture.countDocuments(query);

    res.json({ pictures, total });
  } catch (error) {
    res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
  }
};

const getPictureById = async (req, res) => {
  try {
    const { pictureId } = req.params;
    const picture = await Picture.findById(pictureId).populate('author', 'username');

    if (!picture) {
      return res.status(404).json({ failed: true, code: 'NO_SUCH_ENTITY' });
    }

    res.json({ failed: false, picture });
  } catch (error) {
    res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
  }
};

const updatePicture = async (req, res) => {
  try {
    const { pictureId } = req.params;
    const validation = pictureSchema.partial().safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        failed: true,
        code: 'INVALID_DATA',
        extra: validation.error.errors,
      });
    }

    const picture = await Picture.findById(pictureId);
    if (!picture) {
      return res.status(404).json({ failed: true, code: 'NO_SUCH_ENTITY' });
    }

    if (picture.author.toString() !== req.user.user_id) {
      return res.status(403).json({ failed: true, code: 'NOT_YOURS' });
    }

    Object.assign(picture, req.body);
    await picture.save();
    res.json({ failed: false });
  } catch (error) {
    res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
  }
};

const deletePicture = async (req, res) => {
  try {
    const { pictureId } = req.params;
    const picture = await Picture.findById(pictureId);

    if (!picture) {
      return res.status(404).json({ failed: true, code: 'NO_SUCH_ENTITY' });
    }

    if (picture.author.toString() !== req.user.user_id) {
      return res.status(403).json({ failed: true, code: 'NOT_YOURS' });
    }

    await picture.deleteOne();
    res.json({ failed: false });
  } catch (error) {
    res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
  }
};

module.exports = { createPicture, listPictures, getPictureById, updatePicture, deletePicture };
