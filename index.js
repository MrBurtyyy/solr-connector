import SolrClient from "./src/client";

let client = new SolrClient("635218.vps-10.com", 8983);

let query = client.createQuery();
query = query.withQuery("chocolate").withQuery("echs dee");
let qs = query.createQueryString();
console.log(qs);
