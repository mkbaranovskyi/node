const { getItems, getItem, addItem, deleteItem, updateItem } = require('../controllers/items')

function itemRoutes(fastify, options, done){
  // interface for items
  const Item = {
    type: 'object',
    properties: {
      // Try commenting out the line below - this field will be excluded from the output
      id: { type: 'string' },
      name: { type: 'string' }
    }
  }

  // Options for get all items - paste it as a 2nd argument to the route
  const getItemsOptions = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: Item
        }
      }
    },
    handler: getItems
  }

  const getItemOptions = {
    schema: {
      response: {
        200: Item
      }
    },
    handler: getItem
  }

  const postItemOptions = {
    schema: {
      // Mandatory fields - optional parameter
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' }
        }
      },
      // Response
      response: {
        201: Item
      }
    },
    handler: addItem
  }

  const deleteItemOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    handler: deleteItem
  }

  const updateItemOptions = {
    schema: {
      response: {
        200: Item
      }
    },
    handler: updateItem
  }

  fastify.get('/items', getItemsOptions)
  fastify.get('/items/:id', getItemOptions)
  fastify.post('/items', postItemOptions)
  fastify.delete('/items/:id', deleteItemOptions)
  fastify.patch('/items/:id', updateItemOptions)

  done()
}

module.exports = itemRoutes