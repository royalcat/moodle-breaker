const link = "https://moodle-breaker-test.kmsign.ru";
const urlParams = new URLSearchParams(window.location.search)

export const config = {
  sendAddress: link + "/addQuestionResult",
  getAnswer: link + "/getQuestionResult",
  searchAnswer: link + "/searchAnswers",
  urlParams: urlParams,
  cmid: parseInt(urlParams.get("cmid")),
  defaultMaxGrade: 1,
};
