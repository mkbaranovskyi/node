# GoCardless

- [GoCardless](#gocardless)
  - [Links](#links)
  - [Intro](#intro)
  - [Mandates](#mandates)
  - [Adding customers](#adding-customers)
  - [Webhook](#webhook)

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
  'sandbox_ss1102_64k-o3f7AVIesSot6W9EORfjOnrBNnBn6',
  // Change this to constants.Environments.Live when you're ready to go live
  constants.Environments.Sandbox
);

async function run(){
  const listResponse = await client.customers.list();
  const customers = listResponse.customers;
  console.log(customers);
};

run();
```

***

## Mandates

A mandate is an authorisation from a customer to take payments from their bank account.

Once you have a mandate set up, you can charge the customer with future API calls.

***

## Adding customers

[How to do](https://developer.gocardless.com/api-reference/#core-endpoints-redirect-flows)

Start the Redirect Flow:

```js
const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");

const client = gocardless(
  'sandbox_ss1102_64k-o3f7AVIesSot6W9EORfjOnrBNnBn6',
  // Change this to constants.Environments.Live when you're ready to go live
  constants.Environments.Sandbox
);

async function run(){
  const listResponse = await client.customers.list();
  const customers = listResponse.customers;
  console.log(customers);

  const redirectFlow = await client.redirectFlows.create({
    description: "Cider Barrels",
    session_token: "dummy_session_token",
    success_redirect_url:
      "https://developer.gocardless.com/example-redirect-uri/",
    // Optionally, prefill customer details on the payment page
    prefilled_customer: {
      given_name: "Max",
      family_name: "Bar",
      email: "maksym.b@psoft.pro",
      address_line1: "338-346 Goswell Road",
      city: "London",
      postal_code: "EC1V 7LQ"
    }
  });
  
  // Hold on to this ID - you'll need it when you
  // "confirm" the redirect flow later
  console.log(redirectFlow.id); // RE0003KBAV02B80XDP844AM54GYPEJHG
  console.log(redirectFlow.redirect_url); // https://pay-sandbox.gocardless.com/flow/RE0003KBAV02B80XDP844AM54GYPEJHG
};

run();
```

Complete the form - you'll be redirected to the success page. Finish the flow:

```js
const redirectFlow = await client.redirectFlows.complete(
  savedRedirectFlow.id,
  {
    session_token: "dummy_session_token"
  }
);

// Store the mandate ID against the customer's database record so you can charge
// them in future
console.log(`Mandate: ${redirectFlow.links.mandate}`);
console.log(`Customer: ${redirectFlow.links.customer}`);

// Display a confirmation page to the customer, telling them their Direct Debit has been
// set up. You could build your own, or use ours, which shows all the relevant
// information and is translated into all the languages we support.
console.log(`Confirmation URL: ${redirectFlow2.confirmation_url}`);

// Now we have a user
const listResponse = await client.customers.list();
const customers = listResponse.customers;
console.log(customers);
```

Now your customer is created.

***

## Webhook

A webhook is a request that GoCardless sends to your server to alert you of an event. 

Adding support for webhooks allows you to receive real-time notifications from GoCardless when things happen in your account, so you can take automated actions in response, for example:

- When a payment fails due to lack of funds, retry it automatically
- When a customer cancels their mandate with the bank, suspend their account
- When a customer’s subscription generates a new payment, record that payment against their account


