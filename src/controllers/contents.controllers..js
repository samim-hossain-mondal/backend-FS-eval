const services = require('../services/contents.services');

const getAllContents = async (req, res, next) => {
  try {
    const allContents = await services.getAllContents();
    res.status(200).json(allContents);
  } catch (error) {
    next(error);
  }
};

const getContentByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const content = await services.getContentByName(name);
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

const updateContentName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { newName } = req.body;
    const content = await services.updateContentName(name, newName);
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

const createContent = async (req, res, next) => {
  try {
    const { name } = req.body;
    const field = [];
    const content = await services.createContent(name, field);
    res.status(201).json(content);
  } catch (error) {
    next(error);
  }
};

const addContentField = async (req, res) => {
  try {
    const { name } = req.params;
    const body = req.body;
    const content = await services.addContentField(name, body);
    res.status(200).json(content);
  } catch (error) {
    // next(error);
    console.log(error);
  }
};

const updateContentField = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { field } = req.body;
    const content = await services.updateContentField(name, field);
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

const deleteContentField = async (req, res, next) => {
  try {
    const { name, fieldname } = req.params;
    const content = await services.deleteContentField(name, fieldname);
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

const getAllFieldsByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const content = await services.getContentByName(name);
    res.status(200).json(content.field);
  } catch (error) {
    next(error);
  }
};

const editContentField = async (req, res, next) => {
  try {
    const { name, fieldname } = req.params;
    const content = await services.editContentField(name, fieldname, req.body);
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContents,
  getContentByName,
  createContent,
  updateContentField,
  deleteContentField,
  addContentField,
  getAllFieldsByName,
  editContentField,
  updateContentName
};