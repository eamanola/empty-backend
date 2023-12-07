const express = require('express');

const { create } = require('../controllers/notes');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { body, user } = req;
    const note = await create(user, body);
    res.status(201).json({ message: 'CREATED', note });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
