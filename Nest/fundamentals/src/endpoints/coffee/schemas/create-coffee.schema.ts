import Joi from 'joi';

export const createCoffeeSchema = Joi.object({
  name: Joi.string().required(),
  brand: Joi.string().required(),
  flavors: Joi.array().items(Joi.string()),
});
