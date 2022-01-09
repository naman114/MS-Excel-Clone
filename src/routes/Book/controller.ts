import { Request, Response } from "express";
import { schema } from "./schema";

import { BookModel } from "../../models/book.model";

export const handleCreateBook = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);

  if (error) return res.status(500).json({ data: error.details[0].message });

  if (!req.user || !req.user._id || req.user._id != req.body.userId) {
    console.log(req.user._id);
    console.log(req.body.userId);
    res.status(401).json({ err: "Unauthorized" });
  } else {
    const book = new BookModel({
      bookName: req.body.bookName,
      user: req.body.userId,
    });
    const mongoResponse = await book.save();
    return res.json({ status: "ok", data: mongoResponse });
  }
};
