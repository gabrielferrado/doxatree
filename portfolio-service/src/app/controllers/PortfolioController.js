import { Router } from 'express';
import Portfolio from '../models/Portfolio';
import Locket from '../models/Locket';
import Asset from '../models/Asset';
export const PortfolioController = Router();

PortfolioController.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolio = await Portfolio.findOne({ owner: userId }).populate({
      path: 'lockets',
      populate: {
        path: 'assets',
        model: 'Asset',
      },
    });

    if (!portfolio) {
      return res.status(418).json({
        statusCode: 418,
        message: 'You should not be seeing this error.',
      });
    }

    return res.json({ portfolio: portfolio.toObject({ virtuals: true }) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ statusCode: 500, message: e.message });
  }
});

PortfolioController.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const portfolio = await Portfolio.create({
      owner: userId,
    });

    const defaultLocket = await Locket.create({
      name: 'Caixa Livre',
      metaPercentage: 1,
      assignedTo: portfolio._id,
    });

    const defaultAsset = await Asset.create({
      name: 'Saldo Livre',
      native: false,
      stockPrice: 0,
      metaPercentage: 1,
      concurrency: 'USD',
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

PortfolioController.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;
    const portfolio = await Portfolio.findOne({ owner: userId }).populate({
      path: 'lockets',
      populate: {
        path: 'assets',
        model: 'Asset',
      },
    });

    portfolio.free += amount;

    const response = await portfolio.save();

    res.json(response);
  } catch (e) {
    res.status(500).json({ statusCode: 500, message: e.message });
  }
});
