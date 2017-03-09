import Spinner from 'react-spinkit';
import React from 'react';

export default function NavBar() {
  return (
    <div className="brandSpinnerWrapper">
      <Spinner spinnerName="cube-grid" noFadeIn />
    </div>
  );
}
