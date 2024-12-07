import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "xrqp3rws", // replace with your Sanity project ID
  dataset: "production", // replace with your Sanity dataset
  // apiVersion: '2022-08-08',
  token:
    "skFSYtRNLPBlwFbKeVt0AwKg6ZJx34sePVeU30IJHOmohW2MS6TBj0pqgUEaIhpmeALW4PSXEIPW6qTWalH9Pxsv5GAQhftOMbujtj5JkcfsoJNorgMbuAqFVMNjghTOwfDL5pgpMb27BqfwiuRiBydOKuEBSMkaX8pxc8smr8ytzKFxA8nV", // replace with your Sanity token
  useCdn: false, // `false` if you want to ensure fresh data
});

export default client;
