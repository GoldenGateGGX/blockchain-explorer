// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction, TOptions } from '../types';
import type { LinkOption } from './types';

import { createCustom, createOwn } from './development';

export { CUSTOM_ENDPOINT_KEY } from './development';
export * from './production';
export * from './testing';

function defaultT (keyOrText: string, text?: string, options?: TOptions): string {
  return (
    (
      options &&
      options.replace &&
      options.replace.host
    ) ||
    text ||
    keyOrText
  );
}

export function createWsEndpoints (t: TFunction = defaultT): LinkOption[] {
  return [
    ...createCustom(t),
    {
      isDevelopment: true,
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...createOwn(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
