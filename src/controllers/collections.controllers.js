const services = require('../services/collections.services');

const getCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const collection = await services.getCollectionsById(id);
    res.status(200).json(collection);
  } catch (error) {
    next(error);
  }
};
const createCollection = async (req, res, next) => {
  try {
    const collection = await services.createCollection(req.params.id, req.body);
    res.status(201).json(collection);
  } catch (error) {
    next(error);
  }
};

const updateCollectionField = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { field } = req.body;
    const collection = await services.updateCollectionField(name, field);
    res.status(200).json(collection);
  } catch (error) {
    next(error);
  }
};

const deleteCollectionField = async (req, res, next) => {
  try {
    const { id } = req.params;
    const collection = await services.deleteCollectionField(id);
    res.status(200).json(collection);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollectionById,
  createCollection,
  updateCollectionField,
  deleteCollectionField,
};