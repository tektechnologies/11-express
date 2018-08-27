'use strict';

const request = require('supertest');
const app = require('../src/app');
const Cow = require('../src/models/cows');

describe('app', () => {

  it('responds with 404 for unknown path', () => {
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html')
      .expect('Resource Not Found');
  });
  it('responds with HTML for /', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response => {
        expect(response.text[0]).toBe('<');
      });
  });

  it('respond with 500 for /500', () => {
    return request(app)
      .post('/500')
      .expect(500)
      .expect('Content-Type', 'text/html')
      .expect('Test Error');
  });

  it('responds with message for POST /api/cowsay', () => {
    return request(app)
      .post('/api/cowsay')
      .send({ text: 'Craig' })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect(response => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toMatch('Hello, Craig!');
      });
  });


  describe('api routes', () => {
    it('can get /api/cows', () => {
      var cows = [
        new Cow({ title: 'test 1', content: 'Peter' }),
        new Cow({ title: 'test 2', content: 'Paul' }),
        new Cow({ title: 'test 3', content: 'Mary' }),
      ];

      return Promise.all(
        cows.map(cow => cow.save())
      ).then(savedCows => {
        return request(app)
          .get('/api/cows')
          .expect(200)
          .expect('Content-Type', 'application/json')
          .expect(savedCows);
      });
    });

    it('can get /api/cows?id=...', () => {
      var cow = new Cow({ title: 'save me', content: 'please' });

      return cow.save()
        .then(saved => {
          return request(app)
            .get(`/api/notes?id=${saved.id}`)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(saved);
        });
    });

    it('can POST /api/notes to create cow', () => {
      return request(app)
        .post('/api/cows')
        .send({ title: 'Testing', content: 'It works!' })
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect(response => {
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
          expect(response.body.title).toBe('Testing');
          expect(response.body.content).toBe('It works!');
        });
    });

    

    it('can delete /api/cowsay=deleteme', () => {
      return request(app)
        .delete('/api/cowsay?id=1')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ message: `Cow number 1 is deleted` });
    });
  });
});//closes describe app
