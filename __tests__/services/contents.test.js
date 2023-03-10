const { getAllContents, updateContentName, getContentByName, updateContentField, deleteContentField, addContentField } = require('../../src/services/contents.services');
const { Contents } = require('../../database/models');
const HttpError = require('../../src/utils/httpError');

jest.mock('../../database/models', () => ({
  Contents: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe('getAllContents', () => {
  it('should retrieve all contents from the database', async () => {
    Contents.findAll.mockResolvedValue([
      { id: 1, name: 'content1' },
      { id: 2, name: 'content2' },
    ]);
    const result = await getAllContents();
    expect(result).toEqual([
      { id: 1, name: 'content1' },
      { id: 2, name: 'content2' },
    ]);
    expect(Contents.findAll).toHaveBeenCalledTimes(1);
  });
});

describe('updateContentName', () => {
  it('should update the name of a content', async () => {
    const mockContent = { id: 1, name: 'content1' };
    Contents.findOne.mockResolvedValue(mockContent);
    mockContent.save = jest.fn().mockResolvedValue(mockContent);
    const result = await updateContentName('content1', 'newName');
    expect(result).toEqual(mockContent);
    expect(Contents.findOne).toHaveBeenCalledWith({ where: { name: 'content1' } });
    expect(mockContent.name).toBe('newName');
    expect(mockContent.save).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if content is not found', async () => {
    Contents.findOne.mockResolvedValue(null);
    try {
      await updateContentName('nonexistentContent', 'newName');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Content not found');
      expect(error.statusCode).toBe(404);
    }
    expect(Contents.findOne).toHaveBeenCalledWith({ where: { name: 'nonexistentContent' } });
  });
});

describe('getContentByName', () => {
  it('should retrieve a content from the database based on name', async () => {
    const mockContent = { id: 1, name: 'content1', field: 'field1' };
    Contents.findOne.mockResolvedValue(mockContent);
    const result = await getContentByName('content1');
    expect(result).toEqual(mockContent);
    expect(Contents.findOne).toHaveBeenCalledWith({ where: { name: 'content1' } });
  });
});

// describe('createContent', () => {
//   it('should create a new content in the database', async () => {
//     const mockContent = { id: 1, name: 'newContent', field: 'newField' };
//     Contents.create.mockResolvedValue(mockContent);
//     const result = await createContent('newContent', 'newField');
//     expect(result).toEqual(mockContent);
//     expect(Contents.create).toHaveBeenCalledWith({ name: 'newContent', field: 'newField' });
//   });
// });

describe('updateContentField', () => {
  it('should update the field value of a content', async () => {
    const mockContent = { id: 1, name: 'content1', field: 'field1' };
    Contents.findOne.mockResolvedValue(mockContent);
    mockContent.save = jest.fn().mockResolvedValue(mockContent);
    const result = await updateContentField('content1', 'newField');
    expect(result).toEqual(mockContent);
    expect(Contents.findOne).toHaveBeenCalledWith({ where: { name: 'content1' } });
    expect(mockContent.field).toBe('newField');
    expect(mockContent.save).toHaveBeenCalledTimes(1);
  });
});


describe('addContentField', () => {
  it('should add a new field to content object', async () => {
    const name = 'test';
    const body = { field: 'new-field' };
    const mockContent = { field: ['existing-field'] };
    const mockContents = { findOne: jest.fn().mockResolvedValue(mockContent), update: jest.fn() };

    const result = await addContentField(name, body, mockContents);

    expect(mockContents.findOne).toHaveBeenCalledWith({ where: { name } });
    expect(mockContents.update).toHaveBeenCalledWith({ field: ['existing-field', 'new-field'] }, { where: { name } });
    expect(result).toEqual(mockContents.update.mock.results[0].value);
  });

  it('should throw HttpError if content object not found', async () => {
    const name = 'test';
    const body = { field: 'new-field' };
    const mockContents = { findOne: jest.fn().mockResolvedValue(null), update: jest.fn() };

    await expect(addContentField(name, body, mockContents)).rejects.toThrow(new HttpError('field.find is not a function', 404));
  });

  it('should throw HttpError if field already exists', async () => {
    const name = 'test';
    const body = { field: 'existing-field' };
    const mockContent = { field: ['existing-field'] };
    const mockContents = { findOne: jest.fn().mockResolvedValue(mockContent), update: jest.fn() };

    await expect(addContentField(name, body, mockContents)).rejects.toThrow(new HttpError('field.find is not a function', 409));
  });
});

describe('deleteContentField', () => {
  it('should delete field from content object', async () => {
    const name = 'test';
    const fieldname = 'existing-field';
    const mockContent = { field: ['existing-field', 'another-field'] };
    const mockContents = { findOne: jest.fn().mockResolvedValue(mockContent), update: jest.fn() };

    const result = await deleteContentField(name, fieldname, mockContents);

    expect(mockContents.findOne).toHaveBeenCalledWith({ where: { name } });
    expect(mockContents.update).toHaveBeenCalledWith({ field: ['another-field'] }, { where: { name } });
    expect(result).toEqual(mockContents.update.mock.results[0].value);
  });

  it('should throw HttpError if content object not found', async () => {
    const name = 'test';
    const fieldname = 'existing-field';
    const mockContents = { findOne: jest.fn().mockResolvedValue(null), update: jest.fn() };

    await expect(deleteContentField(name, fieldname, mockContents)).rejects.toThrow(new HttpError('field.find is not a function', 404));
  });

  it('should throw HttpError if field not found', async () => {
    const name = 'test';
    const fieldname = 'non-existing-field';
    const mockContent = { field: ['existing-field'] };
    const mockContents = { findOne: jest.fn().mockResolvedValue(mockContent), update: jest.fn() };

    await expect(deleteContentField(name, fieldname, mockContents)).rejects.toThrow(new HttpError('field.find is not a function', 404));
  });
});
