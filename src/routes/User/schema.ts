import Joi from "joi";

export const schema = Joi.object().keys({
  email: Joi.string(),
  password: Joi.string(),
});
