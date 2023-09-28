import { complete } from "./utils/complete";
import { getBlocks } from "../../../utils/getBlocks";

export const shortanswer = (config) => {
  const type = "shortanswer";

  complete(config, getBlocks(type, "complete"));
};
