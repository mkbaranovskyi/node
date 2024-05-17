# Redis

- [Redis](#redis)
  - [Theory](#theory)
    - [Data types](#data-types)
    - [Security](#security)
    - [Redis persistence](#redis-persistence)
  - [Caching](#caching)

## Theory

1. [Official tutorial](https://redis.io/docs/stack/get-started/tutorials/stack-node/)

Install `redis`.

For **CLI** install `redis-cli`

[Short tutorial video about the CLI](https://youtu.be/Hbt56gFj998?t=476)

---

Redis:

- is a data structure using **key-value pairs**
- stores everything in RAM
- supports multiple data structures
- built in replication (master-slave)
- single-threaded

---

### Data types

Basic:

- string (simple key-value)
- list (**ordered**)
- set (**unordered**, **unique**)
- sorted set (**ordered**, **unique**)
- hash (object with multiple fields)

Advanced:

- bitmaps
- hyperlogs
- geospatial indexes

---

### Security

- doesn't support encryption
- should only be accessed by trusted clients
- never allow external access Internet exposure

---

### Redis persistence

[Docs](https://redis.io/docs/manual/persistence/)

Persistence refers to the writing of data to durable storage, such as a solid-state disk (SSD).

- **no persistence** (the data only exists while the server is running)
- **RDB** (redis database) - periodic snapshots of your data
- **AOF** (append only file) - logs every write operation and plays them again at server startup
- **RDB** + AOF (AOF takes presedence in this case)

**RDB**:

- Pros:
  - compact single file representation of your DB, perfect for back-ups
  - performant as the Redis parent process creates a child process that takes care about everything
  - faster restarts for big datasets compared to AOF
- Cons:
  - you still lose you latest data that appeared after your last snapshot
  - forking child process still takes some time (milliseconds), during this time Redis may stop serving clients

**AOF**:

- Pros:
  - woks as 'append-only', so there are basically no risks
  - has smart mechanism for dealing with too long files in the background (basically, safely changes many small inserts for one big one)
  - logs every operation one after another, so even you 'flushall' everything, you can stop your server, remove the last command and restart Redis
- Cons:
  - can be bigger than RDB
  - can be slower than RDB

It's best to use **both** to keep your data safe (in case you care about it).

---

By default Redis saves snapshots of the dataset on disk, in a binary file called `dump.rdb`. You can configure Redis to have it save the dataset every N seconds if there are at least M changes in the dataset, or you can manually call the `SAVE` or `BGSAVE` commands.

---

## Caching

Based on [this](https://youtu.be/KXnkhWRCj40?si=hKpbNno7ZymXQxtx) video

[Nest docks](https://docs.nestjs.com/techniques/caching)
