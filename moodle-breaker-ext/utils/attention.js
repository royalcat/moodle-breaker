export const attention = (currentGrade, maxGrade, block) => {
  if (currentGrade < maxGrade) {
    const text = `<div style="border: 3px solid red;">"Этот ответ c баллом ${currentGrade} из ${maxGrade} ! Будьте внимательны, есть неправильные варианты ответов!</div>`;

    block
      .getElementsByClassName("qtext")[0]
      .insertAdjacentHTML("beforeend", text);
  }
  return;
};
