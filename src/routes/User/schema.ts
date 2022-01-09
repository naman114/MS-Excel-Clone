import Joi from "joi";

export const schema = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
});
