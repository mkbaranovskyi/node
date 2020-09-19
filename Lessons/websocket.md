- [Long Polling](#long-polling)
- [WebSocket](#websocket)

# Long Polling

We send a `request` but **the server doesn't answer right away**. Instead it leaves the `request-response loop` open and answers only when it has some data to respond with. 

client.js:

```javascript
// Sending messages, a simple POST
function PublishForm(form, url) {

	function sendMessage(message) {
		fetch(url, {
			method: 'POST',
			body: message
		});
	}

	form.onsubmit = function () {
		let message = form.message.value;
		if (message) {
			form.message.value = '';
			sendMessage(message);
		}
		return false;
	};
}

// Receiving messages with long polling
function SubscribePane(elem, url) {

	function showMessage(message) {
		let messageElem = document.createElement('div');
		messageElem.append(message);
		elem.append(messageElem);
	}

	async function subscribe() {
		let response = await fetch(url);

		if (response.status == 502) {
			// Connection timeout
			// happens when the connection was pending for too long
			// let's reconnect
			await subscribe();
		} else if (response.status != 200) {
			// Show Error
			showMessage(response.statusText);
			// Reconnect in one second
			await new Promise(resolve => setTimeout(resolve, 1000));
			await subscribe();
		} else {
			// Got message
			let message = await response.text();
			showMessage(message);
			await subscribe();
		}
	}

	subscribe();

}
```

server.js

```javascript
function publish(message) {

	for (let id in subscribers) {
		let res = subscribers[id];
		res.end(message);
	}

	subscribers = Object.create(null);
}

function accept(req, res) {
	let urlParsed = url.parse(req.url, true);

	// new client wants messages
	if (urlParsed.pathname == '/subscribe') {
		onSubscribe(req, res);
		return;
	}

	// sending a message
	if (urlParsed.pathname == '/publish' && req.method == 'POST') {
		// accept POST
		req.setEncoding('utf8');
		let message = '';
		req.on('data', function (chunk) {
			message += chunk;
		}).on('end', function () {
			publish(message); // publish it to everyone
			res.end("ok");
		});

		return;
	}

	// the rest is static
	fileServer.serve(req, res);

}

function close() {
	for (let id in subscribers) {
		let res = subscribers[id];
		res.end();
	}
}

// -----------------------------------

if (!module.parent) {
	http.createServer(accept).listen(8080);
	console.log('Server running on port 8080');
} else {
	exports.accept = accept;

	if (process.send) {
		process.on('message', (msg) => {
			if (msg === 'shutdown') {
				close();
			}
		});
	}

	process.on('SIGINT', close);
}
```

index.html

```html
<!DOCTYPE html>
<script src="browser.js"></script>

All visitors of this page will see messages of each other.

<form name="publish">
	<input type="text" name="message" />
	<input type="submit" value="Send" />
</form>

<div id="subscribe">
</div>

<script>
	new PublishForm(document.forms.publish, 'publish');
	// random url parameter to avoid any caching issues
	new SubscribePane(document.getElementById('subscribe'), 'subscribe?random=' + Math.random());
</script>
```

Long polling works great in situations when messages are rare.

If messages come very often, then the chart of requesting-receiving messages, painted above, becomes saw-like.

Every message is a separate request, supplied with headers, authentication overhead, and so on.

So, in this case, another method is preferred, such as `Websocket` or `Server Sent Events`.

***


# WebSocket

