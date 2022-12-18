const source = `
import { useEffect, useState } from 'react';
import PureWidget from '/social-widgets/michaelpeter.near/PureWidget';
import SandpackWidget from '/social-widgets/michaelpeter.near/SandpackWidget';
import PropTaker from '/social-widgets/michaelpeter.near/PropTaker';
import NestParent from '/social-widgets/michaelpeter.near/NestParent';
export default function App() {
  return (
    <div>
      <SandpackWidget />
      <PropTaker message="hiya!" />
      <button
        onClick={() => {
          window.top.postMessage('hello', '*');
        }}
      >
        Do something for me
      </button>
      <NestParent />
    </div>
  );
}
`;

export default source;
