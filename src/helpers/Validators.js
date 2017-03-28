/*
  Validation function which checks each answer from the multiple choice question.
  Each answer mustn't be empty
  At least one of the answers must be true.
  @return errorMessage {String} [returns the error message to be displayed underneath the specific question]
*/
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
/*
  Checks if the question is empty and if the alternate solution contains all the main solution
  characters
*/
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
/*
  Validates if the cloze question has at least one valid sentence and if the question has a title
*/
export function checkCloze(element) {
  if (element.gaps_attributes.length === 0) {
    return 'The question should contain at least one valid sentence!';
  } else if (element.question.length === 0) {
    return 'The question should have a title!';
  }
  return '';
}
/*
 Checks if a question has an empty title and if it has at least one left-right element.
 @return errorMessage {String} [return a string containing the error message]
*/
export function checkMatch(element) {
  let errorMessage = '';

  if (element) {
    // Check Question field
    if (!element.question || (element.question && element.question.length === 0)) {
      errorMessage += 'Question is empty. \n';
    }

    // Check Left and Right Elements fields
    if (!element.pairs_attributes ||
      (element.pairs_attributes && element.pairs_attributes.length === 0)) {
      errorMessage += 'A valid Match should have at least one left-right element! \n';
    } else if (element.pairs_attributes.length > 0) {
      let fieldsCompleted = true;
      element.pairs_attributes.map((obj) => {
        if (obj.left_choice.length === 0 || obj.right_choice.length === 0) {
          fieldsCompleted = false;
        }
        return obj;
      });

      if (!fieldsCompleted) {
        errorMessage += 'Left and Right values are not valid! \n';
      }
    }

    // Check Default Value field
    if (!element.match_default_attributes || (element.match_default_attributes
      && element.match_default_attributes.default_text === '')) {
      errorMessage += 'Default Option field cannot be empty! \n';
    }
  }
  return errorMessage;
}
/*
  Validates the question input and each hints. They musn't be empty.
  Width and Height and board have default values.
  @param element
*/
export function checkCross(element) {
  let errorMessage = '';

  if (element !== undefined) {
    // Check Question field
    if (!element.question || (element.question && element.question.length === 0)) {
      errorMessage += 'Don\'t forget to complete the question field! \n';
    }

    if (element.hints_attributes !== undefined) {
      if (element.hints_attributes.length !== 0) {
        let fieldsCompleted = true;
        element.hints_attributes.map((obj) => {
          if (obj.hint === '') {
            fieldsCompleted = false;
          }
          return obj;
        });

        if (!fieldsCompleted) {
          errorMessage += 'Please complete the Hint for each word! \n';
        }
      } else {
        errorMessage += 'A valid Cross should contain at least 2 words and its Hints. \n';
      }
    }
  }

  return errorMessage;
}
