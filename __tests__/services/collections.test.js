const {
  getCollectionsById,
  createCollection,
  updateCollectionField,
  deleteCollectionField,
} = require('../../src/services/collections.services');

const { Collections } = require('../../database/models');
const HttpError = require('../../src/utils/httpError');

jest.mock('../../database/models', () => ({
  Collections: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Collections API', () => {
  describe('getCollectionsById', () => {
    it('should return all collections with the provided contentId', async () => {
      const collections = [{ id: 1, contentId: 1, entry: 'foo' }];
      Collections.findAll.mockResolvedValueOnce(collections);
      const result = await getCollectionsById(1);
      expect(result).toEqual(collections);
      expect(Collections.findAll).toHaveBeenCalledWith({ where: { contentId: 1 } });
    });
  });

  describe('createCollection', () => {
    it('should create a new collection with the provided contentId and entry', async () => {
      const collection = { id: 1, contentId: 1, entry: 'foo' };
      Collections.create.mockResolvedValueOnce(collection);

      const result = await createCollection(1, { entry: 'foo' });

      expect(result).toEqual(collection);
      expect(Collections.create).toHaveBeenCalledWith({ contentId: 1, entry: 'foo' });
    });
  });

  describe('updateCollectionField', () => {
    it('should update the field value of the collection with the provided name', async () => {
      const collection = { id: 1, contentId: 1, name: 'foo', field: 'old value' };
      Collections.findOne.mockResolvedValueOnce(collection);

      const result = await updateCollectionField('foo', 'new value');

      expect(result).toEqual({ ...collection, field: 'new value' });
      expect(Collections.findOne).toHaveBeenCalledWith({ where: { name: 'foo' } });
      expect(collection.save).toHaveBeenCalled();
    });

    it('should throw a 404 error if the collection with the provided name is not found', async () => {
      Collections.findOne.mockResolvedValueOnce(null);

      await expect(updateCollectionField('nonexistent', 'new value')).rejects.toThrow(
        new HttpError('Collection not found', 404),
      );
    });
  });

  describe('deleteCollectionField', () => {
    it('should delete the collection with the provided id', async () => {
      const collection = { id: 1, contentId: 1, entry: 'foo' };
      Collections.findOne.mockResolvedValueOnce(collection);
      const result = await deleteCollectionField(1);
      expect(result).toEqual(collection);
      expect(Collections.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(collection.destroy).toHaveBeenCalled();
    });

    it('should throw a 404 error if the collection with the provided id is not found', async () => {
      Collections.findOne.mockResolvedValueOnce(null);
      await expect(deleteCollectionField(999)).rejects.toThrow(
        new HttpError('Collection not found', 404),
      );
    });
  });
});
