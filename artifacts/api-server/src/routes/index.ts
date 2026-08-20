import { Router, type IRouter } from "express";
import healthRouter from "./health";
import catalogueRouter from "./catalogue";
import adminRouter from "./admin";
import authConfigRouter from "./auth-config";

const router: IRouter = Router();

router.use(healthRouter);
router.use(catalogueRouter);
router.use(adminRouter);
router.use(authConfigRouter);

export default router;
