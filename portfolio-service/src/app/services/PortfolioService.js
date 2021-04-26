import log from "log-to-file";
import { formatFloatResult } from "../../utils";
import Asset from "../models/Asset";
import Locket from "../models/Locket";

const performAssetUpdate = async ({
  portfolio,
  symbol,
  userId,
  concurrency,
  qty,
}) => {
  const data = {
    symbol,
    qty: 0,
    percentage: 0,
    assets: [],
  };

  for (const locket of portfolio.lockets) {
    for (const asset of locket.assets) {
      if (asset.name === symbol) {
        data.qty += asset.qty;
        data.percentage += formatFloatResult(
          asset.metaPercentage * locket.metaPercentage
        );
        data.assets.push({
          id: asset.id,
          percentage: formatFloatResult(
            asset.metaPercentage * locket.metaPercentage
          ),
        });
      }
    }
  }

  for (const asset of data.assets) {
    if (asset.percentage) {
      // eslint-disable-next-line no-await-in-loop
      await Asset.findByIdAndUpdate(asset.id, {
        qty: formatFloatResult(
          ((data.qty + qty) * asset.percentage) / data.percentage
        ),
      });
    } else {
      // eslint-disable-next-line no-await-in-loop
      await Asset.findByIdAndUpdate(asset.id, {
        qty: data.qty + qty,
      });
    }
  }

  return log(
    JSON.stringify({
      user: userId,
      concurrency,
      portfolio: portfolio._id,
      qty,
      symbol,
      data,
    })
  );
};

const updateFreeAmount = async ({ portfolio, amount, userId, concurrency }) => {
  portfolio.free += amount;

  const response = await portfolio.save();

  log(
    JSON.stringify({
      user: userId,
      amount,
      concurrency,
      portfolio: portfolio._id,
    })
  );
  return response;
};

const sendToNotListed = async ({ portfolio, symbol, price, qty }) => {
  const foundLocket = portfolio.lockets.find(
    (locket) => locket.name === "Não listados"
  );

  if (foundLocket) {
    const notListedLocket = await Locket.findOne({ _id: foundLocket.id });

    const defaultAsset = await Asset.create({
      name: symbol,
      native: false,
      stockPrice: price,
      metaPercentage: 0,
      concurrency: "USD",
      qty,
      assignedTo: notListedLocket._id,
    });

    notListedLocket.assets.push(defaultAsset.id);
    portfolio.lockets.push(notListedLocket.id);

    await notListedLocket.save();
    await portfolio.save();

    return;
  }

  const notListedLocket = await Locket.create({
    name: "Não listados",
    metaPercentage: 0,
    assignedTo: portfolio._id,
  });

  const defaultAsset = await Asset.create({
    name: symbol,
    native: false,
    stockPrice: price,
    metaPercentage: 0,
    concurrency: "USD",
    qty,
    assignedTo: notListedLocket._id,
  });

  notListedLocket.assets.push(defaultAsset.id);
  portfolio.lockets.push(notListedLocket.id);

  await notListedLocket.save();
  await portfolio.save();
};

const PortfolioService = {
  performAssetUpdate,
  updateFreeAmount,
  sendToNotListed,
};

export default PortfolioService;
