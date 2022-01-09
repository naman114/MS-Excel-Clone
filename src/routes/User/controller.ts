import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { schema } from "./schema";
import { UserModel } from "../../models/user.model";

export const handleCreateUser = (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);

  if (error) return res.status(500).json({ data: error.details[0].message });

  const hashedPassword = bcrypt.hashSync(req.body.password, 14);
  req.body.password = hashedPassword;

  const user = new UserModel(req.body);
  user.save((err: any) => {
    if (err) {
      let errorToReturn = "Something went wrong. Please try again.";

      if (err.code === 11000) {
        errorToReturn = "That email is already taken, please try another";
      }

      res.status(409).json({ error: errorToReturn });
    }
    res.redirect("/");
  });
};
