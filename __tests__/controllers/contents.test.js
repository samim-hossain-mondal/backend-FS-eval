const { getAllContents,
  getContentByName,
  updateContentName,
  createContent,
  addContentField,
  updateContentField,
  deleteContentField,
  getAllFieldsByName } = require('../../src/controllers/contents.controllers..js');
const services = require('../../src/services/contents.services');

jest.mock('../../src/services/contents.services', () => ({
  getAllContents: jest.fn(() => Promise.resolve([{ name: 'content1' }, { name: 'content2' }]))
}));

describe('getAllContents', () => {
  it('should return all contents', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
    await getAllContents(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ name: 'content1' }, { name: 'content2' }]);
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
    const error = new Error('Database error');
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(services, 'getAllContents').mockRejectedValueOnce(error);
    await getAllContents(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('getContentByName', () => {
  it('should return content with status 200 if name exists', async () => {
    const req = { params: { name: 'example' } };
    const expectedContent = { id: 1, title: 'Example Content' };
    services.getContentByName = jest.fn().mockResolvedValue(expectedContent);
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await getContentByName(req, res, next);
    expect(services.getContentByName).toHaveBeenCalledWith(req.params.name);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedContent);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next function with error if content not found', async () => {
    const req = { params: { name: 'non-existent' } };
    services.getContentByName = jest.fn().mockRejectedValue(new Error('Content not found'));
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await getContentByName(req, res, next);
    expect(services.getContentByName).toHaveBeenCalledWith(req.params.name);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error('Content not found'));
  });
});

describe('updateContentName', () => {
  it('should return updated content with status 200 if name exists', async () => {
    const req = {
      params: { name: 'example' },
      body: { newName: 'updated name' },
    };
    const expectedContent = { id: 1, title: 'Updated Content' };
    services.updateContentName = jest.fn().mockResolvedValue(expectedContent);
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await updateContentName(req, res, next);
    expect(services.updateContentName).toHaveBeenCalledWith(req.params.name, req.body.newName);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedContent);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next function with error if name does not exist', async () => {
    const req = {
      params: { name: 'non-existent' },
      body: { newName: 'updated name' },
    };
    services.updateContentName = jest.fn().mockRejectedValue(new Error('Content not found'));
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await updateContentName(req, res, next);
    expect(services.updateContentName).toHaveBeenCalledWith(req.params.name, req.body.newName);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error('Content not found'));
  });
});

const req = {
  body: { name: 'Test Content' },
  params: { name: 'Test Content' }
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

describe('createContent', () => {
  it('should create a new content object with an empty field array', async () => {
    services.createContent = jest.fn().mockResolvedValue({ name: 'Test Content', fields: [] });
    await createContent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ name: 'Test Content', fields: [] });
  });

  it('should handle errors and call the next middleware function', async () => {
    const error = new Error('Server error');
    services.createContent = jest.fn().mockRejectedValue(error);
    const next = jest.fn();
    await createContent(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('addContentField', () => {
  it('should add a new field to an existing content object', async () => {
    const body = { name: 'Field 1', value: 'Value 1' };
    services.addContentField = jest.fn().mockResolvedValue({ name: 'Test Content', fields: [body] });
    req.body = body;
    await addContentField(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Test Content', fields: [body] });
  });

  it('should handle errors and log the error message', async () => {
    const error = new Error('Server error');
    services.addContentField = jest.fn().mockRejectedValue(error);
    console.log = jest.fn();
    await addContentField(req, res);
    expect(console.log).toHaveBeenCalledWith(error);
  });
});

describe('updateContentField', () => {
  it('should update an existing field in a content object', async () => {
    const field = { name: 'Field 1', value: 'Updated value' };
    services.updateContentField = jest.fn().mockResolvedValue({ name: 'Test Content', fields: [field] });
    req.body = { field };
    await updateContentField(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Test Content', fields: [field] });
  });

  it('should handle errors and call the next middleware function', async () => {
    const error = new Error('Server error');
    services.updateContentField = jest.fn().mockRejectedValue(error);
    const next = jest.fn();
    await updateContentField(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('deleteContentField', () => {
  it('should delete a field from an existing content object', async () => {
    services.deleteContentField = jest.fn().mockResolvedValue({ name: 'Test Content', fields: [] });
    await deleteContentField(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Test Content', fields: [] });
  });

  it('should handle errors and call the next middleware function', async () => {
    const error = new Error('Server error');
    services.deleteContentField = jest.fn().mockRejectedValue(error);
    const next = jest.fn();
    await deleteContentField(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('getAllFieldsByName', () => {
  // it('should get all fields from an existing content object by name', async () => {
  //   const content = { name: 'Test Content', fields: [{ name: 'Field 1', value: 'Value 1' }] };
  //   services.getContentByName = jest.fn().mockResolvedValue(content);
  //   await getAllFieldsByName(req, res);
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith(content.fields);
  // });

  it('should handle errors and call the next middleware function', async () => {
    const error = new Error('Server error');
    services.getContentByName = jest.fn().mockRejectedValue(error);
    const next = jest.fn();
    await getAllFieldsByName(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});

// describe('editContentField', () => {
//   it('should edit a content field', async () => {
//     const req = mockRequest({
//       params: {
//         name: 'test-content',
//         fieldname: 'title',
//       },
//       body: {
//         newTitle: 'New Title',
//       },
//     });
//     const res = mockResponse();
//     const mockEditContentField = jest.spyOn(services, 'editContentField');
//     mockEditContentField.mockResolvedValue({
//       title: 'New Title',
//       body: 'Lorem ipsum dolor sit amet',
//     });
//     await editContentField(req, res);
//     expect(mockEditContentField).toHaveBeenCalledWith('test-content', 'title', { newTitle: 'New Title' });
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       title: 'New Title',
//       body: 'Lorem ipsum dolor sit amet',
//     });
//   });
// });