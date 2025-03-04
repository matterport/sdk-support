import { createElement, useEffect, useRef } from 'react';
import '@matterport/webcomponent';
import type { MpSdk } from '../../../public/assets/sdk';
import config from "../../../../.sdk_examples.config.json";

type Props = {
  model: string;
  getSdk: (sdk: MpSdk) => void;
};

export function WebComponent({ getSdk, model }: Props) {
  const showcase = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mpSdk: MpSdk | null = null;
    if (showcase.current) {
      showcase.current?.addEventListener('mpSdkPlaying', (event: Event) => {
        const evt = event as CustomEvent<{ mpSdk: MpSdk }>;
        mpSdk = evt.detail.mpSdk;
        getSdk(mpSdk);
      });
    }
    // Disconnect SDK on unmount
    return () => {
      if (mpSdk) {
        //mpSdk.disconnect();
      }
    };
  }, [getSdk, showcase]);

  return createElement('matterport-viewer', {
    // 'm': 'JGPnGQ6hosj', doesn't work -- why?
    src: 'm=' + model,
    qs: '1',
    'asset-base': '/assets/',
    'application-key': config.sdkKey,
    ref: showcase,
  });
}
