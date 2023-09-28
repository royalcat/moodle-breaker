import { fetchAnswer } from "../../../../utils/fetchAnswer";


// нужно добавить на сервер проверку на currentGrade > gradeFromDatabase
// либо фетчить постоянно с клиента, увеличивая нагрузку на сервер :/ 
export const complete = (
  { sendAddress, getAnswer, urlParams, cmid },
  blocks
) => {
  for (let block of blocks) {
    // let bl = questBlocks[block];
    if (typeof block !== "object") continue;

    let currentGrade = block
      .getElementsByClassName("grade")[0]
      .textContent.split(" ")[1];

    if (currentGrade == 0) continue;

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let rightAnswers = [];

    const answer = block.querySelectorAll("input[type=text]")[0].defaultValue;

    rightAnswers.push({ text: answer, result: parseFloat(currentGrade) });

    let requestBody = {
      test_id: cmid,
      question_text: question,
      answers: rightAnswers,
    };
    // fetch(sendAddress, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(requestBody),
    // }).then((response) => console.log(response));

    //sendAnswers(requestBody);
    console.log("short complete", requestBody);
  }
};
