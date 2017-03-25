import { GAP_MATCHER, HINT_MATCHER } from '../constants';


export function getNOfGaps(sentence) {
  return sentence.match(new RegExp(GAP_MATCHER, 'g')).length;
}

export function stripGapNo(word) {
  return word.split(/[{}]/)[1];
}

export function buildRawSentence(formated, gaps) {
  return formated.replace(GAP_MATCHER, () => {
    const gap = gaps.splice(0, 1)[0];
    const hint = gap.hint ? `*${gap.hint.hint_text}*` : '';
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
