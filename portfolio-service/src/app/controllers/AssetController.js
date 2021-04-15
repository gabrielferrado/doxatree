import { Router } from 'express';
import Locket from "../models/Locket";
import Asset from "../models/Asset";
import {formatFloatResult} from "../../utils";
export const AssetController = Router();

const checkExistence = async (locketId, assetId) => {
  const locket = await Locket.findOne({ _id: locketId }).populate('assets');

  if (!locket) {
    throw new Error('Locket not found');
  }

  const asset = await Asset.findOne({ _id: assetId });

  if (!asset) {
    throw new Error('Asset not found');
  }

  return { locket, asset };
};

AssetController.get('/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;

    const asset = await Asset.findOne({ _id: assetId });
    return res.json({ asset });
  } catch (e) {
    return res
      .status(404)
      .json({ statusCode: 404, message: 'Asset not found' });
  }
});

AssetController.post('/:locketId', async (req, res) => {
  try {
    const { locketId } = req.params;
    const { name, native, price, concurrency, percentage, qty } = req.body;

    const locket = await Locket.findOne({ _id: locketId }).populate('assets');

    if (!locket) {
      return res
        .status(404)
        .json({ statusCode: 404, message: 'Locket not found' });
    }

    const free = locket.assets.find((asset) => asset.name === 'Saldo Livre');

    if (free.metaPercentage && percentage <= free.metaPercentage) {
      const defaultAsset = await Asset.findOne({ _id: free._id });
      const asset = await Asset.create({
        name,
        native,
        stockPrice: price,
        qty,
        metaPercentage: percentage || 0,
        concurrency,
        assignedTo: locket._id,
      });

      await locket.update({
        $push: {
          assets: asset._id,
        },
      });

      defaultAsset.metaPercentage = formatFloatResult(
        defaultAsset.metaPercentage - percentage,
      );

      await defaultAsset.save();

      return res.json({ asset });
    }

    return res.status(400).json({
      statusCode: 400,
      message: "Can't create asset, check if percentage is available",
    });
  } catch (e) {
    res.status(500).json({ statusCode: 500, message: e.message });
  }
});

AssetController.put(
  '/:locketId/:assetId',
  async (req, res) => {
    try {
      const { locketId, assetId } = req.params;
      const { qty } = req.body;

      const { asset } = await checkExistence(locketId, assetId);

      asset.qty += qty;

      // const free = locket.assets.find((el) => el.name === 'Saldo Livre');
      //
      // const defaultAsset = await Asset.findOne({ _id: free._id });
      //
      // if (percentage > asset.amountPercentage) {
      //   if (
      //     percentage <=
      //     defaultAsset.amountPercentage + asset.amountPercentage
      //   ) {
      //     defaultAsset.amountPercentage = formatFloatResult(
      //       defaultAsset.amountPercentage - percentage,
      //     );
      //     asset.amountPercentage = percentage;
      //
      //     const updatedAsset = await asset.save();
      //     await defaultAsset.save();
      //     await locket.save();
      //
      //     return res.json(updatedAsset);
      //   }
      //
      //   return res.status(400).json({
      //     statusCode: 400,
      //     message: "Can't update asset, check if percentage is available",
      //   });
      // }
      //
      // defaultAsset.amountPercentage = formatFloatResult(
      //   defaultAsset.amountPercentage + asset.amountPercentage - percentage,
      // );
      // asset.amountPercentage = percentage;
      //
      // const response = await asset.save();
      const response = await asset.save();
      // await locket.save();

      return res.json(response);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        statusCode: 500,
        message: e.message,
      });
    }
  },
);

AssetController.delete(
  '/:locketId/:assetId',
  async (req, res) => {
    try {
      const { locketId, assetId } = req.params;

      const { locket, asset } = await checkExistence(locketId, assetId);

      const free = locket.assets.find((el) => el.name === 'Saldo Livre');

      const defaultAsset = await Asset.findOne({ _id: free._id });

      defaultAsset.metaPercentage =
        defaultAsset.metaPercentage + asset.metaPercentage;

      await defaultAsset.save();
      await asset.delete();

      return res.send();
    } catch (e) {
      return res.status(500).json({
        statusCode: 500,
        message: e.message,
      });
    }
  },
);
