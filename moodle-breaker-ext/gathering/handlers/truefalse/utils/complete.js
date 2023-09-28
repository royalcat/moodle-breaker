export const complete = (
  { sendAddress, getAnswer, urlParams, cmid },
  blocks
) => {
  for (let block of blocks) {
    if (typeof block !== "object") continue;

    let currentGrade = block
      .getElementsByClassName("grade")[0]
      .textContent.split(" ")[1];

    let question = block.getElementsByClassName("qtext")[0].textContent;

    const firstAns = block.getElementsByClassName("r0")[0];
    const secondAns = block.getElementsByClassName("r1")[0];
    let rightAnswers = [];

    if (firstAns.getElementsByTagName("input")[0].checked) {
      rightAnswers.push({
        text: firstAns.textContent,
        result: parseFloat(currentGrade),
      });
    } else {
      rightAnswers.push({
        text: secondAns.textContent,
        result: parseFloat(currentGrade),
      });
    }

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
  }
};
