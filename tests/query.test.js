import SolrQuery from "../src/query";

test("SolrQuery: Instance is not undefined or null", function() {
  const query = new SolrQuery();
  expect(query).not.toBeNull();
  expect(query).not.toBeUndefined();
});

test("SolrQuery: Setting query should modifiy the internal object", function() {
  let query = new SolrQuery();
  let initOptions = query.getOptions();
  expect(initOptions).toHaveProperty("q", "*:*");
  query = query.withQuery("chocolate");
  expect(initOptions).toHaveProperty("q", "chocolate");
});
