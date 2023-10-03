export const getFullQuestion = (block, choices) => {
  let question = block.getElementsByClassName("qtext")[0].cloneNode(true);

  const exceptionQuestionElements = question.querySelectorAll(
    "span[class*='place']"
  );

  for (let node of exceptionQuestionElements) {
    node.parentNode.removeChild(node);
  }

  question = question.textContent;

  const preparedChoices = Array.from(choices).map((x) => x.innerText);

  preparedChoices.sort();

  question =
    question + preparedChoices.reduce((acc, element) => acc + element, " ");

  return question;
};
