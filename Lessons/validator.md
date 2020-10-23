# Validation

- [Validation](#validation)
  - [Sources](#sources)
  - [Server](#server)
    - [`validator`](#validator)
    - [`express-validator`](#express-validator)
  - [Client](#client)

***

## Sources

1. https://github.com/validatorjs/validator.js#sanitizers
2. https://express-validator.github.io/docs/

***

## Server

You can use `validator` or `express-validator` (Express wrapper).

Install:

```bash
npm i validator
# or
npm i express-validator
```

***


### `validator`

```js
const validator = require('express-validator')

validator.isEmail('foo@bar.com') // true
```

***


### `express-validator`

Turns the `validator` functions into a **middleware**.

***


## Client

```html
<script src="validator.min.js"></script>
<script>
	validator.isEmail('foo@bar.com') // true
</script>
```
