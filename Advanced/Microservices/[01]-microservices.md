# MIcroservices

- [MIcroservices](#microservices)
  - [Nest](#nest)
    - [`./nest-example` project](#nest-example-project)
    - [Request-response message style](#request-response-message-style)
  - [Kafka](#kafka)
    - [`./kafka` project](#kafka-project)

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
