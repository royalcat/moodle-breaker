import { complete } from "./utils/complete";
import { getBlocks } from "../../../utils/getBlocks";

export const match = (config) => {
  const type = "match";

  complete(config, getBlocks(type, "partiallycorrect"));
  complete(config, getBlocks(type, "complete"));
  complete(config, getBlocks(type, "correct"));
};
