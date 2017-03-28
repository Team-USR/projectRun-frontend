import moment from 'moment';

/**
 * Finds the highest score of all sessions
 * submitted by a user for a quiz
 * @param  {array} marks array of quiz session and score objects
 * @return {Object}      quiz session with the highest mark
 */
export function findHighestMark(marks) {
  return marks.reduce((prev, curr) => {
    if (curr.score >= prev.score) {
      return curr;
    }
    return prev;
  });
}

/**
 * Formats strings to be displayed in the app
 * @param  {String} key key received from the api
 * @return {String}     formated key
 */
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

/**
 * Formats the requested api data to fit the pie chart
 * data requirements for students
 * @param  {array} quizzes api response
 * @return {array}         name and value objects
 */
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

/**
 * Formats the requested api data to fit the pie chart
 * data requirements for teachers
 * @param  {array} quizzes api response
 * @return {array}         name and value objects
 */
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

/**
 * Parsing function for extracting the session date from
 * api response
 * @param  {String} lastUpdated long, useless string
 * @return {Object}             moment date object
 */
function parseSessionDate(lastUpdated) {
  const dateMatcher = lastUpdated.match(/\d\d\/\d\d\/\d\d\d\d/g);
  const hourMatcher = lastUpdated.match(/\d\d:\d\d((AM)|(PM))/);
  return moment(`${dateMatcher[0]} ${hourMatcher[0]}`, 'MM/DD/YYYY hh:mma');
}

/**
 * Comparator to be used by a sort function
 * @param  {String} lastUpdated1 api returned string
 * @param  {String} lastUpdated2 api returned string
 * @return {number}              -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareSubmitDates(lastUpdated1, lastUpdated2) {
  return moment.duration(parseSessionDate(lastUpdated1)
  .diff(parseSessionDate(lastUpdated2))).asSeconds();
}

/**
 * Formats the requested api data to fit the line chart
 * data requirements for teachers
 * @param  {array} data api response
 * @return {array}         name, value and date objects
 */
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

/**
 * Filter useless data and parse left data to be used by line charts
 * @param  {array} averages api response
 * @return {array}          name and value objects
 */
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
