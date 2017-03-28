import Spinner from 'react-spinkit';
import React from 'react';
/*
Function that returns a Brand Spinner component
*/
export default function NavBar() {
  return (
    <div className="brandSpinnerWrapper">
      <Spinner spinnerName="cube-grid" noFadeIn />
    </div>
  );
}
