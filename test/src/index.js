const gocardless = require("gocardless-nodejs");
const constants = require("gocardless-nodejs/constants");

const client = gocardless(
  'sandbox_ss1102_64k-o3f7AVIesSot6W9EORfjOnrBNnBn6',
  // Change this to constants.Environments.Live when you're ready to go live
  constants.Environments.Sandbox
);

async function run(){
  // const listResponse = await client.customers.list();
  // const customers = listResponse.customers;
  // console.log(customers);

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