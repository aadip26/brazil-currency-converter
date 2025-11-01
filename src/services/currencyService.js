import * as cheerio from "cheerio";
import axios from "axios";

// Sources for USD -> BRL (examples)
const sources = [
  "https://wise.com/es/currency-converter/brl-to-usd-rate",
  "https://nubank.com.br/taxas-conversao/",
  "https://www.nomadglobal.com/"
];

// Fetch quotes from all sources. For reliability in this starter project,
// we include fallback/dummy values if scraping fails.
export const fetchQuotes = async () => {
  const results = [];

  // 1) Wise (example scraping)
  try {
    const { data } = await axios.get(sources[0], { timeout: 8000 });
    const $ = cheerio.load(data);
    // NOTE: selectors on remote sites may change. This is a best-effort example.
    // We'll try a few ways to find a numeric rate:
    let rate = null;
    // attempt: meta or text containing "BRL"
    const inputVal = $("input#rate").val();
    if (inputVal) rate = parseFloat(inputVal.replace(/[^0-9\.\,]/g, '').replace(',', '.'));
    if (!rate) {
      const text = $("body").text();
      const match = text.match(/1\s*BRL\s*=\s*([0-9]+[\.,][0-9]+)/);
      if (match) rate = parseFloat(match[1].replace(',', '.'));
    }
    if (!rate) {
      // fallback approximate value
      rate = 5.6;
    }
    results.push({
      buy_price: parseFloat(rate.toFixed(4)),
      sell_price: parseFloat((rate * 1.0025).toFixed(4)),
      source: sources[0]
    });
  } catch (err) {
    console.warn("Wise fetch failed, using fallback.", err.message);
    results.push({ buy_price: 5.6, sell_price: 5.62, source: sources[0] });
  }

  // 2) Nubank (placeholder/dummy scrape)
  try {
    // many banks block scraping; using fallback is common for starter projects
    results.push({ buy_price: 5.58, sell_price: 5.63, source: sources[1] });
  } catch (err) {
    results.push({ buy_price: 5.58, sell_price: 5.63, source: sources[1] });
  }

  // 3) Nomad Global (placeholder)
  try {
    results.push({ buy_price: 5.62, sell_price: 5.66, source: sources[2] });
  } catch (err) {
    results.push({ buy_price: 5.62, sell_price: 5.66, source: sources[2] });
  }

  return results;
};

export const calculateAverage = (quotes) => {
  if (!quotes || quotes.length === 0) return { average_buy_price: 0, average_sell_price: 0 };
  const avgBuy = quotes.reduce((acc, q) => acc + (q.buy_price || 0), 0) / quotes.length;
  const avgSell = quotes.reduce((acc, q) => acc + (q.sell_price || 0), 0) / quotes.length;
  return { average_buy_price: parseFloat(avgBuy.toFixed(4)), average_sell_price: parseFloat(avgSell.toFixed(4)) };
};

export const calculateSlippage = (quotes, average) => {
  return quotes.map(q => ({
    buy_price_slippage: parseFloat((((q.buy_price - average.average_buy_price) / average.average_buy_price) || 0).toFixed(6)),
    sell_price_slippage: parseFloat((((q.sell_price - average.average_sell_price) / average.average_sell_price) || 0).toFixed(6)),
    source: q.source
  }));
};
