import { Request, Response } from "express";
import { schema } from "./schema";

import { BookModel } from "../../models/book.model";

export const handleCreateBook = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);

  if (!error) {
    const book = new BookModel({
      bookName: req.body.bookName,
      bookData: req.body.bookData,
      user: req.body.userId,
    });
    const mongoResponse = await book.save();
    return res.json({ status: "ok", data: mongoResponse });
  }

  return res.status(500).json({ data: error.details[0].message });
};
