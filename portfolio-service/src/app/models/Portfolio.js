import mongoose from '../../database';
import { formatFloatResult } from '../../utils';

const PortfolioSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  free: {
    type: Number,
    required: true,
    default: 0,
  },
  lockets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Locket',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PortfolioSchema.virtual('netWorth').get(function () {
  const netWorth = this.lockets.reduce(
    (sum, current ) => sum + current.amount,
    0,
  );

  return formatFloatResult(netWorth);
});

PortfolioSchema.virtual('locketsPercentage').get(function () {
  const locketsPercentage = this.lockets.reduce(
    (sum, current ) =>
      sum + current.metaPercentage * current.assets[0].metaPercentage,
    0,
  );

  return formatFloatResult(locketsPercentage);
});

PortfolioSchema.post('save', async function () {
  if (this.lockets.assets) {
    const defaultStockPrice = (
      locket,
      asset,
    ) =>
      formatFloatResult(
        (this.free * locket.metaPercentage * asset.metaPercentage) /
        this.locketsPercentage,
      );

    for (const locket of this.lockets) {
      for (const asset of locket.assets) {
        if (asset.name === 'Saldo Livre') {
          asset.stockPrice = this.free ? defaultStockPrice(locket, asset) : 0;
          asset.qty = 1;
          await asset.save();
        }
      }
    }
  }

  this.updatedAt = Date.now();
});

const Portfolio = mongoose.model(
  'Portfolio',
    PortfolioSchema,
);

export default Portfolio;
