# MIcroservices

- [MIcroservices](#microservices)
  - [Nest](#nest)
    - [`./nest-example` project](#nest-example-project)
    - [Request-response message style](#request-response-message-style)
  - [Kafka](#kafka)
    - [`./kafka` project](#kafka-project)
  - [Nest Udemy project](#nest-udemy-project)
    - [Preparation](#preparation)
    - [Project setup](#project-setup)
    - [Passport](#passport)
    - [JWT Strategy](#jwt-strategy)
    - [18 - Microservices](#18---microservices)
  - [Payments](#payments)
    - [19 - Stripe setup](#19---stripe-setup)
  - [22 Notifications](#22-notifications)

---

## Nest

### `./nest-example` project

This example project is based on [this](https://youtu.be/C250DCwS81Q?si=-3CpNUCDdCoiB48n) video.

### Request-response message style

For this type of interactions there are 2 types of channels:

- Request channel
- Response channel

**Example**: send values 1,2,3 and receive them back on the receiving side

1st microservice:

```ts
// Controller
@Get('/analytics')
getAnalytics() {
  return this.appService.getAnalytics()
}

// Service
import { from, map } from 'rxjs'

// This method will log all the values but only return the last one
getAnalytics() {
  return from(this.analyticsClient.send('get_analytics', {})).pipe(
    map((data) => {
      console.log(data)
      return data
    })
  )
}
```

2nd microservice:

```ts
// Controller
@MessagePattern('get_analytics')
getAnalytics() {
  return this.appService.getAnalytics()
}

// Service
import { interval, map, takeWhile } from 'rxjs'

getAnalytics() {
  return interval(1000).pipe(
    takeWhile((count) => count <= 2),
    map((count) => count + 1)
  )
}
```

---

## Kafka

### `./kafka` project

This example project is based on [this](https://youtu.be/JJEKPqSlXvk?si=-U92G9EfsWJwFd7H) video.

In the `kafdrop` folder we have a `docker-compose.yml` file that will start a Kafka and Kafdrop containers. Open `localhost:9000` to see the Kafka UI.

---

## Nest Udemy project

[Udemy course](https://www.udemy.com/course/nestjs-microservices-build-deploy-a-scaleable-backend)

The completed project source code is located [here](https://github.com/mguay22/sleepr). There are commits in that repository that follow along with the project.

![](img/20240728222314.png)

### Preparation

1. Enable `pnpm` using Corepack

```bash
# In the project folder
corepack enable pnpm
corepack use pnpm@latest
```

2. Install Docker

3. Install Google Cloud CLI [for Ubuntu](https://cloud.google.com/sdk/docs/downloads-snap)

```bash
snap remove google-cloud-sdk
snap install google-cloud-cli --classic

nano ~/.bashrc

# Add this line at the end of the file
source /snap/google-cloud-cli/current/completion.bash.inc
# Save the file and exit

source ~/.bashrc
```

4. Install [Minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fdebian+package) and [KubeCtl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

```bash
# Install Minukube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb

# Install KubeCtl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

5. Install Nest CLI

```bash
npm i -g @nestjs/cli
```

### Project setup

```bash
nest new sleepr
cd sleepr
pnpm run start
```

We'll create a **monorepo** where we'll have shared modules.

```bash
nest g library common
```

Install some basic packages

```bash
pnpm i mongoose @nestjs/mongoose @nestjs/config joi
```

Create a module and select the `common` library (you can check the `nest-cli.json` file to see the available libraries)

```bash
nest g module database -p common
```

Now we can remove `common.service`, `common.controller` and `common.module` from the `common` library as each of our microservices will import the common modules they need.

Now we can create a `config` module

```bash
nest g module config -p common
```

Connect our `config.module` and `database.module` to the `app.module`. Don't forget the index files.

Btw, update `tsconfig.json` to be able to use `@app/common` paths:

```json
"paths": {
  "@app/common": [
    "libs/common/src"
  ],
  "@app/common/*": [
    "libs/common/src/*"
  ]
}
```

Define the DB abstract schema dn repository in the `database` module.

---

Now create a new app

```bash
nest g app reservations
```

In `nest-cli.json` remove the `sleepr` app and add the `reservations` app as it will be our default app. Also remove the `sleepr` library (the folder)

Connect the `DatabaseModule` to the `ReservationsModule` and create a `reservation` resource.

```bash
nest g resource reservations # Select the `reservations` app
```

Now replace the top-level `reservations.module`, `controller` and `service` with all the generated files - this is what we'll work with from now on.

Add validation and logging:

```bash
pnpm i class-validator class-transformer nestjs-pino pino-http pino-pretty
```

Now let's create a `logger` module

```bash
nest g module logger -p common
```

Add the `LoggerModule` to the `ReservationsModule` and create a `logger` service.

---

```bash
nest g app auth

nest g module users -p auth
nest g controller users -p auth
nest g service users -p auth
```

Create the repo, schema and service for the `users` module.

Try running your newly created app:

```bash
pnpm start:dev auth
```

---

### Passport

```bash
pnpm i @nestjs/passport passport passport-local && pnpm i -D @types/passport-local
pnpm i @nestjs/jwt passport-jwt bcryptjs && pnpm i -D @types/passport-jwt @types/bcryptjs
```

Create dedicated `.env` for each app

---

### JWT Strategy

```bash

```

Create `JWTStrategy` and `JwtAuthGuard`.

---

### 18 - Microservices

Now we need to apply our guard to the `reservation` app. And to do that, we have to start adding microservices.

```bash
pnpm i @nestjs/microservices
```

In our `auth` app, we'll convert it to hybrid app (handles both incoming HTTP requests and requests over our microservices layer).

We'll also create a common `AuthGuard` that will be used in both apps. So this guard will be put to the `libs/common` folder as it should be available for all apps.

---

## Payments

### 19 - Stripe setup

```bash
nest g app payments
pnpm i stripe
```

Go to [Stripe](https://dashboard.stripe.com/test/dashboard), register, create an account and get the API keys.

Click `New Business` in the top left corner and create a new product.

---

## 22 Notifications

```bash
nest g app notifications
```

To create Google `OAuth` credentials, go to [Google Cloud Console](https://console.cloud.google.com/).

Create new project, go to `APIs & Services` -> `Credentials` -> `OAuth Consent Screen` and fill in the required fields. Add a test user (yourself)

![](img/20241015212212.png)

![](img/20241015212306.png)

Choose `Web application` and add the `Authorized redirect URIs` (for example `https://developers.google.com/oauthplayground`)

Copy your credentials to the project

![](img/20241015212756.png)

Go to [OAuth Playground](https://developers.google.com/oauthplayground) and select the `Google OAuth2 API v2` and `https://www.googleapis.com/auth/gmail.send` scope.

![](img/20241015213548.png)

Proceed, choose your account and allow the permissions.

![](img/20241015213718.png)

![](img/20241015214030.png)

Done. Now create a new user using the same email as the one you used for the OAuth. Logic as this user and create a reservation - you'll receive an email.

---

