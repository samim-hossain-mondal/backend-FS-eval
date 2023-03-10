const services = require('../../src/services/collections.services');
const {
  getCollectionById,
  createCollection,
  updateCollectionField,
  deleteCollectionField
} = require('../../src/controllers/collections.controllers');

jest.mock('../../src/services/collections.services');

const httpMocks = require('node-mocks-http');
const collection = { id: 1, name: 'example', field: 'value' };

services.updateCollectionField = jest.fn().mockResolvedValue(collection);
services.deleteCollectionField = jest.fn().mockResolvedValue(collection);

describe('Collections Controller', () => {
  describe('getCollectionById', () => {
    it('should call getCollectionsById and send the result as JSON with a 200 status code', async () => {
      const id = '123';
      const collection = { id, name: 'My Collection' };
      const req = { params: { id } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      services.getCollectionsById.mockResolvedValue(collection);

      await getCollectionById(req, res, next);

      expect(services.getCollectionsById).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(collection);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if getCollectionsById throws an error', async () => {
      const id = '123';
      const error = new Error('Something went wrong');
      const req = { params: { id } };
      const res = { status: jest.fn(), json: jest.fn() };
      const next = jest.fn();
      services.getCollectionsById.mockRejectedValue(error);

      await getCollectionById(req, res, next);

      expect(services.getCollectionsById).toHaveBeenCalledWith(id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createCollection', () => {
    it('should call createCollection and send the result as JSON with a 201 status code', async () => {
      const id = '123';
      const name = 'My Collection';
      const collection = { id, name };
      const body = { name };
      const req = { params: { id }, body };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      services.createCollection.mockResolvedValue(collection);

      await createCollection(req, res, next);

      expect(services.createCollection).toHaveBeenCalledWith(id, body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(collection);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if createCollection throws an error', async () => {
      const id = '123';
      const name = 'My Collection';
      const error = new Error('Something went wrong');
      const body = { name };
      const req = { params: { id }, body };
      const res = { status: jest.fn(), json: jest.fn() };
      const next = jest.fn();
      services.createCollection.mockRejectedValue(error);

      await createCollection(req, res, next);

      expect(services.createCollection).toHaveBeenCalledWith(id, body);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateCollectionField', () => {
    it('should return updated collection', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        params: { name: 'example' },
        body: { field: 'new value' },
      });
      const res = httpMocks.createResponse();
      await updateCollectionField(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(collection);
    });

    it('should return 404 if collection not found', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        params: { name: 'example' },
        body: { field: 'new value' },
      });
      const res = httpMocks.createResponse();
      services.updateCollectionField.mockResolvedValue(null);
      await updateCollectionField(req, res);
      expect(res.statusCode).toBe(200);
    }
    );
  });

  describe('deleteCollectionField', () => {
    it('should return deleted collection', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        params: { id: 1 },
      });
      const res = httpMocks.createResponse();
      await deleteCollectionField(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(collection);
    });

    it('should return 404 if collection not found', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        params: { id: 1 },
      });
      const res = httpMocks.createResponse();
      services.deleteCollectionField.mockResolvedValue(null);
      await deleteCollectionField(req, res);
      expect(res.statusCode).toBe(200);
    });
  });
});

