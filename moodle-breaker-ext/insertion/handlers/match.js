import { getBlocks } from "../../utils/getBlocks";
import { fetchAnswer } from "../../utils/fetchAnswer";

export const match = async ({ sendAddress, getAnswer, urlParams, cmid }) => {
  const blocks = getBlocks("match", "", "notyetanswered");

  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let requestBody = {
      test_id: cmid,
      question_text: question,
    };

    const data = await fetchAnswer(requestBody, sendAddress);

    const answersObject = JSON.parse(data.answers[0]);

    const places = block.querySelectorAll(".r1,.r0");

    for (let place of places) {
        const select = place.getElementsByClassName("select")[0];
        const questionText = place.getElementsByClassName("text")[0].textContent
        
        for(let option in select.options){
            if(option.text == answersObject[questionText])
                option.style.color = "red"
        }
    }
  }
};
