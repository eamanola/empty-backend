const { utils, errors } = require('automata-utils');

const { createParamError } = errors;

const { logger } = utils;

const restModel = require('./model');

const restController = (
  model,
  {
    table,
    userRequired = true,
    validator,
  } = {},
) => {
  const {
    insertOne,
    findOne,
    find,
    replaceOne,
    deleteOne,
  } = model || restModel(table, { userRequired, validator });

  const addOwner = (user, obj) => (userRequired ? { ...obj, owner: user.id } : { ...obj });
  const removeOwner = (obj) => {
    if (!obj) return obj;

    const { owner, ...rest } = obj;
    return rest;
  };

  const byId = async (user, { id }) => removeOwner(await findOne(addOwner(user, { id })));

  const create = async (user, newResource) => {
    try {
      const row = await insertOne(addOwner(user, newResource));

      return removeOwner(row);
    } catch (err) {
      if (err.name === 'ValidationError') {
        logger.info(err.message);
        throw createParamError(err);
      }

      throw err;
    }
  };

  const byOwner = async (user) => (await find({ owner: user.id }) || []).map(removeOwner);

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
    byId,
    byOwner,
    create,
    remove,
    update,
  };
};

module.exports = restController;
