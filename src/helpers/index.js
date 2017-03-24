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

function parseSessionDate(lastUpdated) {
  const dateMatcher = new RegExp(/%d%d\/%d%d\/%d%d%d%d/);
  const hourMatcher = new RegExp(/%d%d:%d%d/);
  return `${lastUpdated.match(dateMatcher)[0]} ${lastUpdated.match(hourMatcher)[0]}`;
}

function compareSubmitDates(lastUpdated1, lastUpdated2) {
  return Date.parse(parseSessionDate(lastUpdated1)) < Date.parse(parseSessionDate(lastUpdated2));
}

export function getLastHighestGrades(data) {
  const dataObj = data.reduce((accumulator, next) => {
    const acc = accumulator;
    if (!acc[next]) {
      acc[next.name] = {
        score: next.score,
        date: next.last_updated.replace('Last updated', 'Submitted'),
      };
      return acc;
    }
    if (acc[next.name].score < next.score) {
      acc[next.name] = {
        score: next.score,
        date: next.last_updated.replace('Last updated', 'Submitted'),
      };
    }
    if (acc[next.name].score === next.score &&
      !compareSubmitDates(acc[next.name].date, next.date)) {
      acc[next.name] = {
        score: next.score,
        date: next.last_updated.replace('Last updated', 'Submitted'),
      };
    }
    return acc;
  });

  return Object.keys(dataObj).map(key => dataObj[key]);
}
