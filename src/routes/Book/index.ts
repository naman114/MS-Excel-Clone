import { Router } from "express";
import { ce } from "../../lib/captureError";
import { handleCreateBook } from "./controller";

const router = Router();

router.post("/", ce(handleCreateBook));

export default router;
