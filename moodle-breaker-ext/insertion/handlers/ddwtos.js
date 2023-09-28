import { getBlocks } from "../../utils/getBlocks";
import { fetchAnswer } from "../../utils/fetchAnswer";

export const ddwtos = async ({ sendAddress, getAnswer, urlParams, cmid }) => {
  const blocks = getBlocks("ddwtos", "", "notyetanswered");

  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let requestBody = {
      test_id: cmid,
      question_text: question,
    };

    const data = await fetchAnswer(requestBody, sendAddress);

    const places = block.querySelectorAll(
      "span[class*='place'][class~='active']"
    );

    const answersObject = JSON.parse(data.answers[0]);

    for (let place of places) {
      const span = place.getElementsByClassName("accessHide")[0];
      span.classList.remove("accesshide");

      const index = Array.from(place.classList).findIndex((el) =>
        el.includes("place")
      );
      span.innerText = answersObject[place.classList[index]];
      span.style.color = "red";
      span.style.fontWeight = "bold";
    }
  }
};
