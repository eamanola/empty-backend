const express = require('express');

const {
  create,
  byId,
  byOwner,
  update,
  remove,
} = require('../controllers/notes');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { body, user } = req;
    const id = await create(user, body);
    const note = await byId(user, { id });

    res.status(201).json({ message: 'CREATED', note });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { params, user } = req;
    const note = await byId(user, { id: params.id });

    res.status(200).json({ message: 'OK', note });
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { user } = req;
    const notes = await byOwner(user);

    res.status(200).json({ message: 'OK', notes });
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { user, body } = req;
    await update(user, body);

    res.status(200).json({ message: 'OK' });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { user, params } = req;
    await remove(user, { id: params.id });

    res.status(200).json({ message: 'OK' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
