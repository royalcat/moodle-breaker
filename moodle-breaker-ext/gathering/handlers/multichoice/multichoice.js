import { complete } from "./utils/complete";
import { correct } from "./utils/correct";
import { incorrect } from "./utils/incorrect";
import { getBlocks } from "../../../utils/getBlocks";

export const multichoice = (config) => {
  const type = "multichoice";

  complete(config, getBlocks(type, "complete"));
  correct(config, getBlocks(type, " correct"));
  incorrect(config, getBlocks(type, "incorrect"));
};
