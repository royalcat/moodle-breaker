export const isCorrectData = (data) => {
  if (!data) return false;
  if (data.answers == null) return false;
  if (!data.answers.length) return false;

  return true;
};
