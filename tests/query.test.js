import SolrQuery from "../src/query";

test("SolrQuery: Instance is not undefined or null", function() {
  const query = new SolrQuery();
  expect(query).not.toBeNull();
  expect(query).not.toBeUndefined();
});

test("SolrQuery: Setting query should modify the internal object", function() {
  let query = new SolrQuery();
  let initOptions = query.getOptions();
  expect(initOptions).toHaveProperty("q", "*:*");
  query = query.withQuery("chocolate");
  expect(initOptions).toHaveProperty("q", "chocolate");
});

test("SolrQuery: Add single filter query", function() {
  const query = new SolrQuery();
  const initOptions = query.getOptions();
  expect(initOptions).not.toHaveProperty("fq"); // Initial query should not have any filter queries
  query.withFilterQuery("title:'Hello World'");
  expect(initOptions).toHaveProperty("fq", "title:'Hello World'");
});

test("SolrQuery: Add multiple filter queries", function() {
  const query = new SolrQuery();
  const initOptions = query.getOptions();
  expect(initOptions).not.toHaveProperty("fq");
  query.withFilterQuery(["title:'Hello World'", "name:'Unit Test'"]);
  expect(initOptions).toHaveProperty("fq", [
    "title:'Hello World'",
    "name:'Unit Test'"
  ]);
});

test("SolrQuery: withFilterQuery should only accept String or Array<String>", function() {
  const query = new SolrQuery();
  const initOptions = query.getOptions();
  expect(initOptions).not.toHaveProperty("fq");
  query.withFilterQuery({ fq: "Hello World" });
  expect(initOptions).not.toHaveProperty("fq");
});

test("SolrQuery: withFieldList should only accept String or Array<String>", function() {
  const query = new SolrQuery();
  const initOptions = query.getOptions();
  expect(initOptions).not.toHaveProperty("fl");
  query.withFilterQuery({ fq: "Hello World" });
  expect(initOptions).not.toHaveProperty("fl");
});
