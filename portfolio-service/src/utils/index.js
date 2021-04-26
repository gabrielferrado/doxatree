import Locket from "../app/models/Locket";
import Asset from "../app/models/Asset";

const formatFloatResult = (op) => parseFloat(op.toFixed(6));

const checkLocketAndAssetExistence = async (locketId, assetId) => {
  const locket = await Locket.findOne({ _id: locketId }).populate("assets");

  if (!locket) {
    throw new Error("Locket not found");
  }

  const asset = await Asset.findOne({ _id: assetId });

  if (!asset) {
    throw new Error("Asset not found");
  }

  return { locket, asset };
};

export { formatFloatResult, checkLocketAndAssetExistence };
