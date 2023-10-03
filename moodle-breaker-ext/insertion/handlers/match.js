import { getBlocks } from "../../utils/getBlocks";
import { fetchAnswer } from "../../utils/fetchAnswer";
import { attention } from "../../utils/attention";
import { isCorrectData } from "../../utils/isCorrectData";

export const match = async ({
  sendAddress,
  getAnswer,
  urlParams,
  cmid,
  defaultMaxGrade,
}) => {
  const blocks = getBlocks("match", "");

  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let requestBody = {
      test_id: cmid,
      question_text: question,
    };

    const data = await fetchAnswer(requestBody, getAnswer);
    
    if (!isCorrectData(data)) continue;

    const answersObject = JSON.parse(data.answers[0].text);

    const places = block.querySelectorAll(".r1,.r0");

    for (let place of places) {
      const select = place.getElementsByClassName("select")[0];
      const questionText = place.getElementsByClassName("text")[0].textContent;

      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].textContent == answersObject[questionText])
          select.options[i].style.color = "red";
      }
    }

    attention(data.answers[0].result, defaultMaxGrade, block);
  }
};
