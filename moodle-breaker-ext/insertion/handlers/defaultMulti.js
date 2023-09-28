import { getBlocks } from "../../utils/getBlocks";

export const multiChoice = async ({
  sendAddress,
  getAnswer,
  urlParams,
  cmid,
}) => {

  const blocks = getBlocks("multichoice", "", "notyetanswered");

  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let requestBody = {
      test_id: cmid,
      question_text: question,
    };

    console.log(requestBody);

    const data = await fetchAnswer(requestBody, getAnswer);
    
    let flag = false;
    let ans = block.getElementsByClassName("r0");
    for (let a of ans) {
      console.log("teg: '" + a.textContent + "'");
      for (let ta of data.answers) {
        console.log("ans: '" + ta.text + "'");
        if (a.textContent.slice(2) === ta.text) {
          console.log("its true");
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
      console.log("teg: '" + a.textContent + "'");
      for (let ta of data.answers) {
        console.log("ans: '" + ta.text + "'");
        if (a.textContent.slice(2) === ta.text) {
          console.log("its true");
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
    console.log(data);
  }
};
