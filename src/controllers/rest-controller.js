const { createParamError } = require('../errors');

const { info } = require('../logger');

const restModel = require('../models/rest-model');

const restController = (model, { table, validator } = {}) => {
  const {
    insertOne,
    findOne,
    find,
    replaceOne,
    deleteOne,
  } = (model || restModel(table, validator));

  const byId = async (user, { id }) => findOne({ id, owner: user.email });

  const create = async (user, newResource) => {
    try {
      const { id } = await insertOne({ ...newResource, owner: user.email });

      return id;
    } catch (e) {
      if (e.name === 'ValidationError') {
        info(e.message);
        throw createParamError(e);
      }

      throw e;
    }
  };

  const byOwner = async (user) => find({ owner: user.email });

  const update = async (user, resource) => {
    try {
      await replaceOne(
        { id: resource.id, owner: user.email },
        { ...resource, owner: user.email },
      );
    } catch (e) {
      if (e.name === 'ValidationError') {
        info(e.message);
        throw createParamError(e);
      }

      throw e;
    }
  };

  const remove = async (user, { id }) => deleteOne({ id, owner: user.email });

  return {
    create,
    byId,
    byOwner,
    update,
    remove,
  };
};

module.exports = restController;
