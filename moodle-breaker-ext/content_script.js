import {
  multiChoice as insert_multiChoice,
  shortAnswer as insert_shortAnswer,
  trueFalse as insert_trueFalse,
  ddwtos as insert_ddwtos,
  match as insert_match,
} from "./insertion/index";
import {
  multichoice as gather_multichoice,
  truefalse as gather_truefalse,
  shortanswer as gather_shortanswer,
  ddwtos as gather_ddwtos,
  match as gather_match,
} from "./gathering/handlers/index";
import { config } from "./utils/config";

const sss = window.location.pathname.split("/");

if (sss[sss.length - 1] === "review.php") {
  gather_multichoice(config);
  gather_truefalse(config);
  gather_shortanswer(config);
  gather_ddwtos(config);
  gather_match(config);
}

if (sss[sss.length - 1] === "attempt.php") {
  insert_multiChoice(config);
  insert_shortAnswer(config);
  insert_trueFalse(config);
  insert_ddwtos(config);
  insert_match(config);
}

/*TODO :


*/
