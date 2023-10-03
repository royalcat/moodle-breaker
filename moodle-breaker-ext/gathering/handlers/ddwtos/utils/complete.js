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

    let question = block.getElementsByClassName("qtext")[0].cloneNode(true);

    const exceptionQuestionElements = question.querySelectorAll(
      "span[class*='place']"
    );

    for (let node of exceptionQuestionElements) {
      node.parentNode.removeChild(node);
    }

    question = question.textContent;

    let answersObject = {};

    const choices = block.querySelectorAll(
      "span[class*='choice'][class~='placed']"
    );

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
