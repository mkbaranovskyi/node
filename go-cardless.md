# GoCardless

- [GoCardless](#gocardless)
  - [Links](#links)
  - [Intro](#intro)

***

## Links

1. [Docs](https://developer.gocardless.com/getting-started)

***

## Intro

Sign in to the [sandbox](https://manage-sandbox.gocardless.com).

Generate an **Access Token** and include it with your requests using `Bearer` schema.

```bash
npm install gocardless-nodejs
```

First test request: list our customers (empty array at first)

```js
const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");

const client = gocardless(
  // We recommend storing your access token in an environment
  // variable for security
  process.env.GoCardlessAccessToken,
  // Change this to constants.Environments.Live when you're ready to go live
  constants.Environments.Sandbox
);

const listResponse = await client.customers.list();
const customers = listResponse.customers;
console.log(customers);
```