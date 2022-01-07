import { Request, Response } from "express";
import { schema } from "./schema";

import { UserModel } from "../../models/user.model";

export const handleCreateUser = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);

  if (error) return res.status(500).json({ data: error.details[0].message });

  const user = new UserModel(req.body);
  await user.save((err: any) => {
    if (err) {
      let errorToReturn = "Something went wrong. Please try again.";

      if (err.code === 11000) {
        errorToReturn = "That email is already taken, please try another";
      }

      return res.status(409).json({ error: errorToReturn });
    }
    return res.json({ status: "ok" });
  });
};
