import mongoose from '../../database';
import { formatFloatResult } from '../../utils';
import Locket  from './Locket';

export const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  native: {
    type: Boolean,
    required: true,
  },
  stockPrice: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
    required: true,
  },
  metaPercentage: {
    type: Number,
    required: true,
    default: 1,
    max: 1,
    min: 0,
  },
  concurrency: {
    type: String,
    enum: ['BRL', 'USD'],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Locket',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


AssetSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

AssetSchema.virtual('meta').get(function () {
  const locket = this.parent();
  const portfolio = locket.parent();

  const test = portfolio.lockets.find(
    (l) => l.id === this.assignedTo.toString(),
  );

  return formatFloatResult(this.metaPercentage * test.meta);
});

AssetSchema.virtual('amount').get(function () {
  return formatFloatResult(this.qty * this.stockPrice);
});

AssetSchema.virtual('amountPercentage').get(function () {
  const locket = this.parent();
  const portfolio = locket.parent();

  const test = portfolio.lockets.find(
    (l) => l.id === this.assignedTo.toString(),
  );

  return formatFloatResult(this.amount / test.amount);
});

const Asset = mongoose.model('Asset', AssetSchema);
export default Asset;
