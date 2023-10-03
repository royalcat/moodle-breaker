import { getBlocks } from "../../utils/getBlocks";
import { fetchAnswer } from "../../utils/fetchAnswer";
import { attention } from "../../utils/attention";
import { isCorrectData } from "../../utils/isCorrectData";

export const trueFalse = async ({
  sendAddress,
  getAnswer,
  urlParams,
  cmid,
  defaultMaxGrade,
}) => {
  const blocks = getBlocks("truefalse", "");

  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let requestBody = {
      test_id: cmid,
      question_text: question,
    };

    const data = await fetchAnswer(requestBody, getAnswer);

    if (!isCorrectData(data)) continue;

    let flag = false;
    let ans = block.getElementsByClassName("r0");
    for (let a of ans) {
      for (let ta of data.answers) {
        if (a.textContent == ta.text) {
          a.style.backgroundColor = "#ff6505";
          if (ta.result != 1 && !flag) {
            document.getElementsByClassName("info")[0].outerHTML +=
              '<div style="background-color: #ff6505; margin: 10px; padding: 10px;">Внимание! Ответы на балл: ' +
              ta.result +
              "</div>";
            flag = true;
          }
        }
      }
    }

    ans = block.getElementsByClassName("r1");
    for (let a of ans) {
      for (let ta of data.answers) {
        if (a.textContent == ta.text) {
          a.style.backgroundColor = "#ff6505";
          if (ta.result != 1 && !flag) {
            document.getElementsByClassName("info")[0].outerHTML +=
              '<div style="background-color: #ff6505; margin: 10px; padding: 10px;">Внимание! Ответы на балл: ' +
              ta.result +
              "</div>";
            flag = true;
          }
        }
      }
    }

    attention(data.answers[0].result, defaultMaxGrade, block);
  }
};
