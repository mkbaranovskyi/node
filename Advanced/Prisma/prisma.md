# Prisma

- [Prisma](#prisma)
  - [Intro](#intro)
    - [Sources](#sources)
    - [Install and Run](#install-and-run)
  - [`schema.prisma`](#schemaprisma)
    - [Enum](#enum)
    - [Model](#model)
    - [Relations](#relations)
      - [Many to One](#many-to-one)
      - [Many to Many](#many-to-many)
      - [One to One](#one-to-one)
  - [Client operations](#client-operations)
    - [Basics](#basics)
    - [Logging](#logging)

---

## Intro

### Sources

1. [Tutorial](https://youtu.be/RebA5J-rlwg)

### Install and Run

First, **install the `Prisma` VS Code extension** - it'll autocomplete the Prisma syntax.

1. `yarn add @prisma/client && yarn add -D prisma`
2. `npx prisma init --datasource-provider postgresql` - it will install the prisma client and create the `prisma` folder with the `schema.prisma` file.
3. Adjust the variable in `.env`: `DATABASE_URL="postgresql://admin:admin@postgres:5432/test"` - the DB **should already exist**!
4. Add your schemas to `schema.prosma`:

```prisma
model User {
  id        Int    @id @default(autoincrement())
  name      String
}
```

5. Migrate the tables:

```bash
# it will create the DB tables (and the `prisma/migrations` folder)
npx prisma migrate dev --name init
```

You will also see in the console such a note:

```bash
✔ Generated Prisma Client (4.16.0 | library) to ./node_modules/@prisma/client in 37ms
```

It means that the `@prisma/client` was generated and you can use it in your code to interact with your entity.

If we wanted to re-generate our client, we can type `npx prisma generate` (it will generate the client in the `node_modules` folder).

**Whenever you need to update the DB, you can run `npx prisma migrate` again**. 

Then add **a single** PrismaClient instance to your code - it will manage **all** your database connections.

```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({ data: { name: "Bob" } });
  console.log(user);
}

main()
  .catch((e) => console.error(e.message))
  .finally(() => prisma.$disconnect());
```

**NB**: if you run into a problem of not having typing suggestions in here ...

```ts
const user = await prisma.user.create({ data: { /*here*/} });
```

... you can try reopening the file, entering the model via F12 or reopen the window (and `npx prisma generate` or course if you haven't done it before)

---

Utilities:

```bash
# Format .prisma file
npx prisma format
```

---

## `schema.prisma`

Your main config file.

```prisma
// You can have multiple generators (e.g. for GraphQL)
generator client {
  provider = "prisma-client-js"
}

// You can only have a single datasource
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id   Int    @id @default(autoincrement())
  name String
  // email     String   @unique
  // password  String
  // createdAt DateTime @default(now())
  // updatedAt DateTime @updatedAt
  // posts     Post[]
}
```

---

### Enum

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id    String  @id @default(uuid())
  role  Role    @default(USER)
}
```

---

### Model

Have 4 types of fields:

- **name**
- **type**
- field modifiers (`?`, `[]`)
- attributes (e.g. `@id`, `@default`, `@unique`, `@updatedAt`)

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String? @unique
  posts Post[]
}
```

There are also block-level attributes. They start with `@@` and are used to configure the model itself.

```prisma
model User {
  id    String  @id @default(uuid())
  name  String
  age   Int

  @@unique([name, age])
  @@index([email])
}
```

We can use composed IDs:

```prisma
model Post {
  // id            String     @id @default(uuid())
  title         String
  author        User       @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId      String

  @@id([authorId, title])
}
```

***

### Relations

#### Many to One

Start with this and stop where the comment says

```prisma
model User {
  id          Int     @id @default(autoincrement())
  name        String
}

model Post {
  id        Int      @id @default(autoincrement())
  rating    Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User // -<--- and auto-save here - Prisma will autopopulate the models
}
```

You'll get this

```prisma
model User {
  id          Int     @id @default(autoincrement())
  name        String
  posts        Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  rating    Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [userId], references: [id])
  userId    Int
}
```

---

An example of relations with multiple connections (user can have "writtenPosts" and "favoritePosts" - both are related to the Post endity). For this, we use labels to distinguish the relations.

```prisma
model User {
  id            String  @id @default(uuid())
  name          String
  writtenPosts  Post[]  @relation("WrittenPosts")
  favoritePosts Post[]  @relation("FavoritePosts")
}

model Post {
  id            String   @id @default(uuid())
  rating        Float
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  author        User     @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId      String
  favoritedBy   User?    @relation("FavoritePosts", fields: [favoritedById], references: [id])
  favoritedById String?
}
```

---

#### Many to Many

```prisma
model Post {
  id            String     @id @default(uuid())
  Categories    Category[]
}

model Category {
  id   String @id @default(uuid())
  name String
  post Post[]
}
```

---

#### One to One

Should always have a unique field (e.g. `email`).

```prisma
model User {
  id                String           @id @default(uuid())
  userPreferencesId UserPreferences?
}

model UserPreferences {
  id           String  @id @default(uuid())
  emailUpdated Boolean
  user         User    @relation(fields: [userId], references: [id])
  userId       String  @unique // <--- here
}
```

---

## Client operations

### Basics

Create - basic example:

```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Boris",
      email: "boris@domain.com",
      age: 17,
    },
  });
  console.log(user);
}
```

With relations: 

```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Boris",
      email: "boris@domain.com",
      age: 17,
      userPreferences: {
        create: {
          emailUpdates: true,
        },
      },
    },
    include: { userPreferences: true },
  });
  console.log(user);
}

/* Result:
{
  id: '5db1ed0b-c630-418b-a54d-a2aa4e65a7d2',
  name: 'Boris',
  age: 17,
  email: 'boris@domain.com',
  role: 'USER',
  preferences: null,
  blob: null,
  userPreferencesId: {
    id: 'bb92c758-538f-47b3-ba3a-27df107c652a',
    emailUpdates: true,
    userId: '5db1ed0b-c630-418b-a54d-a2aa4e65a7d2'
  }
}
/*
```

---

When we want to delete `User`, we may encounter a problem: a foreign key constraint (in UserPreferences).

We can solve this by reversing the relation defition.

Was:

```prisma

model User {
  id                String           @id @default(uuid())
  userPreferencesId UserPreferences?
}

model UserPreferences {
  id           String  @id @default(uuid())
  emailUpdates Boolean
  user         User    @relation(fields: [userId], references: [id])
  userId       String  @unique
}
```

Became:

```prisma
model User {
  id                String           @id @default(uuid())
  userPreferences   UserPreferences? @relation(fields: [userPreferencesId], references: [id])
  userPreferencesId String?          @unique
}

model UserPreferences {
  id           String  @id @default(uuid())
  emailUpdates Boolean
  user         User?
}
```

This way we can simply delete `User` - the related `UserPreferences` records will be deleted as well

```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: "Boris",
      email: "boris@domain.com",
      age: 17,
      userPreferences: {
        create: {
          emailUpdates: true,
        },
      },
    },
    include: { userPreferences: true },
  });
  console.log(user);
}

/* Result
{
  id: 'de1fb6c1-55cd-4e10-b0c9-f762b3a4df3b',
  name: 'Boris',
  age: 17,
  email: 'boris@domain.com',
  role: 'USER',
  preferences: null,
  blob: null,
  userPreferencesId: '7b2293df-bcfa-4189-b491-8238db4e2680',
  userPreferences: { id: '7b2293df-bcfa-4189-b491-8238db4e2680', emailUpdates: true }
}
*/
```

---

Read - example.

We can either use `select` - to select the fields needed or `include` - to add relations to the output

```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "boris@domain.com" },
    // select: {
    //   id: true,
    //   name: true,
    //   email: true,
    // },
    include: { userPreferences: true },
  });

  console.log(user);
}
```

An example for the complex `unique` key (we have `@@unique([name, age])` in `schema.prisma`):

```ts
const user = await prisma.user.findUnique({
  where: {
    name_age: {
      name: "Boris",
      age: 17,
    },
  },
});
```

Filtering and pagination: [video](https://youtu.be/RebA5J-rlwg?t=2629)


`update()` works with the 1st found record while `updateMany()` - with each that passed the filtering

---

### Logging

```ts
const prisma = new PrismaClient({ log: ["query"]});
```