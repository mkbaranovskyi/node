const fastify = require('fastify')({ logger: true })
// Plugins should be registered
fastify.register(require('fastify-swagger'), {
	exposeRoute: true,
	routePrefix: '/docs',
	swagger: {
		info: { title: 'fasfity-api' }
	}
})
fastify.register(require('./routes/items'))

const PORT = process.env.PORT || 5000

/* Request */

const http = require('http')
const agent = http.Agent({ keepAlive: true })

/* End Request */

const start = async () => {
	try {
		await fastify.listen(PORT)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
