import http from 'http'
import fs from 'fs'
import { pipeline } from 'stream'
import cows from 'cows'

const PORT: number = Number(process.env.PORT) || 3000

const server = http.createServer((req, res) => {
  console.log(req.url)
  if (req.url === '/') {
    res.writeHead(302, {
      Location: '/hello.html'
    })
  }

  if (req.url === '/hello.html') {
    const rs = fs.createReadStream('./hello.html')
    pipeline(rs, res, (err) => {
      if (err) console.log(err)
      res.end()
    })
    return
  }

  return res.end('Default response')
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(cows());
  console.log('The server is running')
})
