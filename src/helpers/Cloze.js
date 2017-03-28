import { GAP_MATCHER, HINT_MATCHER } from '../constants';

/**
 * Returns the number of gaps inside a Fill in the gap sentence
 * @param  {String} sentence
 * @return {number}
 */
export function getNOfGaps(sentence) {
  return sentence.match(new RegExp(GAP_MATCHER, 'g')).length;
}
/**
 * Strips the tokens off a Fill in the gap gap identifier
 * @param  {String} word
 * @return {String}
 */
export function stripGapNo(word) {
  return word.split(/[{}]/)[1];
}
/**
 * Formats ClozeGenerator data to fit the api requirements
 * @param  {Array} questions array of sentences
 * @return {Object}
 */
export function buildToSendQuestions(questions) {
  let current = 0;
  return questions.map(question => ({
    no: question.no,
    question: (question.question || '').replace(new RegExp(HINT_MATCHER, 'g'), '')
      .replace(new RegExp(GAP_MATCHER, 'g'), () => {
        current += 1;
        return `{${current}}`;
      }),
  }));
}
/**
 * Builds the sentences to be displayed in the ClozeGenerator
 * inside the editor
 * @param  {String} formated Cloze sentence without gaps
 * @param  {array} gaps      Gap answers for the cloze sentence
 * @return {String}          string to be displayed in the editor
 */
export function buildRawSentence(formated, gaps) {
  let gapInd = 0;
  return formated.replace(new RegExp(GAP_MATCHER, 'g'), () => {
    const gap = gaps[gapInd];
    gapInd += 1;
    const hint = `*${gap.hint.hint_text}*`;
    return `{${gap.gap_text}}${hint}`;
  });
}
/**
 * Parses the Fill in the gap sentence
 * and extracts gaps and hints
 * @param  {String} clozePhrase raw cloze string
 * @param  {number} currentInd  the index of the sentence in the list
 * @return {array}              ready to send, formatted question
 */
export function findTokens(clozePhrase, currentInd) {
  const gaps = [];
  while (clozePhrase.length) {
    const gapText = {
      no: currentInd,
      gap_text: clozePhrase[0].split(/[{}]/)[1],
    };
    clozePhrase.splice(0, 1);
    if (clozePhrase.length && clozePhrase[0].match(HINT_MATCHER)) {
      gapText.hint_attributes = {
        hint_text: clozePhrase[0].split(/\*/g)[1],
      };
      clozePhrase.splice(0, 1);
    }
    gaps.push(gapText);
  }
  return gaps;
}
