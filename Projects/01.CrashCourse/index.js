const http = require('http')
const path = require('path')
const fs = require('fs')

const server = http.createServer((req, res) => {
	// Dynamic file path. E.g., user goes to `/about` - we load `about.html`

	// Build the file path
	let filePath = path.join(
		__dirname, 
		'public', 
		req.url === '/' ? 'index.html' : req.url
	)
	
	// Get the extension of file
	const ext = path.extname(filePath)

	// If there's no extension, then add '.html'
	if(ext === ''){
		filePath += '.html'
	}

	// Set the content type
	let contentType = 'text/html'

	switch(ext){
		case '.js': 
			contentType = 'text/javascript'
			break;
		case '.css':
			contentType = 'text/css'
			break
		case '.json': 
			contentType = 'application/json'
			break;
		case '.css':
			contentType = 'text/css'
			break
		case '.png': 
			contentType = 'image/png'
			break;
		case '.jpg':
			contentType = 'image/jpg'
			break
	}

	// Read file
	fs.readFile(filePath, (err, content) => {
		if(err){
			// 404 Not Found
			if(err.code === 'ENOENT'){	
				fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
					res.writeHead(200, { "Content-Type": "text/html" })
					res.end(content, 'utf8')
				})
			} else {
				// Other error
				res.writeHead(500)	
				res.end(`Server error: ${err.code}`)
			}

		} else {
			// No errors
			res.writeHead(200, { "Content-Type": contentType })
			res.end(content, 'utf8')
		}		
	})
})

// Host may run our server on different ports, environment variable is the first place to look for it
const PORT = process.env.PORT || 5000 
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))