import Spinner from 'react-spinkit';
import React from 'react';

/*
Function that returns a search spinner
*/
export default function NavBar() {
  return (
    <div className="searchSpinnerWrapper">
      <Spinner spinnerName="cube-grid" noFadeIn />
    </div>
  );
}
