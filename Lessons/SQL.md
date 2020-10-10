# MySQL

- [MySQL](#mysql)
	- [Sources](#sources)
	- [Theory](#theory)
		- [Terms](#terms)
		- [Types](#types)
	- [Installation](#installation)
	- [Practice](#practice)
		- [Databases](#databases)
		- [Tables](#tables)

***

## Sources

1. https://medium.com/@rshrc/mysql-on-manjaro-973e4bfc4f05
2. http://gitlab.a-level.com.ua/gitgod/PHP/src/master/ER-SQL.md
3. http://gitlab.a-level.com.ua/gitgod/PHP/src/master/SQL.md
4. http://gitlab.a-level.com.ua/gitgod/PHP/src/master/SQLHomeWork.md
5. https://dev.mysql.com/doc/refman/8.0/en/


***


## Theory 

MySQL is a **relational** (because data is stored in tables that are related to each other) database system. 

***


### Terms

- **data value** - single value
- **record** - a **row** of data values
- **field** - a **column** of data values
- **entity** - a set of meaningful data (row, column, table, etc.)

![](img/2020-10-10-15-44-45.png)

***


### Types

Since databases are intent to store huge amounts of data, there are many types of data that you can use to store just the amount of data you need (and no more!).

Numeric:

Type|Description|Bytes
-|-|-
`TINYINT`|`-128` to `127`|1
`SMALLINT`|`-32768` to `32767`|2
`MEDIUMINT`|`-8388608` to `8388607`|3
`INT`|`-2147483648` to `2147483647`|4
`BIDINT`|`-9223372036854775808` to `9223372036854775807`|8
`FLOAT(p)`|Floating point number, precision: if `p` is 0-24 - the data type is `FLOAT`, if `p` is 25-53 - `DOUBLE`|Differs
`DECIMAL(digits, decimals)` == `NUMERIC`|Stores the exact format, e.g. DECIMAL(5,2) can store values from `-999.99` to `999.99`|Differs



Any of the described types can be **unsigned** if you add the word: `UNSIGNED TINYINT`: 

***



## Installation

For Manjaro:

1. `sudo pacman -S mysql` or `sudo pacman -S mariadb`
2. Pick the 1st option if you are promped to choose.
3. `sudo systemctl start mysqld`
4. If you got an error, type this: `sudo mysql_install_db --user=mysql --basedir=/usr --datadir=/var/lib/mysql`
5. `sudo systemctl start mysqld && sudo mysql_secure_installation`
6. You will be prompted to answer a few questions about whether to delete the default database or leave it be, and some others similar. 
7. Run `sudo mysql`

***



## Practice

### Databases

If you installed everywthing correctly, you can enter the **MySQL console**:

```bash
mysql -u root -p
# Rfgkzrfgkz
```

You will be prompted to enter your password that you confirmed during the installation (when answered questions). 

***

In the MySQL CLI every expression should end with a semicolon `;`

**Keywords** are case-insensitive. In many tutorials they are written in Upper-case.

Create new database and use it:

```sql
/* create new database */
CREATE DATABASE IF NOT EXISTS test;

/* show all databases */
show databases;

/* select a database to not write its name over and over */
use test;
```

![](img/2020-10-10-22-26-23.png)

***


### Tables

Information is stored in tables. **Create new table**:

```sql
CREATE TABLE IF NOT EXISTS person (
	person_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name      VARCHAR(64),
	surname   VARCHAR(64),
	father_name VARCHAR(64)
);
```

***

**Show tables**:

```sql
SHOW TABLES;
```

![](img/2020-10-10-22-28-08.png)

***

Show the table **structure**:

```sql
DESC person;
```

![](img/2020-10-10-22-29-19.png)

***

Show instruction **how to create** such a table:

```sql
SHOW CREATE TABLE person;
```

The result might be different from what we actually used because this is a generated query based on the *actual current* table structure. 

Useful when you want to create a copy of your table on another server (production). 

***

**Add a field**:

```sql
ALTER TABLE person ADD COLUMN date_of_birth DATE AFTER person_id;
```

![](img/2020-10-10-23-14-26.png)

***

**Add index**:

```sql
ALTER TABLE person ADD INDEX (date_of_birth);
```





```bash
npm i mysql2
```
