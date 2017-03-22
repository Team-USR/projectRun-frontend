export default function findHighestMark(marks) {
  return marks.reduce((prev, curr) => {
    if (curr.score >= prev.score) {
      return curr;
    }
    return prev;
  });
}
