import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import { WordButton } from '../index';

describe('<WordButton />', () => {
  it('renders a button with text from props', () => {
    expect(shallow(
      <WordButton
        reviewState={false}
        resultsState={false}
        text="lmao"
        onClick={() => true}
      />,
  ).containsMatchingElement([<Button>lmao</Button>])).toEqual(true);
  });

  it('renders a disabled button if reviewState is true', () => {
    expect(shallow(
      <WordButton
        reviewState
        resultsState={false}
        text="lmao"
        onClick={() => true}
      />,
  ).containsMatchingElement(
    [<Button disabled active={false} onClick={() => true}>lmao</Button>]))
    .toEqual(true);
  });
});
