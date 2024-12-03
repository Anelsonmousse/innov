import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "03uv5l67", // replace with your Sanity project ID
  dataset: "production", // replace with your Sanity dataset
  apiVersion: '2022-08-08',
  token:
    "sk8F36qpuysDMQBjPjkARoLI21WsAbSKzaz845K85Uif43fKVya5Z8rktWF9UuaSbhTErejEJQUUHZzBoLRXJsnNwnfsCX5VZhLYJRQUAngldWR0o1IvhGwDdqG1FBBEV46OhD9ZTpd0INeCrosvGc2WaqfnxDilCwa65hfPAMWlC9zZTfjm", // replace with your Sanity token
  useCdn: false, // `false` if you want to ensure fresh data
});

export default client;
