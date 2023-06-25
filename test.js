// Import necessary dependencies and functions
const request = require('supertest');
const slugify = require('slugify');
const app = require('./app');

describe('Routes', () => {
  describe('POST /companies', () => {
    it('should create a new company with slugified code', async () => {
      const company = {
        name: 'Example Company Name',
      };

      const response = await request(app).post('/companies').send(company);

      expect(response.status).toBe(201);
      expect(response.body.code).toBe(slugify(company.name, { lower: true }));
    });
  });

  describe('PUT /invoices/:id', () => {
    it('should update an invoice and set paid_date to today', async () => {
      const invoiceId = '123';
      const invoice = {
        amt: 100,
        paid: true,
      };

      const response = await request(app)
        .put(`/invoices/${invoiceId}`)
        .send(invoice);

      expect(response.status).toBe(200);
      expect(response.body.invoice.paid_date).toBe(new Date().toISOString());
    });

    it('should update an invoice and set paid_date to null', async () => {
      const invoiceId = '123';
      const invoice = {
        amt: 100,
        paid: false,
      };

      const response = await request(app)
        .put(`/invoices/${invoiceId}`)
        .send(invoice);

      expect(response.status).toBe(200);
      expect(response.body.invoice.paid_date).toBeNull();
    });

    it('should return 404 if invoice is not found', async () => {
      const invoiceId = 'invalidId';
      const invoice = {
        amt: 100,
        paid: true,
      };

      const response = await request(app)
        .put(`/invoices/${invoiceId}`)
        .send(invoice);

      expect(response.status).toBe(404);
    });
  });

  describe('Many-to-Many', () => {
    // Add your tests for the many-to-many feature here
  });
});
