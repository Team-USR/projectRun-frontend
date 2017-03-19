import { GAP_MATCHER } from '../constants';


export default function getNOfGaps(sentence) {
  return sentence.match(new RegExp(GAP_MATCHER, 'g')).length;
}
