export const isCorrectData = (data) => {
  let flag = true;

  if (!data) flag = false;
  if (data.answers == null) flag = false;
  if (!data.answers.length) flag = false;

  return flag;
};
