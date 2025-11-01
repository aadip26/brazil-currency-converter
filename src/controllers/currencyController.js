import { fetchQuotes, calculateAverage, calculateSlippage } from "../services/currencyService.js";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 }); // 60 seconds

export const getQuotes = async (req, res) => {
  try {
    let quotes = cache.get("quotes");
    if (!quotes) {
      quotes = await fetchQuotes();
      cache.set("quotes", quotes);
    }
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
};

export const getAverage = async (req, res) => {
  try {
    const quotes = cache.get("quotes") || await fetchQuotes();
    const avg = calculateAverage(quotes);
    res.json(avg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate average" });
  }
};

export const getSlippage = async (req, res) => {
  try {
    const quotes = cache.get("quotes") || await fetchQuotes();
    const avg = calculateAverage(quotes);
    const slip = calculateSlippage(quotes, avg);
    res.json(slip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate slippage" });
  }
};
