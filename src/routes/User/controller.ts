import { Request, Response } from "express";
import { schema } from "./schema";

import { UserModel } from "../../models/user.model";

export const handleCreateUser = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);

  if (!error) {
    const user = new UserModel({
      email: req.body.email,
      password: req.body.password,
    });
    const mongoResponse = await user.save();
    return res.json({ status: "ok", data: mongoResponse });
  }

  return res.status(500).json({ data: error.details[0].message });
};
