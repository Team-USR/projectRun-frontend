import moment from 'moment';

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
  Object.keys(data).forEach(key => data[key] > 0 && dataAsArray.push({
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
  Object.keys(data).forEach(key => data[key] > 0 && dataAsArray.push({
    name: formatKeys(key),
    value: data[key],
  }));
  return dataAsArray;
}

function parseSessionDate(lastUpdated) {
  const dateMatcher = lastUpdated.match(/\d\d\/\d\d\/\d\d\d\d/g);
  const hourMatcher = lastUpdated.match(/\d\d:\d\d((AM)|(PM))/);
  return moment(`${dateMatcher[0]} ${hourMatcher[0]}`, 'MM/DD/YYYY hh:mma');
}

export function compareSubmitDates(lastUpdated1, lastUpdated2) {
  return moment.duration(parseSessionDate(lastUpdated1)
  .diff(parseSessionDate(lastUpdated2))).asSeconds();
}

export function getLastHighestGrades(data) {
  const dataObj = data.reduce((accumulator, next) => {
    const acc = accumulator;
    if (!acc[next]) {
      acc[next.quiz_title] = {
        score: next.score,
        date: next.last_updated.replace('Last updated', 'Submitted'),
      };
      return acc;
    }
    if (acc[next.quiz_title].score < next.score) {
      acc[next.quiz_title] = {
        score: next.score,
        date: next.last_updated.replace('Last updated', 'Submitted'),
      };
    }
    if (acc[next.quiz_title].score === next.score &&
      !compareSubmitDates(acc[next.quiz_title].date, next.date)) {
      acc[next.quiz_title] = {
        score: next.score,
        date: next.last_updated.replace('Last updated', 'Submitted'),
      };
    }
    return acc;
  }, {});

  return Object.keys(dataObj).map(key => ({
    name: key,
    value: dataObj[key].score,
    date: dataObj[key].date,
  }));
}

export function formatAveragePerCreatedClass(averages) {
  const filtered = averages.filter(myClass => myClass.average !== null);
  if (filtered.length === 0) {
    return [];
  }
  return filtered.map(average => ({
    name: average.group_name,
    value: parseFloat(average.average.match(/\d+\.(\d\d|\d)/)[0], 10),
  }));
}
