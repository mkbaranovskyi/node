# OS

```javascript
const os = require('os')
```
***


## platform()

```javascript
const os = require('os')
console.log(os.platform())	// linux
```
***


## release()

```javascript
const os = require('os')
console.log(os.release())	// 5.5.19-1-MANJARO
```
***


## arch()

CPU architecture

```javascript
const os = require('os')
console.log(os.arch())	// x64
```
***


## cpus()

Returns an array of objects with info about every CPU Core

```javascript
const os = require('os')
console.log(os.cpus())	// arr of objects
```
***


## freemem()

Free memory in bytes

```javascript
const os = require('os')
console.log(os.freemem())	// 6354751488
```
***


## totalmem()

Total memory in bytes

```javascript
const os = require('os')
console.log(os.totalmem())	// 12529405952
```
***


## homedir()

Home directory

```javascript
const os = require('os')
console.log(os.homedir())	// /home/max
```
***


## uptime()

Time the system is running in seconds

```javascript
const os = require('os')
console.log(os.uptime())	// 16346
```