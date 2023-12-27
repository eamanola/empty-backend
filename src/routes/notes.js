const express = require('express');

const {
  create,
  byId,
  byOwner,
  update,
  remove,
} = require('../controllers/notes');

const post = async (req, res, next) => {
  let error = null;

  try {
    const { body: newNote, user } = req;
    const id = await create(user, newNote);
    const note = await byId(user, { id });

    res.status(201).json({ message: 'CREATED', note });
  } catch (e) {
    error = e;
  } finally {
    next(error);
  }
};

const getById = async (req, res, next) => {
  let error = null;

  try {
    const { params, user } = req;
    const note = await byId(user, { id: params.id });

    res.status(200).json({ message: 'OK', note });
  } catch (e) {
    error = e;
  } finally {
    next(error);
  }
};

const getByOwner = async (req, res, next) => {
  let error = null;

  try {
    const { user } = req;
    const notes = await byOwner(user);

    res.status(200).json({ message: 'OK', notes });
  } catch (e) {
    error = e;
  } finally {
    next(error);
  }
};

const put = async (req, res, next) => {
  let error = null;

  try {
    const { user, body: updatedNote } = req;
    await update(user, updatedNote);
    const note = await byId(user, { id: updatedNote.id });

    res.status(200).json({ message: 'OK', note });
  } catch (e) {
    error = e;
  } finally {
    next(error);
  }
};

const deleteHandler = async (req, res, next) => {
  let error = null;

  try {
    const { user, params } = req;
    await remove(user, { id: params.id });

    res.status(200).json({ message: 'OK' });
  } catch (e) {
    error = e;
  } finally {
    next(error);
  }
};

const router = express.Router();

router.post('/', post);

router.get('/:id', getById);

router.get('/', getByOwner);

router.put('/:id', put);

router.delete('/:id', deleteHandler);

module.exports = router;
