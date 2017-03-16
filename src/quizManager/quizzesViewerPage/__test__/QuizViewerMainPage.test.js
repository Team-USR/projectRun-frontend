import React from 'react';
import { mount } from 'enzyme';
import { QuizViewerMainPage } from '../';

describe('<QuizViwerMainPage />', () => {
  const loading = '.brandSpinnerWrapper';
  it('Component should contain loading screen', () => {
    expect(mount(<QuizViewerMainPage userToken={{}} />)
    .find(loading).length).toBe(1);
  });
});
