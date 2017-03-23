export function findHighestMark(marks) {
  return marks.reduce((prev, curr) => {
    if (curr.score >= prev.score) {
      return curr;
    }
    return prev;
  });
}

function formatKeys(key) {
  switch (key) {
    case 'in_progress':
      return 'In progress';
    case 'not_started':
      return 'Not started';
    case 'submitted':
      return 'Submitted';
    case 'published':
      return 'Published';
    case 'not_published':
      return 'Not published';
    default:
      return '';
  }
}

export function formatDataForStudentQuizPie(quizzes) {
  const data = quizzes.reduce((acc, next) => {
    const toReturn = acc;
    toReturn[next.status] += 1;
    return toReturn;
  }, {
    not_started: 0,
    in_progress: 0,
    submitted: 0,
  });
  const dataAsArray = [];
  Object.keys(data).forEach(key => dataAsArray.push({
    name: formatKeys(key),
    value: data[key],
  }));
  return dataAsArray;
}

export function formatDataForTeacherQuizPie(quizzes) {
  const data = quizzes.reduce((acc, next) => {
    const toReturn = acc;
    if (next.published) {
      toReturn.published += 1;
    } else {
      toReturn.not_published += 1;
    }
    return toReturn;
  }, {
    published: 0,
    not_published: 0,
  });
  const dataAsArray = [];
  Object.keys(data).forEach(key => dataAsArray.push({
    name: formatKeys(key),
    value: data[key],
  }));
  return dataAsArray;
}
