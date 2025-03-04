import config from '@root/.sdk_examples.config.json';
import { useState, useEffect } from 'react';
import { WebComponent } from '@common/components';
import type { MpSdk } from '@common/public/assets/sdk';

import { tagComponentFactory } from './sdk-components/tagComponent';
import './App.css';

function App() {
  const [mpSdk, setMpSdk] = useState<MpSdk>();

  // Use after SDK has loadeed -- or you can pass the sdk into a child component or use on a context
  useEffect(() => {
    if (mpSdk) {
      // Create a context fore the sceneObject here so that we can dispose of it when the component is unmounted
      let sceneObject: MpSdk.Scene.IObject | undefined = undefined;
      const sdkApp = async(sdk: MpSdk) => {
        [sceneObject] = await mpSdk.Scene.createObjects(1);
        await sdk.Scene.registerComponents([
          {
            name: 'tag',
            factory: tagComponentFactory(),
          },
        ]);
        // Assert that the sceneObject will exist when this code is executed
        const lights = sceneObject!.addNode();
        lights.addComponent('mp.directionalLight', {});
        lights.addComponent('mp.ambientLight', { intensity: 4 });

        const tagNodes = new Map();
        sdk.Tag.data.subscribe({
          onAdded: function (index, item) {
            // Create a new node
            const node = sceneObject!.addNode();
            sdk.Tag.editStem(index, { stemVisible: false });
            const randomColor =
              '#' +
              Math.floor(Math.random() * 0xffffff)
                .toString(16)
                .padStart(6, '0');

            const component = node.addComponent('tag', {
              tagId: index,
              shape: 'sphere',
              color1: 'black',
              color2: randomColor,
              hoverColor1: randomColor,
              hoverColor2: 'black',
            });
            // Reposition the 3D Tag
            node.position.set(
              item.anchorPosition.x + item.stemVector.x,
              item.anchorPosition.y + item.stemVector.y,
              item.anchorPosition.z + item.stemVector.z
            );
            const emitPath = sceneObject!.addEmitPath(component, 'TAG.CLICK');
            sceneObject!.spyOnEvent({
              path: emitPath,
              onEvent: (tagId: string) => {
                sdk.Mattertag.navigateToTag(tagId, sdk.Mattertag.Transition.FLY);
              },
            });
            node.start();
            // Cache the node so we can update it later
            tagNodes.set(item.id, node);
          },
          // Handle updating position of 3D Tag if Tag is updated 
          // This will handle if the position or stem vector changed?)
          onUpdated: function (index, item) {
            const node = tagNodes.get(index);
            node.position.set(
              item.anchorPosition.x + item.stemVector.x,
              item.anchorPosition.y + item.stemVector.y,
              item.anchorPosition.z + item.stemVector.z
            )
          },
          // Handle removing 3D Tag if Tag is deleted with Tag.remove()
          onRemoved: function (index) {
            const node = tagNodes.get(index);
            if (node) {
              node.stop();
            }
          },
          onCollectionUpdated: function (collection) {
            console.log('All done!', collection);
          },
        });
      };
      // Run asynchronous SDK code
      sdkApp(mpSdk);
      return () => {
        // Dispose SceneObject if this component is unmounted
        sceneObject?.stop();
      };
    }
  }, [mpSdk]);

  return (
    <>
      <WebComponent model={config.defaultSpace} getSdk={(sdk: MpSdk) => setMpSdk(sdk)} />
    </>
  );
}

export default App;
