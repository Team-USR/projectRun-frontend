import { GAP_MATCHER, HINT_MATCHER } from '../constants';


export function getNOfGaps(sentence) {
  return sentence.match(new RegExp(GAP_MATCHER, 'g')).length;
}

export function stripGapNo(word) {
  return word.split(/[{}]/)[1];
}

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

export function buildRawSentence(formated, gaps) {
  let gapInd = 0;
  return formated.replace(new RegExp(GAP_MATCHER, 'g'), () => {
    const gap = gaps[gapInd];
    gapInd += 1;
    const hint = `*${gap.hint.hint_text}*`;
    return `{${gap.gap_text}}${hint}`;
  });
}

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
