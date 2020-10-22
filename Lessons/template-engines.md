# Template Engines

Allow you serve kinda enhanced HTML with variables in the template that replace the actual values.

To render template files, set the following app setting properties:

```javascript
// the directory where the template files are located, defaults to `./views`
app.set('views', './views')
// the template engine
app.set('view engine', 'pug')

// short version
app.get('/simple', (req, res, next) => {
	res.render('index')
})

// full version
app.get('/', (req, res, next) => {
	/**
	 * @param {string || path} - Path to the template page
	 * @param {object} - Object with variables for the template page
	 * @param {function} - (err, html: string) callback, you can change something before sending the string with the html to the client to be rendered. If you specify this argument, you must explicitly invoke `res.send(html)`
	 */
	res.render(
		'index',
		{
			title: 'Hey',
			message: 'Hello there!',
			articles
		},
		(err, html) => {
			if (err) {
				next(err)
			}
			res.send(html)
		}
	)
})
```

---

## Pug

https://gist.github.com/neretin-trike/53aff5afb76153f050c958b82abd9228

A popular veiw engine. **PUG files should be hoooked up as static html files**.

Optional `pug-cli` is a compiler that can generate `html` from `pug` on the fly. Use `pug -w . -o ./public/html -P` to run it.

```
npm i pug
npm i pug-cli -g
```

Each line begins with html tag by default. If you want **plain text**, use `|`:

```pug
//- Here `Max` is interpreted as html tag. We don't want this
Max is cool

//- Here everything is fine
| Max is cool
```

**Comments**:

`//` - will appear in the rendered HTML.

`//-` - won't appear in the rendered HTML.

Multi-line comments:

```pug
//-
	My navbar
	This is awesome!
```

**String literals**: `#{}` or as the usual JS strings in the backticks.

**Nesting** is done using indentation.

**Attributes** are written in the brackets as regular HTML attributes. Or you can insert them via `&attributes(myObjWithAttrs)`

**JS code** :

`-` for single line

```pug
//- for multiline (no space after -)
-
	const user = {
		name: 'max',
		age: 20
	}
```

Single line **JS expressions** are inserted like ES6 multiline strings (with backticks): \`\${1 < 3 ? 'ok' : 'ne ok'>}\`

**Variables** from JS: `div= myVarName` (myVarName is send from the JS during

```javascript
res.render('index', {
	myVarName: 'yo'
})
```

**include** and **extend** - extend your pages with template inserts.

```pug
//- Insert the completed (inside itself) code
include path/to/file

//- Insert the outer (surrounding) code and extend it
extends template
block blockName
```

**If** works just as in JS:

```pug
- const user = {name: 'max', age: 20, loggedIn: true}
p
	if user.age > 18 && user.loggedIn == true
		| Welcome,
		strong #{user.name}

```

**Loops**: basically `forEach`, `each` === `for`

```pug
for item in arr
	li= item
```

You can add the second variable with an index:

```pug
each item, index in ['apple', 'orange', 'grape', 'banana']
	p= `[${index}: ${item}]`
```

**else** can be used as a fallback for loops (doesn't catch actual errors):

```pug
each item, index in []
	p= `[${index}: ${item}]`
else
	strong No values to loop over!
```

**case** - basically JS `switch`:

```pug
//- orderStatus => 'Pending' || 'In_transit' || 'Completed'
- const orderStatus = 'Pending'

case orderStatus
	when 'Pending'
		p Your order has been placed and will be sent shortly.
	when 'In_Transit'
		p Your order is on the move - you should receive it soon!
	when 'Completed'
		p You order has been completed.
	default
		p Sorry, we aren't sure what happened with your order.
```

**Mixins** work like `functions`.

```pug
mixin comment(commentData)
	//- If we just put a classname, it will append it to a `div`
	.comment
		if commentData.postedByAdmin
			em (by Admin)
		.date= commentData.date
		.author= commentData.author
		.message= commentData.message

- const data = {postedByAdmin: true, date: Date.now().toLocaleTimeString(), author: 'max', message: 'Hey there!'}

+comment(data)
```

**CSS** can be applied (the `dot` at the end of an element enables multiline code)

```pug
style. {
	.class1
		color: red
}
```

**id**, **classes**: `div#main`, `p.paragraph`

```pug
- const classes = ['class1', 'class2']

//- the class attribute may also be repeated to merge arrays
a.bang(class=classes class=['bing'])
```

---

Full example:

````pug
//- layout.pug - template page
doctype html
html(lang='en')
	head
		title= title
		//- `block css` will insert css specific for each page
		block css

	body
		//- `block content`
		block content
	br
	hr
	footer
		p Copyright &copy; 2020


//- index.pug - index page, should start with extending a block as the rest will be taken from the template
extends layout

//- mixin == function, reusable code
mixin comment(commentData)
	//- If we just put a classname, it will append it to a `div`
	.comment
		if commentData.postedByAdmin
			em (by Admin)
		.date= commentData.date
		.author= commentData.author
		.message= commentData.message

block css
	link(rel="stylesheet", href="css/style.css")

	//- dot at the end!
	style.
		.comment {
			font-family: sans-serif;
			line-height: 1.5;
			padding: 10px;
			border: 1px solid #555;
			width: 250px;
		}

		.date {
			font-size: 85%;
			text-align: right;
		}

		.author {
			font-size: 110%;
			font-weight: bold;
		}

block content
	//- include
	include includes/nav

	//- loops
	ul
		for item, index in articles
			li= item.author

	- const pStyles = {"text-align": "center", "text-transform": "uppercase"}
	p(style= pStyles) This is paragraph

	each item, index in ['apple', 'orange', 'grape', 'banana']
		p= `[${index}: ${item}]`

	each item, index in []
		p= `[${index}: ${item}]`
	else
		strong No values to loop over!

	//- if
	- const user = {name: 'max', age: 20, loggedIn: false}
	p
		if user.age >= 18 && user.loggedIn
			| Welcome back,
			strong #{user.name}
		else if user.age >= 18
			a(href="register") Register
		else
			a(href="login") Log in


	//- Switch
	//- orderStatus => 'Pending' || 'In_transit' || 'Completed'
	- const orderStatus = 'In_Transit'

	case orderStatus
		when 'Pending'
			p Your order has been placed and will be sent shortly.
		when 'In_Transit'
			p Your order is on the move - you should receive it soon!
		when 'Completed'
			p You order has been completed
		default
			p Sorry, we aren't sure what happened with your order.


	//- Using mixins
	- const data1 = {postedByAdmin: true, date: (new Date()).toLocaleTimeString(), author: 'max', message: 'Hey there!'}

	+comment(data1)

	- const data2 = {date: (new Date()).toLocaleTimeString(), author: 'masha', message: 'Hi!'}

	+comment(data2)
````
