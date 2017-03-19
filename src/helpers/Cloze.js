import { GAP_MATCHER } from '../constants';


export default function getNOfGaps(sentence) {
  return sentence.match(GAP_MATCHER).length;
}
