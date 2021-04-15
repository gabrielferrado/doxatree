import mongoose from '../../database';
import { formatFloatResult } from '../../utils';

const LocketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  metaPercentage: {
    type: Number,
    required: true,
    default: 0,
    max: 1,
    min: 0,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
  },
  assets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
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

LocketSchema.virtual('amount').get(function () {
  const amount = this.assets.reduce(
    (sum, current) =>
      sum + current.qty * current.stockPrice,
    0,
  );
  return formatFloatResult(amount);
});

LocketSchema.virtual('amountPercentage').get(function () {
  const parent = this.parent();

  return formatFloatResult(this.amount / parent.netWorth);
});

LocketSchema.virtual('meta').get(function () {
  const parent = this.parent();

  return formatFloatResult(parent.netWorth * this.metaPercentage);
});

LocketSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

const Locket = mongoose.model('Locket', LocketSchema);
export default Locket;
