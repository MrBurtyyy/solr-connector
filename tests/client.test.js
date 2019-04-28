import SolrClient from "../src/client";
import { InvalidSolrOption } from "../src/errors";

test("SolrClient: Constant - HTTP", function() {
  const http = SolrClient.HTTP;
  expect(http).toMatch(/http/);
});

test("SolrClient: Constant - HTTPS", function() {
  const http = SolrClient.HTTPS;
  expect(http).toMatch(/https/);
});

test("SolrClient: createQuery is not undefined or null", function() {
  const client = new SolrClient("localhost", 8983);
  const query = client.createQuery();
  expect(query).not.toBeUndefined();
  expect(query).not.toBeNull();
});

test("SolrClient: Hostname must be a string", function() {
  function invalidHostname() {
    const client = new SolrClient(444, 8983);
  }

  expect(invalidHostname).toThrowError(InvalidSolrOption);
});

test("SolrClient: Port must be a valid number", function() {
  function invalidPortNumber() {
    const client = new SolrClient("localhost", "12a");
  }

  expect(invalidPortNumber).toThrowError(InvalidSolrOption);
});

test("SolrClient: executeQuery requires instance of SolrQuery", function() {
  const queryWithoutObject = function() {
    const client = new SolrClient("localhost", 2181);
    client.executeQuery("Hello World");
  };
  const queryWithObject = function() {
    const client = new SolrClient("localhost", 2181);
    const query = client.createQuery();
    client.executeQuery(query);
  };

  expect(queryWithoutObject).toThrowError(InvalidSolrOption);
  expect(queryWithObject).not.toThrowError(InvalidSolrOption);
});
