import { getBlocks } from "../../utils/getBlocks";
import { fetchAnswer } from "../../utils/fetchAnswer";
import { attention } from "../../utils/attention";
import { isCorrectData } from "../../utils/isCorrectData";

export const ddwtos = async ({
  sendAddress,
  getAnswer,
  urlParams,
  cmid,
  defaultMaxGrade,
}) => {
  const blocks = getBlocks("ddwtos", "");

  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let question = block.getElementsByClassName("qtext")[0].cloneNode(true);

    const exceptionQuestionElements = question.querySelectorAll(
      "span[class*='place']"
    );

    for (let node of exceptionQuestionElements) {
      node.parentNode.removeChild(node);
    }

    question = question.textContent;

    let requestBody = {
      test_id: cmid,
      question_text: question,
    };

    const data = await fetchAnswer(requestBody, getAnswer);

    if (!isCorrectData(data)) continue;

    const places = block.querySelectorAll(
      "span[class*='place'][class~='active']"
    );

    const answersObject = JSON.parse(data.answers[0].text);

    for (let place of places) {
      const span = place.getElementsByClassName("accesshide")[0];

      span.classList.remove("accesshide");

      const index = Array.from(place.classList).findIndex((el) =>
        el.includes("place")
      );
      span.innerText = answersObject[place.classList[index]];
      span.style.color = "red";
      span.style.fontStyle = "italic";
    }

    attention(data.answers[0].result, defaultMaxGrade, block);
  }
};
