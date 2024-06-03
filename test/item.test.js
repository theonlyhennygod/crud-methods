const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Item API', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new item', async () => {
        const res = await request(app)
            .post('/items')
            .send({
                name: 'Item1',
                description: 'Description1',
                quantity: 1,
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual('Item1');
        expect(res.body.description).toEqual('Description1');
        expect(res.body.quantity).toEqual(1);
    }

    it('should get all items', async () => {
        const res = await request(app)
            .get('/items');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should get an item by id', async () => {
        const item = await request(app)
            .post('/items')
            .send({
                name: 'Item2',
                description: 'Description2',
                quantity: 2,
            });
        const res = await request(app)
            .get(`/items/${item.body._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('Item2');
        expect(res.body.description).toEqual('Description2');
        expect(res.body.quantity).toEqual(2);
    });

    it('should get an item by name', async () => {
        const item = await request(app)
            .post('/items')
            .send({
                name: 'Item3',
                description: 'Description3',
                quantity: 3,
            });
        const res = await request(app)
            .get(`/items/name/${item.body.name}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual('Item3');
        expect(res.body.description).toEqual('Description3');
        expect(res.body.quantity).toEqual(3);
    });

    it('should update an item', async () => {
        const item = await request(app)
            .post('/items')
            .send({
                name: 'Item4',
                description: 'Description4',
                quantity: 4,
            });
        const res = await request(app)
            .put(`/items/${item.body._id}`)
            .send({
                name: 'Item4',
                description: 'Description4',
                quantity: 5,
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(5);
    });

    it('should delete an item', async () => {
        const item = await request(app)
            .post('/items')
            .send({
                name: 'Item5',
                description: 'Description5',
                quantity: 5,
            });
        const res = await request(app)
            .delete(`/items/${item.body._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should return 400 if invalid request', async () => {
        const res = await request(app)
            .post('/items')
            .send({
                name: 'Item7',
                description: 'Description7',
                quantity: 'seven',
            });
        expect(res.statusCode).toEqual(400);
    });


