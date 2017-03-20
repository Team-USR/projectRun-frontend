import { GAP_MATCHER } from '../constants';


export function getNOfGaps(sentence) {
  return sentence.match(new RegExp(GAP_MATCHER, 'g')).length;
}

export function buildRawSentence(formated, gaps) {
  return formated.replace(GAP_MATCHER, () => {
    const gap = gaps.splice(0, 1)[0];
    const hint = gap.hint ? `*${gap.hint.hint_text}*` : '';
    return `{${gap.gap_text}}${hint}`;
  });
}
