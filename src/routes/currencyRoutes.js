import express from "express";
import { getQuotes, getAverage, getSlippage } from "../controllers/currencyController.js";

const router = express.Router();

router.get("/quotes", getQuotes);
router.get("/average", getAverage);
router.get("/slippage", getSlippage);

export default router;
