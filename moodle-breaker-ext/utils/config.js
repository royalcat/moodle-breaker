export const config = {
  sendAddress: "https://moodle-breaker.kmsign.ru/addQuestionResult",
  getAnswer: "https://moodle-breaker.kmsign.ru/getQuestionResult",
  searchAnswer:"https://moodle-breaker.kmsign.ru/searchAnswers",
  urlParams: new URLSearchParams(window.location.search),
  cmid: parseInt(new URLSearchParams(window.location.search).get("cmid")),
};
