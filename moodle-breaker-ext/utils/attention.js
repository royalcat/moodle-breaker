export const attention = (currentGrade, maxGrade, block) => {
  if (currentGrade < maxGrade) {
    const divStyle = `style="border: 3px solid red;
    padding:1em;
    position:relative;
    display: flex;
    align-items: center;
    `;

    const btnStyle = `
    style ="position:absolute;right:0;margin-right:1em"
    `;

    const text = `<div ${divStyle}">
    Этот ответ c баллом ${currentGrade} из ${maxGrade} ! Будьте внимательны, есть неправильные варианты ответов!
    <button class="closeAttentionBtn" ${btnStyle}>Закрыть</button>
    </div>`;

    block
      .getElementsByClassName("qtext")[0]
      .insertAdjacentHTML("beforeend", text);

    let btns = block.getElementsByClassName("closeAttentionBtn");

    for (let btn of btns) {
      btn.addEventListener("click", (event) => {
        event.target.parentNode.remove();
      });
    }
  }
  return;
};
