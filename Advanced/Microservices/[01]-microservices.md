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
    - [19 - Stripe setup](#19---stripe-setup)
    - [22 Notifications](#22-notifications)
    - [24 Google Cloud Engine Setup](#24-google-cloud-engine-setup)
    - [25 - Productionize and Push Dockerfile](#25---productionize-and-push-dockerfile)
    - [27. Automated CI/CD with CloudBuild](#27-automated-cicd-with-cloudbuild)
    - [28. Helm and Kubernetes](#28-helm-and-kubernetes)

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

4. Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) and [Minikube](https://minikube.sigs.k8s.io/docs/start)

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

### 19 - Stripe setup

```bash
nest g app payments
pnpm i stripe
```

Go to [Stripe](https://dashboard.stripe.com/test/dashboard), register, create an account and get the API keys.

Click `New Business` in the top left corner and create a new product.

---

### 22 Notifications

```bash
nest g app notifications
```

To create Google `OAuth` credentials, go to [Google Cloud Console](https://console.cloud.google.com/).

Create new project, go to `APIs & Services` -> `Credentials` -> `OAuth Consent Screen` and fill in the required fields. Add a test user (yourself) as **external** user.

![](img/20241015212212.png)

Add a test user (yourself) once again.

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

### 24 Google Cloud Engine Setup

Go to `Google Cloud Console -> Container Registry` and enable the API.

Also enable `Contaier Artifact Registry`. Go to it and create a repository for each of our apps (4 total). We'll push our Docker images to these repositories.

![](img/20241020130929.png)

![](img/20241020131325.png)

Install `Google Cloud SDK`: [link](https://cloud.google.com/sdk/docs/install-sdk), login and set the project.

```bash
gcloud config configurations create sleepr

gcloud config set project sleepr-439209 # Your project ID
```

Follow the instructions here

![](img/20241020133756.png)

```bash
gcloud auth application-default login

gcloud artifacts repositories list
#Listing items under project sleepr-439209, across all locations.

                                                                    #ARTIFACT_REGISTRY
#REPOSITORY     FORMAT  MODE                 DESCRIPTION  LOCATION         LABELS  ENCRYPTION          CREATE_TIME          UPDATE_TIME          SIZE (MB)
#auth           DOCKER  STANDARD_REPOSITORY               europe-central2          Google-managed key  2024-10-20T13:10:42  2024-10-20T13:12:03  0
#notifications  DOCKER  STANDARD_REPOSITORY               europe-central2          Google-managed key  2024-10-20T13:11:48  2024-10-20T13:12:06  0
#payments       DOCKER  STANDARD_REPOSITORY               europe-central2          Google-managed key  2024-10-20T13:11:21  2024-10-20T13:12:09  0
#reservations   DOCKER  STANDARD_REPOSITORY               europe-central2          Google-managed key  2024-10-20T13:08:44  2024-10-20T13:12:11  0
```

Copy and paste the command from the screenshot above:

```bash
gcloud auth configure-docker \
    europe-central2-docker.pkg.dev
```

Build the images with local tags:

```bash
docker build -t auth -f apps/auth/Dockerfile .
docker build -t payments -f apps/payments/Dockerfile .
docker build -t reservations -f apps/reservations/Dockerfile .
docker build -t notifications -f apps/notifications/Dockerfile .
```

Copy the URI from the `gcloud artifacts repositories list` command and tag the images and use it:

![](img/20241020141522.png)

Tag the images for Artifact Registry (including the registry path (`europe-central2-docker.pkg.dev/sleepr-439209`), repository (e.g. `auth`) and tag (`production`)):

```bash
docker tag auth europe-central2-docker.pkg.dev/sleepr-439209/auth/production # We added the `/production` part at the end
docker tag payments europe-central2-docker.pkg.dev/sleepr-439209/payments/production
docker tag reservations europe-central2-docker.pkg.dev/sleepr-439209/reservations/production
docker tag notifications europe-central2-docker.pkg.dev/sleepr-439209/notifications/production
```

Push the images:

```bash
docker image push europe-central2-docker.pkg.dev/sleepr-439209/auth/production
docker image push europe-central2-docker.pkg.dev/sleepr-439209/payments/production
docker image push europe-central2-docker.pkg.dev/sleepr-439209/reservations/production
docker image push europe-central2-docker.pkg.dev/sleepr-439209/notifications/production
```

Verify the images are in the registry:

```bash
gcloud artifacts docker images list europe-central2-docker.pkg.dev/sleepr-439209/reservations
gcloud artifacts docker images list europe-central2-docker.pkg.dev/sleepr-439209/auth
gcloud artifacts docker images list europe-central2-docker.pkg.dev/sleepr-439209/payments
gcloud artifacts docker images list europe-central2-docker.pkg.dev/sleepr-439209/notifications
```

---

### 25 - Productionize and Push Dockerfile

Update our `Dockerfile`-s to only copy what each app needs.

```Dockerfile
FROM node:alpine AS build

WORKDIR  /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
# Updates here
COPY tsconfig*.json ./

RUN npm i -g pnpm

RUN pnpm i

# Updates here - we only copy the necessary files
COPY apps/payments apps/payments
COPY libs libs
# Updates here - install app-specific dependencies as well
RUN cd apps/payments && pnpm i

RUN pnpm run build

# The rest is unchanged...
```

Create a `package.json` for every app and move their specific dependencies there from the global `package.json`.

Then rebuild, tag and push the images:

```bash
docker build -t payments -f apps/payments/Dockerfile .
docker tag payments europe-central2-docker.pkg.dev/sleepr-439209/payments/production
docker push europe-central2-docker.pkg.dev/sleepr-439209/payments/production

# Repeat for the other apps
```

---

### 27. Automated CI/CD with CloudBuild

Create a `cloudbuild.yaml` file in the root of the project.

Enable the `Cloud Build API` in the Google Cloud Console.

![](img/20241020221812.png)

---

### 28. Helm and Kubernetes

1. Install [Helm](https://helm.sh/)

```bash
mkdir k8s
cd k8s
helm create sleepr
```

2. Delete the contents of the `templates` folder clean up the `values.yaml` file.
3. Create deployment and make sure there's always a pod running for each of our apps.

```yaml
kubectl create deployment auth --image=europe-central2-docker.pkg.dev/sleepr-439209/auth/production --dry-run=client -o yaml > deployment.yaml
```

4. Adjust the `deployment.yaml` file

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: auth
  name: auth
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth
  template:
    metadata:
      labels:
        app: auth
    spec:
      containers:
        - image: europe-central2-docker.pkg.dev/sleepr-439209/auth/production
          name: auth
```

5. Move this file to the `k8s/sleepr/templates/auth` folder
6. Run

```bash
cd sleepr
helm install sleepr .

# Check the status
kubectl get po

# You might see something like this
# NAME                   READY   STATUS             RESTARTS   AGE
# auth-84dbfd974-ln7bj   0/1     ImagePullBackOff   0          3m28s

# You can see the reason for this is that the image is private
kubectl describe po auth-84dbfd974-ln7bj
```

7. Create credentials for Kubernetes to pull the images:

![](img/20241029131103.png)

![](img/20241029131236.png)

Role: Artifact Registry -> Artifact Registry Reader

![](img/20241029131325.png)

After creation, enter the newly created service account and create a key for it.

![](img/20241029131731.png)

Create a new JSON key and download it.

![](img/20241029132217.png)

8. Create a secret in Kubernetes (get the --docker-server from the `Artifact Registry - Setup instructions` page):

```bash
kubectl create secret docker-registry gcr-json-key \
  --docker-server=europe-central2-docker.pkg.dev \
  --docker-username=_json_key \
  --docker-password="$(cat ./sleepr-439209-8b78089e4961.json)" \
  --docker-email=kostortitus@gmail.com
```

Now we have to add our key to the default service account so it's actually used.

```bash
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'

kubectl rollout restart deployment auth
```

Repeat points 3-5 for the other apps.

Upgrade the Helm chart to include the other apps:

```bash
cd k8s/sleepr
helm upgrade sleepr .
```
