import axios from 'axios';

// TODO: parser for questions


export default async function postCloze(token, quiz) {
  // quiz id 121 - question 156
  if (quiz) {
    axios.post('https://project-run.herokuapp.com/quizzes',
      quiz, { headers: {
        Authorization: token } }).then(res => console.log(res));
  }
}
