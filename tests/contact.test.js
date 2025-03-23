const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Contact = require('../models/contactModel');

describe('Contact API Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        await Contact.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new primary contact if no match is found', async () => {
        const response = await request(app)
            .post('/identify')
            .send({ email: 'test@example.com', phoneNumber: '1234567890' });

        expect(response.status).toBe(200);
        expect(response.body.contact.primaryContactId).toBeDefined();
        expect(response.body.contact.emails).toEqual(['test@example.com']);
        expect(response.body.contact.phoneNumbers).toEqual(['1234567890']);
        expect(response.body.contact.secondaryContactIds).toEqual([]);
    });

    it('should create a secondary contact and link to existing primary', async () => {
        const primary = new Contact({
            email: 'test@example.com',
            linkPrecedence: 'primary',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await primary.save();

        const response = await request(app)
            .post('/identify')
            .send({ email: 'test@example.com', phoneNumber: '1234567890' });

        expect(response.status).toBe(200);
        expect(response.body.contact.primaryContactId).toBe(primary._id.toString());
        expect(response.body.contact.emails).toEqual(['test@example.com']);
        expect(response.body.contact.phoneNumbers).toEqual(['1234567890']);
        expect(response.body.contact.secondaryContactIds.length).toBe(1);
    });

    it('should convert an existing primary contact to secondary when linking contacts', async () => {
        // Create first primary contact
        const primary1 = new Contact({
            email: 'test1@example.com',
            linkPrecedence: 'primary',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await primary1.save();

        // Create second primary contact
        const primary2 = new Contact({
            phoneNumber: '1234567890',
            linkPrecedence: 'primary',
            createdAt: new Date(Date.now() + 1000), // Created 1 second later
            updatedAt: new Date(Date.now() + 1000)
        });
        await primary2.save();

        const response = await request(app)
            .post('/identify')
            .send({ email: 'test1@example.com', phoneNumber: '1234567890' });

        expect(response.status).toBe(200);
        expect(response.body.contact.emails).toEqual(['test1@example.com']);
        expect(response.body.contact.phoneNumbers).toEqual(['1234567890']);
        expect(response.body.contact.secondaryContactIds.length).toBe(1);

        // Verify the contacts in database
        const contact1 = await Contact.findOne({ email: 'test1@example.com' });
        const contact2 = await Contact.findOne({ phoneNumber: '1234567890' });

        expect(contact1.linkPrecedence).toBe('primary');
        expect(contact2.linkPrecedence).toBe('secondary');
        expect(contact2.linkedId.toString()).toBe(contact1._id.toString());
        expect(response.body.contact.primaryContactId).toBe(contact1._id.toString());
    });
});
