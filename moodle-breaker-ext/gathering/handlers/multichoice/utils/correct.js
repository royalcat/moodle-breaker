export const correct = ({ sendAddress, getAnswer, urlParams, cmid },blocks) => {

  for (let block of blocks) {
    // let bl = questBlocks[block];
    if (typeof block !== "object") continue;

    let currentBall = block
      .getElementsByClassName("state")[0]
      .textContent.includes("Верно")
      ? 1
      : 0;

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let rightAnswerBlocks = block.getElementsByClassName("r1 correct");
    let rightAnswers = [];
    for (let b of rightAnswerBlocks) {
      const restext = b.textContent.slice(2);
      rightAnswers.push({ text: restext, result: currentBall });
    }
    rightAnswerBlocks = block.getElementsByClassName("r0 correct");
    for (let b of rightAnswerBlocks) {
      const restext = b.textContent.slice(2);
      rightAnswers.push({ text: restext, result: currentBall });
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
    console.log("correct", requestBody);
  }
};
