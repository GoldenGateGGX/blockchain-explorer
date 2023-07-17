// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { styled, Toggle } from '@polkadot/react-components';
import { settings } from '@polkadot/ui-settings';

interface Props {
  apiUrl: string;
  className?: string;
  label: React.ReactNode;
  setApiUrl: (apiUrl: string) => void;
  url: string;
  isDisabled: boolean;
}

function Url ({ apiUrl, className, isDisabled, label, url }: Props): React.ReactElement<Props> {
  const _onApply = useCallback(
    (): void => {
      settings.set({ ...(settings.get()), apiUrl });
      window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(apiUrl)}${window.location.hash}`);
    },
    [apiUrl]
  );

  return (
    <StyledToggle
      className={className}
      isDisabled={isDisabled}
      isRadio
      label={label}
      onChange={_onApply}
      value={apiUrl === url}
    />
  );
}

const StyledToggle = styled(Toggle)`
  padding: 0.25rem;
  text-align: right;

  > label {
    max-width: 12.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default React.memo(Url);
