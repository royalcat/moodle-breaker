import { fetchAnswer } from "../../../../utils/fetchAnswer";

export const complete = async (
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

    let rightAnswers = [];

    const answer = block.querySelectorAll("input[type=text]")[0].defaultValue;

    rightAnswers.push({ text: answer, result: parseFloat(currentGrade) });

    let requestBody = {
      test_id: cmid,
      question_text: question,
      answers: rightAnswers,
    };

    await fetchAnswer(requestBody, sendAddress);
  }
};
