import { getBlocks } from "../../utils/getBlocks";
import { fetchAnswer } from "../../utils/fetchAnswer";
import { isCorrectData } from "../../utils/isCorrectData";

export const shortAnswer = async ({
  sendAddress,
  getAnswer,
  urlParams,
  cmid,
}) => {
  const blocks = getBlocks("shortanswer", "" );
  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let requestBody = {
      test_id: cmid,
      question_text: question,
    };

    const data = await fetchAnswer(requestBody, getAnswer);

    if (!isCorrectData(data)) continue;


    const text = `<div style="border: 1px solid red;">  Ответ c баллом ${data.answers[0].result} -  " ${data.answers[0].text} "  </div>`;

    block
      .getElementsByClassName("ablock")[0]
      .insertAdjacentHTML("beforeend", text);
  }
};
