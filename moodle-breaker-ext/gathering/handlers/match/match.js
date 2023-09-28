import { complete } from "./utils/complete";
import { getBlocks } from "../../../utils/getBlocks";

export const match = (config) => {
  const type = "match";

  complete(config, getBlocks(type, "complete"));
};
