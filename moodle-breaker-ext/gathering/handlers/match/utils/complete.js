import { fetchAnswer } from "../../../../utils/fetchAnswer";
import { config } from "../../../../utils/config";

export const complete = async (
  { sendAddress, getAnswer, urlParams, cmid },
  blocks
) => {
  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let currentGrade = block
      .getElementsByClassName("grade")[0]
      .textContent.split(" ")[1];

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let answersObject = {};

    const choices = block.querySelectorAll(".r1,.r0");

    for (let choice of choices) {
      var e = choice.getElementsByClassName("select")[0];
      var text = e.options[e.selectedIndex].text;
      answersObject[choice.getElementsByClassName("text")[0].textContent] =
        text;
    }

    let rightAnswers = [];
    rightAnswers.push({
      text: JSON.stringify(answersObject),
      result: parseFloat(currentGrade),
    });

    let requestBody = {
      test_id: cmid,
      question_text: question,
      answers: rightAnswers,
    };

    await fetchAnswer(requestBody, sendAddress);
  }
};
