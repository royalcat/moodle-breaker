import { complete } from "./utils/complete";
import { getBlocks } from "../../../utils/getBlocks";

export const truefalse = (config) => {
  const type = "truefalse";

  complete(config, getBlocks(type, "complete"));
};
