import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "xrqp3rws", // replace with your Sanity project ID
  dataset: "production", // replace with your Sanity dataset
  // apiVersion: '2022-08-08',
  token:
    "skQMCrvfDQR63mvPChnvnM3joBs6myKydXvCuX1BR3zbF145uI1OMeKj4Wpmg2z44zQbST4ZAmjIg5TaKISv4wOzQTcCMwq8rSw7Zc8yslPrfq9SxcylyNaKofgXA3ENJLi1fbfvE2zwyBndL9NvR2o8sBlgsMjFUjNW5ZSrtjse1UZkMEl7", // replace with your Sanity token
  useCdn: false, // `false` if you want to ensure fresh data
});

export default client;
