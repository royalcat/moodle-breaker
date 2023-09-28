import { complete } from "./utils/complete";
import { getBlocks } from "../../../utils/getBlocks";

export const ddwtos = (config) => {
  const type = "ddwtos";

  complete(config, getBlocks(type, "complete"));
  complete(config, getBlocks(type, "correct"));
};
