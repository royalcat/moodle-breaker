export const getBlocks = (type, state, answered = "") =>
  document.getElementsByClassName(
    "que deferredfeedback"+
     " " + type + " " + state + " " + answered
  );
