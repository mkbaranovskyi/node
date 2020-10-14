# `mysql2`

- [`mysql2`](#mysql2)
	- [Sources](#sources)
	- [Install & Run](#install--run)
		- [`mysql.`**`createConnection`**` (options)`](#mysqlcreateconnection-options)
		- [`connection.`**`connect`**` (err => {})`](#connectionconnect-err--)
		- [`connection.`**`end`**` (err => {})`](#connectionend-err--)
		- [`connection.`**`destroy`**` ()`](#connectiondestroy-)
		- [Promisification](#promisification)
	- [Methods](#methods)
		- [`connection.`**`query`**` (sqlString, (err, results, metadata) => {})`](#connectionquery-sqlstring-err-results-metadata--)
		- [`connection.`**`execute`**` (sqlString, (err, results, metadata) => {})`](#connectionexecute-sqlstring-err-results-metadata--)
		- [Prepared Statements](#prepared-statements)

***

## Sources

1. https://www.npmjs.com/package/mysql2#using-prepared-statements - `mysql2` readme page
2. https://stackoverflow.com/questions/8263371/how-can-prepared-statements-protect-from-sql-injection-attacks - why useing params helps vs `SQL-injection`
3. https://github.com/sidorares/node-mysql2/issues/382 - `query` and `execute`
4. https://github.com/sidorares/node-mysql2/blob/master/documentation/Prepared-Statements.md - `prepare`
5. https://github.com/sidorares/node-mysql2/issues/742 - `execute`


***


## Install & Run

```bash
npm i mysql2
```

```js
const mysql = require('mysql2')
```

***

### `mysql.`**`createConnection`**` (options)`

Returns the `connection` object. Other options are available as well.

```js
const connection = mysql
	.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'test',	/* Don't set this if you're going to create DB */
		password: 'Rfgkzrfgkz'
	})
```

***

### `connection.`**`connect`**` (err => {})`

The usage is optional as `query()` and `execute()` both establish connection themselves.

```js
connection.connect((err) => {
	if (err) {
		return console.error(err)
	}
	console.log('Connected to the MySQL server successfully')
})
```

***

### `connection.`**`end`**` (err => {})`

Regular connection closing (will let the DB finish tasks in the queue).

```js
connection.end((err) => {
	if (err) {
		return console.error(err)
	}
	console.log('Connected to the MySQL server closed.')
})
```

### `connection.`**`destroy`**` ()`

Kill the connection immediately.

```js
connection.destroy()
```

***

### Promisification

Calling `promise()` zpromisifies the `connection` making it return `Promise`. This way you can get rid of callbacks.

```js
const connection = mysql
	.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'test',
		password: 'Rfgkzrfgkz'
	})
	.promise()			// <--- Promisify

const sql =
	'INSERT INTO person (date_of_birth, name, surname, father_name) values (?, ?, ?, ?)'
const user = ['2000-00-01', 'Alice', 'Warner', 'Jack']

connection
	.query(sql, user)	// <--- No callback anymore, it doesn't work
	.then((results) => console.log(results))
	.catch((err) => console.error(err))
```

**Further we assume it is always used**.

***


## Methods

### `connection.`**`query`**` (sqlString, (err, results, metadata) => {})`
### `connection.`**`execute`**` (sqlString, (err, results, metadata) => {})`

Both send query to the server but with a subtle difference that will be explained further.

```js
connection.execute(
	'INSERT INTO test SET firstname = ?, lastname = ?', 
	['max', 'bar'])
.catch(err => console.error(err))
```

Both also set the connection so you can do without `connect()`. 

***

What's the difference between the two? See the next chapter.

***

### Prepared Statements

If you insert your query string at once, you become vulnurable to the **SQL-injection attack**. 

The better practice is to use **prepated statements** and insert **parameters** via the question marks **`?`**. This can help against sql-injections by **separating code and data**.

***

`query()` inserts paratemets on the **client side** and sends everything to the server.

```js
driver -> server: query "INSERT INTO documents SET name='john'" 
server => driver: ok, insertId, ...

driver -> server: query "INSERT INTO documents SET name='smith'" 
server => driver: ok, insertId, ...
```

`execute()` is a wrapper for `prepare() + query()` which prepares the statement first and **caches** it. Then executes it. Subsequent calls to the same query will reuse the same prepared query which **increases performance**. Parameters are sent **separetely** and  inserted into the query **on the server**.

With prepared statement each placeholder must map `1:1` to input parameter

```js
driver -> server: prepare "INSERT INTO documents SET name=?"
server -> driver: statement id = 1

driver -> server:   execute 1, parameters: 'john'
server -> driver: ok, insertId, ...

// cached
driver->server: execute 1, parameters: 'smith'
server -> driver: ok, insertId, ...
```

***

**Execute** - single record:

```js
const users = ['2000-01-01', 'Alice', 'Kravich']
const sql = 'INSERT INTO test(date_of_birth, name, surname) VALUES (?,?,?)'

connection
	.execute(sql, users)
	.then((result) => console.log(result))
	.catch((err) => console.error(err))
```

**Execute** - multiple records - impossible to achieve since it's impossible to `prepare` multiple records to be inserted (MySQL limitation).

**Query** - single record:

```js
// option 1
const users = ['2000-01-01', 'Alice', 'Kravich']
const sql = 'INSERT INTO test(date_of_birth, name, surname) VALUES (?, ?, ?)'
// option 2
const users = [['2000-01-01', 'Alice', 'Kravich']]
const sql = 'INSERT INTO test(date_of_birth, name, surname) VALUES (?)'

connection
	.execute(sql, users)
	.then((result) => console.log(result))
	.catch((err) => console.error(err))
```

**Query** - multiple records:

```js
const users = [
	[
		['2001-01-01', 'Bob', 'Marley'],
		['2001-01-01', 'Alice', 'surname'],
		['2001-01-01', 'Kate', 'surname2']
	]
]
const sql = 'INSERT INTO test(date_of_birth, name, surname) VALUES ?'

connection
	.query(sql, users)
	.then((result) => console.log(result))
	.catch((err) => console.error(err))
```

**Don't ever build your SQL statements with simple string concatenation!** 

***




