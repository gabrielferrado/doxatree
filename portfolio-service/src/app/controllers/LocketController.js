import { Router } from "express";
import Locket from "../models/Locket";
import Portfolio from "../models/Portfolio";
import Asset from "../models/Asset";
import { formatFloatResult } from "../../utils";

const LocketController = Router();

LocketController.post("/:portfolioId", async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { name, meta } = req.body;

    const portfolio = await Portfolio.findOne({ _id: portfolioId }).populate(
      "lockets"
    );

    const defaultLocket = portfolio.lockets.find(
      (l) => l.name === "Caixa Livre"
    );

    if (!portfolio) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Portfolio not found" });
    }

    if (defaultLocket.metaPercentage < meta) {
      return res.status(400).json({
        statusCode: 400,
        message: "Cannot create locket, there is not free meta percentage",
      });
    }

    defaultLocket.metaPercentage = formatFloatResult(
      defaultLocket.metaPercentage - meta
    );

    const locket = await Locket.create({
      name,
      metaPercentage: meta,
      assignedTo: portfolioId,
    });

    const defaultAsset = await Asset.create({
      name: "Saldo Livre",
      native: false,
      stockPrice: 0,
      metaPercentage: 1,
      concurrency: "USD",
      assignedTo: locket._id,
    });

    locket.assets.push(defaultAsset._id);
    portfolio.lockets.push(locket._id);

    await locket.save();
    await defaultLocket.save();
    const response = await portfolio.save();

    return res.json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ statusCode: 500, message: e.message });
  }
});

export default LocketController;
