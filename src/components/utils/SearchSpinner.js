import Spinner from 'react-spinkit';
import React from 'react';

export default function NavBar() {
  return (
    <div className="brandSpinnerWrapper">
      <Spinner spinnerName="cube-grid" noFadeIn style={{ width: 40, height: 50 }} />
    </div>
  );
}
