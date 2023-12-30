const { createParamError } = require('../errors');

const { info } = require('../logger');

const restModel = require('../models/rest-model');

const restController = (model, { table, validator, userRequired = true } = {}) => {
  const {
    insertOne,
    findOne,
    find,
    replaceOne,
    deleteOne,
  } = (model || restModel(table, validator, { userRequired }));
  const addOwner = (user, obj) => (userRequired ? { ...obj, owner: user.email } : { ...obj });

  const byId = async (user, { id }) => findOne(addOwner(user, { id }));

  const create = async (user, newResource) => {
    try {
      const { id } = await insertOne(addOwner(user, newResource));

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
        addOwner(user, { id: resource.id }),
        addOwner(user, resource),
      );
    } catch (e) {
      if (e.name === 'ValidationError') {
        info(e.message);
        throw createParamError(e);
      }

      throw e;
    }
  };

  const remove = async (user, { id }) => deleteOne(addOwner(user, { id }));

  return {
    create,
    byId,
    byOwner,
    update,
    remove,
  };
};

module.exports = restController;
