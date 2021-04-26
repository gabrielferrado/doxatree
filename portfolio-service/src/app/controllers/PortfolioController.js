import { Router } from "express";
import Portfolio from "../models/Portfolio";
import Locket from "../models/Locket";
import Asset from "../models/Asset";
import PortfolioService from "../services/PortfolioService";

const PortfolioController = Router();

PortfolioController.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolio = await Portfolio.findOne({ owner: userId }).populate({
      path: "lockets",
      populate: {
        path: "assets",
        model: "Asset",
      },
    });

    if (!portfolio) {
      return res.status(418).json({
        statusCode: 418,
        message: "You should not be seeing this error.",
      });
    }

    return res.json({ portfolio: portfolio.toObject({ virtuals: true }) });
  } catch (e) {
    return es.status(500).json({ statusCode: 500, message: e.message });
  }
});

PortfolioController.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const portfolio = await Portfolio.create({
      owner: userId,
    });

    const defaultLocket = await Locket.create({
      name: "Caixa Livre",
      metaPercentage: 1,
      assignedTo: portfolio._id,
    });

    const defaultAsset = await Asset.create({
      name: "Saldo Livre",
      native: false,
      stockPrice: 0,
      metaPercentage: 1,
      concurrency: "USD",
      assignedTo: defaultLocket._id,
    });

    defaultLocket.assets.push(defaultAsset.id);
    portfolio.lockets.push(defaultLocket.id);

    await defaultLocket.save();
    const response = await portfolio.save();

    res.json(response);
  } catch (e) {
    res.status(500).json({ statusCode: 500, message: e.message });
  }
});

PortfolioController.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, concurrency, qty, symbol, price } = req.body;

    const portfolio = await Portfolio.findOne({ owner: userId }).populate({
      path: "lockets",
      populate: {
        path: "assets",
        model: "Asset",
      },
    });

    if (amount) {
      const response = await PortfolioService.updateFreeAmount({
        portfolio,
        amount,
        userId,
        concurrency,
      });
      return res.json(response);
    }

    const hasAsset = portfolio.lockets.some((locket) =>
      locket.assets.find((asset) => asset.name === symbol)
    );

    if (hasAsset) {
      await PortfolioService.performAssetUpdate({
        portfolio,
        symbol,
        userId,
        concurrency,
        qty,
      });

      return res.send();
    }

    if (!price) {
      throw new Error("Missing symbol stock price");
    }

    await PortfolioService.sendToNotListed({
      portfolio,
      symbol,
      price,
      qty,
    });

    return res.send();
  } catch (e) {
    res.status(500).json({ statusCode: 500, message: e.message });
  }
});

export default PortfolioController;
