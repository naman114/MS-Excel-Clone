import { Request, Response, Router } from "express";

import bookRouter from "./Book";
import userRouter from "./User";

const router = Router();

router.use("/book", bookRouter);
router.use("/user", userRouter);

router.get("/", (req: Request, res: Response) => {
  res.send("Hello world from api route");
});

export default router;
