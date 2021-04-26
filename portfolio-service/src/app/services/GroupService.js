import Group from "../models/Group";
import Locket from "../models/Locket";
import { formatFloatResult } from "../../utils";

const find = async () => {
  try {
    return await Group.find({}).populate("lockets");
  } catch (e) {
    throw new Error(e.message);
  }
};

const store = async ({ owner, name, percentage, lockets }) => {
  try {
    const ids = lockets.map(({ id }) => id);
    let pastPercentage = 0;
    let newPercentage = 0;

    const foundLockets = await Locket.find({
      _id: {
        $in: ids,
      },
    });

    if (foundLockets[0].group) return foundLockets;

    const group = await Group.create({
      owner,
      name,
      metaPercentage: percentage,
      lockets: ids,
    });

    const defaultLocket = await Locket.findOne({
      name: "Caixa Livre",
    });

    foundLockets.forEach((locket, index) => {
      pastPercentage += locket.metaPercentage;
      locket.metaPercentage = formatFloatResult(
        lockets[index].meta * percentage
      );
      locket.group = group._id;
      locket.save();
    });

    newPercentage = formatFloatResult(pastPercentage - percentage);
    defaultLocket.metaPercentage = formatFloatResult(
      defaultLocket.metaPercentage + newPercentage
    );

    await defaultLocket.save();

    return foundLockets;
  } catch (e) {
    throw new Error(e.message);
  }
};

const update = () => {};

const remove = () => {};

const GroupService = {
  find,
  store,
  update,
  remove,
};

export default GroupService;
