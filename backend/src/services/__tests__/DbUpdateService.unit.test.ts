import DbUpdateService from '../DbUpdateService';
import { MongoClient } from 'mongodb';

/**
 * @author ale8k
 */
describe('DbUpdateService', () => {
    let connection: MongoClient;
    const collectionName = 'test';

    // Setup the DB for testing
    beforeAll(async () => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        DbUpdateService.db = connection.db(global.__MONGO_DB_NAME__);

        await DbUpdateService.db.collection(collectionName).insertOne({
            iamatest: 'lol'
        });
    });

    // Clean up
    afterEach(async () => {
        // Clear mock tuts
        await DbUpdateService.db.collection(collectionName).deleteMany({});
    });

    it('getAllDocuments<T> should return all documents in a given collection', done => {
        DbUpdateService.getAllDocuments<{ iamatest: string }>(collectionName).then(data => {
            expect(data.length).toBe(1);
            done();
        });
    });

    it('createDocument<T> should create a single document', done => {
        DbUpdateService.createDocument<{ iamatest: string }>(collectionName, {
            iamatest: 'lol'
        }).then(data => {
            expect(data.ok).toBe(1);
            expect(data.n).toBe(1);
            expect(data.nModified).toBe(undefined);
            done();
        });
    });

    it('updateSingleDocument should update a document correctly', async done => {
        await DbUpdateService.createDocument<{ iamatest: string }>(collectionName, { iamatest: 'lol' });
        DbUpdateService.getAllDocuments<{ iamatest: string }>(collectionName).then(() => {
            DbUpdateService.updateSingleDocument(
                collectionName,
                { iamatest: 'lol' },
                { $set: { iamatest: 'changed' } }
            ).then(() => {
                DbUpdateService.getAllDocuments<{ iamatest: string }>(collectionName).then(changed => {
                    expect(changed[0].iamatest).toBe('changed');
                    done();
                });
            });
        });
    });
});
