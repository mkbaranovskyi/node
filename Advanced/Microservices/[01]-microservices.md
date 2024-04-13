# MIcroservices

- [MIcroservices](#microservices)
  - [Monolithic vs Microservices](#monolithic-vs-microservices)
  - [Nest](#nest)
    - [`./nest-example` project](#nest-example-project)
  - [Kafka](#kafka)
    - [`./kafka` project](#kafka-project)

---

## Monolithic vs Microservices

Monolithic architecture:

![](img/20240303174558.png)

If one of the services fails, the entire application fails

Microservices architecture:

![](img/20240303174630.png)

If one of the services fails - only that service fails, the rest of the application continues to work

---

## Nest

### `./nest-example` project

This example project is based on [this](https://youtu.be/C250DCwS81Q?si=-3CpNUCDdCoiB48n) video.

---

## Kafka

### `./kafka` project

This example project is based on [this](https://youtu.be/JJEKPqSlXvk?si=-U92G9EfsWJwFd7H) video.

In the `kafdrop` folder we have a `docker-compose.yml` file that will start a Kafka and Kafdrop containers. Open `localhost:9000` to see the Kafka UI.
