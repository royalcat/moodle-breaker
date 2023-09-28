export const incorrect = (
  { sendAddress, getAnswer, urlParams, cmid },
  blocks
) => {
  for (let block of blocks) {
    // let bl = questBlocks[block];
    if (typeof block !== "object") continue;

    let currentBall = block
      .getElementsByClassName("state")[0]
      .textContent.includes("Верно")
      ? 1
      : 0;
    // let maximumBall = block.getElementsByClassName("grade")[0].textContent.split(" ")[3];

    let question = block.getElementsByClassName("qtext")[0].textContent;

    let rightAnswerBlocks = block.getElementsByClassName("r0 incorrect");
    let rightAnswers = [];
    for (let b of rightAnswerBlocks) {
      rightAnswers.push({ text: b.textContent.slice(2), result: currentBall });
    }
    rightAnswerBlocks = block.getElementsByClassName("r1 incorrect");
    for (let b of rightAnswerBlocks) {
      const restext = b.textContent.slice(2);
      rightAnswers.push({ text: restext, result: currentBall });
    }

    let requestBody = {
      test_id: cmid,
      question_text: question,
      answers: rightAnswers,
    };

    //const data = await fetchAnswer(requestBody,sendAddress);
  }
};
