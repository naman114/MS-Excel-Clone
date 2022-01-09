import { Router } from "express";
import { ce } from "../../lib/captureError";
import { handleCreateUser } from "./controller";

const router = Router();

router.post("/", ce(handleCreateUser));

export default router;
