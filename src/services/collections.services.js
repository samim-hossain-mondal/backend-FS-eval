const { Collections } = require('../../database/models');
const HttpError = require('../utils/httpError');

const getCollectionsById = async (id) => {
  const collections = await Collections.findAll({ where: { contentId: id } });
  return collections;
};

const createCollection = async (id, body) => {
  const collection = await Collections.create({ contentId: id, entry: body.entry });
  return collection;
};

const updateCollectionField = async (id, body) => {
  const collection = await Collections.findOne({ where: { id } });
  if (!collection) {
    throw new HttpError('Collection not found', 404);
  }
  const contentId = collection.contentId;
  await collection.update({ contentId, entry: body.entry }, { where: { id } });
};


const deleteCollectionField = async (id) => {
  const collection = await Collections.findOne({ where: { id } });
  if (!collection) {
    throw new HttpError('Collection not found', 404);
  }
  await collection.destroy();
  return collection;
};

module.exports = {
  getCollectionsById,
  createCollection,
  updateCollectionField,
  deleteCollectionField,
};