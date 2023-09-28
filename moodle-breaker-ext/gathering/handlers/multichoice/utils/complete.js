import { fetchAnswer } from "../../../../utils/fetchAnswer";
import { config } from "../../../../utils/config";

export const complete = (
  { sendAddress, getAnswer, urlParams, cmid },
  blocks
) => {
  for (let block of blocks) {
    // let bl = questBlocks[block];
    if (typeof block !== "object") continue;

    let currentGrade = block
      .getElementsByClassName("grade")[0]
      .textContent.split(" ")[1];

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let rightAnswerBlocks = block.getElementsByClassName("r1");
    let rightAnswers = [];
    for (let b of rightAnswerBlocks) {
      if (b.getElementsByTagName("input")[0].checked) {
        const restext = b.textContent.slice(2);
        rightAnswers.push({ text: restext, result: parseFloat(currentGrade) });
      }
    }
    rightAnswerBlocks = block.getElementsByClassName("r0");
    for (let b of rightAnswerBlocks) {
      if (b.getElementsByTagName("input")[0].checked) {
        const restext = b.textContent.slice(2);
        rightAnswers.push({ text: restext, result: parseFloat(currentGrade) });
      }
    }

    let requestBody = {
      test_id: cmid,
      question_text: question,
      answers: rightAnswers,
    };

    // fetch(sendAddress, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(requestBody),
    // }).then();
    //fetchAnswer(requestBody,config.sendAddress,(response) => console.log(response));
    console.log("complete", requestBody);
  }
};
