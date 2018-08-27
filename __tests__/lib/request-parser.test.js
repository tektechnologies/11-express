'use strict';

const EventEmitter = require('events');
const requestParser = require('../../src/lib/request-parser');

describe('request-parser', () => {
  it('resolves with the request', () => {
    var req = new FakeRequest('http://localhost:3000/fake');
    return requestParser(req)
      .then(result => {
        expect(result).toBe(req);
      });
  });
  it('parses url into parsedURL', () => {
    var req = new FakeRequest('http://localhost:3000/fake?qs=1');

    return requestParser(req)
      .then(() => {
        expect(req.parsedUrl).toBeDefined();
        expect(req.parsedUrl.pathname).toBe('/fake');
        expect(req.parsedUrl.query).toBe('qs=1');
      });
  });

  it('parses query string into query', () => {
    var request = new FakeRequest('http://localhost:3000/fake?a=1&b=2');

    return requestParser(request)
      .then(() => {
        expect(request.query).toBeDefined();
        expect(request.query.a).toBe('1');
        expect(request.query.b).toBe('2');
      });
  });

  const describeMethodsWithBody = describe.each(['POST','PUT', 'PATCH']);

  describeMethodsWithBody('for %s request', method => {
    it('parses plain text body', () => {
      var request = new FakeRequest('http://localhost:3000/fake', method);
      var parser = requestParser(request);
      //emit after the promise and before the then
      //so we test with plain textabc123 string.
      request.emit('data', new Buffer('abc'));
      request.emit('data', new Buffer('123'));
      request.emit('end');
      return parser.then(result => {
        expect(result).toBe(request);
        expect(request.body).toBe('abc123');
      });
    });

    it('parses JSON bodys', () => {
      var request = new FakeRequest('http://localhost:3000/fake', method);
      request.headers['content-type'] = 'application/json';
      var parser = requestParser(request);

      //emit after the promise and before the then
      //create json key (first emit): value syntax second emit
      request.emit('data', new Buffer('{"abc"'));
      request.emit('data', new Buffer(': 123}'));
      request.emit('end');
      return parser.then(result => {
        expect(result).toBe(request);
        expect(request.body).toEqual({'abc' : 123});
      });
    });


    it('on JSON body errror set the request.text', () => {
      var request = new FakeRequest('http://localhost:3000/fake', method);
      request.headers['content-type'] = 'application/json';
      var parser = requestParser(request);

      
      request.emit('data', new Buffer('{"abc"'));
      request.emit('data', new Buffer(':123'));
      request.emit('end');

      return expect(parser)
        .rejects.toThrow('JSON')
        .then(() => {
          expect(request.body).toBe(null);
          expect(request.text).toBe('{"abc":123');
        });
        
    });
  });
});

class FakeRequest extends EventEmitter {
  constructor(url, method = 'GET') {
    super();
    this.url = url;
    this.method = method;
    this.headers = {};
  }
}
