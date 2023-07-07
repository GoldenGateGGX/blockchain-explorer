// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { LinkOption } from './types';

import { nodesGgxPNG } from '@polkadot/apps-config/ui/logos/nodes';

export const CUSTOM_ENDPOINT_KEY = 'polkadot-app-custom-endpoints';

interface EnvWindow {
  // eslint-disable-next-line camelcase
  process_env?: {
    WS_URL: string;
  }
}

const nodes = [{ link: 'wss://testnet.node.sydney.ggxchain.io', name: 'SYDNEY' }, { link: 'wss://testnet.node.brooklyn.ggxchain.io', name: 'BROOKLYN' }];

export function createCustom (t: TFunction): LinkOption[] {
  const WS_URL = (
    (typeof process !== 'undefined' ? process.env?.WS_URL : undefined) ||
    (typeof window !== 'undefined' ? (window as EnvWindow).process_env?.WS_URL : undefined)
  );

  return WS_URL
    ? [
      {
        isHeader: true,
        text: t('rpc.dev.custom', 'Custom environment', { ns: 'apps-config' }),
        textBy: '',
        ui: {},
        value: ''
      },
      {
        info: 'WS_URL',
        text: t('rpc.dev.custom.entry', 'Custom {{WS_URL}}', { ns: 'apps-config', replace: { WS_URL } }),
        textBy: WS_URL,
        ui: {},
        value: WS_URL
      }
    ]
    : [];
}

export function createOwn (t: TFunction): LinkOption[] {
  return nodes.map((node) => ({
    info: 'local',
    text: t('', node.name, { ns: 'apps-config' }),
    textBy: node.link,
    ui: { logo: nodesGgxPNG },
    value: node.link
  }));
}
