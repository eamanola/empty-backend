const { NODE_ENV } = require('../../config');
const { createParamError } = require('../errors');

const logger = require('../utils/logger');

const restModel = require('./model');

const restController = (aModel, { table, validator, userRequired = true } = {}) => {
  const model = aModel || restModel(table, validator, { userRequired });

  const {
    insertOne,
    findOne,
    find,
    replaceOne,
    deleteOne,
  } = model;

  const addOwner = (user, obj) => (userRequired ? { ...obj, owner: user.id } : { ...obj });

  const byId = async (user, { id }) => findOne(addOwner(user, { id }));

  const create = async (user, newResource) => {
    try {
      const { id } = await insertOne(addOwner(user, newResource));

      return id;
    } catch (err) {
      if (err.name === 'ValidationError') {
        logger.info(err.message);
        throw createParamError(err);
      }

      throw err;
    }
  };

  const byOwner = async (user) => find({ owner: user.id });

  const update = async (user, resource) => {
    try {
      await replaceOne(
        addOwner(user, { id: resource.id }),
        addOwner(user, resource),
      );
    } catch (err) {
      if (err.name === 'ValidationError') {
        logger.info(err.message);
        throw createParamError(err);
      }

      throw err;
    }
  };

  const remove = async (user, { id }) => deleteOne(addOwner(user, { id }));

  return {
    controller: {
      byId,
      byOwner,
      create,
      remove,
      update,
    },
    model: NODE_ENV === 'test' ? model : undefined,
  };
};

module.exports = restController;
