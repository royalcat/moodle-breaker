import { fetchAnswer } from "../../../../utils/fetchAnswer";
import { getFullQuestion } from "./getFullQuestion";

export const complete = async (
  { sendAddress, getAnswer, urlParams, cmid },
  blocks
) => {
  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let currentGrade = block
      .getElementsByClassName("grade")[0]
      .textContent.split(" ")[1];

    let choices = block.querySelectorAll(
      "span[class*='choice'][class~='placed']"
    );

    let question = getFullQuestion(block, choices);

    let answersObject = {};

    let i = 1;
    for (let choice of choices) {
      answersObject[`place${i}`] = choice.innerText;
      i++;
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
