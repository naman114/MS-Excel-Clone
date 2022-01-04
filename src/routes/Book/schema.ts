import Joi from "joi";

export const schema = Joi.object().keys({
  bookName: Joi.string(),
  bookData: Joi.string(),
  userId: Joi.string(),
});
