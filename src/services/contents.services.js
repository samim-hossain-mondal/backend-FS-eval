const { Contents } = require('../../database/models');
const HttpError = require('../utils/httpError');

const getAllContents = async () => {
  const allContents = await Contents.findAll();
  return allContents;
};

const updateContentName = async (name, newName) => {
  console.log(name, newName);
  const content = await Contents.findOne({ where: { name } });
  if (!content) {
    throw new HttpError('Content not found', 404);
  }
  content.name = newName;
  await content.save();
  return content;
};

const getContentByName = async (name) => {
  const content = await Contents.findOne({ where: { name } });
  if (!content) {
    throw new HttpError('Content not found', 404);
  }
  return content;
};

const createContent = async (name, field) => {
  const content = await Contents.create({ name, field });
  return content;
};

const updateContentField = async (name, field) => {
  const content = await Contents.findOne({ where: { name } });
  if (!content) {
    throw new HttpError('Content not found', 404);
  }
  content.field = field;
  await content.save();
  return content;
};

const addContentField = async (name, body) => {
  const content = await Contents.findOne({ where: { name } });
  if (!content) {
    throw new HttpError('Content not found', 404);
  }
  const field = content.field;
  const isField = field.find((field) => field === body.field);
  if (isField) {
    throw new HttpError('Field already exists', 409);
  }
  console.log(field);
  field.push(body.field);
  const updatedContent = await Contents.update({ field: field }, { where: { name } });
  return updatedContent;
};

const deleteContentField = async (name, fieldname) => {
  const content = await Contents.findOne({ where: { name } });
  if (!content) {
    throw new HttpError('Content not found', 404);
  }
  const field = content.field;
  const isField = field.find((field) => field === fieldname);
  if (!isField) {
    throw new HttpError('Field not found', 404);
  }
  const updatedField = field.filter((field) => field !== fieldname);
  const updatedContent = await Contents.update({ field: updatedField }, { where: { name } });
  return updatedContent;
};

const editContentField = async (name, fieldname, body) => {
  const content = await Contents.findOne({ where: { name } });
  if (!content) {
    throw new HttpError('Content not found', 404);
  }
  const field = content.field;
  const isField = field.find((field) => field === fieldname);
  if (!isField) {
    throw new HttpError('Field not found', 404);
  }
  const updatedField = field.map((field) => {
    if (field === fieldname) {
      return body.field;
    }
    return field;
  }
  );
  const updatedContent = await Contents.update({ field: updatedField }, { where: { name } });
  return updatedContent;
};

module.exports = {
  getAllContents,
  getContentByName,
  createContent,
  updateContentField,
  deleteContentField,
  addContentField,
  editContentField,
  updateContentName
};