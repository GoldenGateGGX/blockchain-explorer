// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { keyring } from '@polkadot/ui-keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { ethereumEncode, evmToAddress } from '@polkadot/util-crypto';

const ETH_STORAGE_KEY = 'ethAddress';
const CHAIN_SS58_PREFIX = 'chainSS58Prefix';

export function toAddress (value?: string | Uint8Array | null, allowIndices = false): string | undefined {
  if (value) {
    try {
      const u8a = isHex(value)
        ? hexToU8a(value)
        : keyring.decodeAddress(value);

      if (!allowIndices && u8a.length !== 32 && u8a.length !== 20) {
        throw new Error('AccountIndex values not allowed');
      }

      if (u8a.length === 20) {
        const chainPrefixString = localStorage.getItem(CHAIN_SS58_PREFIX);
        const chainPrefix = chainPrefixString ? parseInt(chainPrefixString) : undefined;

        localStorage.setItem(ETH_STORAGE_KEY, ethereumEncode(u8a));

        return evmToAddress(ethereumEncode(u8a), chainPrefix);
      } else {
        return keyring.encodeAddress(u8a);
      }
    } catch (error) {
      // noop, undefined return indicates invalid/transient
    }
  }

  return undefined;
}
