import { Request, Response, Router } from "express";

import bookRouter from "./Book";

const router = Router();

router.use("/book", bookRouter);

router.get("/", (req: Request, res: Response) => {
  res.send("Hello world from api route");
});

export default router;
