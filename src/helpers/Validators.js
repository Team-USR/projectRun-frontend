export function checkMultiple(element) {
  let errorMessage = '';
  let atLeastOneTrue = false;
  let answerFields = '';
  if (element.question === '') {
    errorMessage += 'Question is empty. \n';
  }
  element.answers_attributes.map((item) => {
    if (item.is_correct === true) {
      atLeastOneTrue = true;
    }
    if (item.answer === '' || item.answer === undefined) {
      answerFields = 'Answer fields can\'t be empty. \n';
    }
    return 0;
  });
  if (atLeastOneTrue === false) {
    errorMessage += 'At least one of the answers needs to be true. \n';
  }
  errorMessage += answerFields;
  return errorMessage;
}

export function checkMix(element) {
  const solArray = element.sentences_attributes;
  let mainSol = '';
  const altSol = [];
  for (let i = 0; i < solArray.length; i += 1) {
    if (solArray[i].is_main === true) {
      mainSol = solArray[i].text;
    } else {
      altSol.push(solArray[i].text);
    }
  }
  const splitMain = mainSol.split(' ').sort().join(',');
  let everythingMatches = true;
  altSol.map((el) => {
    const splitAlt = el.split(' ').sort().join(',');
    if (splitMain !== splitAlt) {
      everythingMatches = false;
    }
    return '';
  });
  if (!everythingMatches) {
    return ('The alternate solutions should contain all the main solution characters!');
  }
  return '';
}

export function checkCloze(element) {
  if (element.gaps_attributes.length === 0) {
    return 'The question should contain at least one valid sentence!';
  }
  return '';
}
