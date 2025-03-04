import config from '@root/.sdk_examples.config.json';
import { useState, useEffect } from 'react';
import { WebComponent } from '@common/components';
import type { MpSdk } from '@common/public/assets/sdk';
import './App.css';

function App() {
  const [mpSdk, setMpSdk] = useState<MpSdk>();

  // Use after SDK has loadeed -- or you can pass the sdk into a child component or use on a context
  useEffect(() => {
    if (mpSdk) {
      console.log('Hello World!');
      console.log(mpSdk);
      mpSdk.App.state
        .waitUntil((state) => state.phase === mpSdk.App.Phase.PLAYING)
        .then(() => {
          mpSdk.Camera.rotate(45, 0);
        });
    }
  }, [mpSdk]);

  return (
    <>
      <WebComponent
        model={config.defaultSpace}
        getSdk={(sdk: MpSdk) => setMpSdk(sdk)}
      />
    </>
  );
}

export default App;
