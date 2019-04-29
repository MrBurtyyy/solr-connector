import SolrClient from "./src/client";
require("dotenv").config();

let client = new SolrClient(process.env["SOLR_URL"], process.env["SOLR_PORT"], {
  auth: {
    username: process.env["SOLR_USERNAME"],
    password: process.env["SOLR_PASSWORD"]
  },
  transportMethod: SolrClient.HTTP
});

let query = client.createQuery();
query = query.withQuery("*:*");
console.log(query.createQueryString());
const response = client.executeQuery(query, "competitorNews");
console.log(response.name);
response
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
