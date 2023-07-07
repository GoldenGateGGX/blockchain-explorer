// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { Group } from './types';

// ok, this seems to be an eslint bug, this _is_ a package import
import React, { useCallback, useMemo, useRef, useState } from 'react';
import store from 'store';

import { createWsEndpoints } from '@polkadot/apps-config';
import { Button, Sidebar, styled } from '@polkadot/react-components';
import { settings } from '@polkadot/ui-settings';

import { useTranslation } from '../translate';
import GroupDisplay from './Group';

interface Props {
  className?: string;
  offset?: number | string;
  onClose: () => void;
}

export interface UrlState {
  apiUrl: string;
  groupIndex: number;
  hasUrlChanged: boolean;
  isUrlValid: boolean;
}

export const STORAGE_AFFINITIES = 'network:affinities';

export function isValidUrl (url: string): boolean {
  return (
    // some random length... we probably want to parse via some lib
    (url.length >= 7) &&
    // check that it starts with a valid ws identifier
    (url.startsWith('ws://') || url.startsWith('wss://') || url.startsWith('light://'))
  );
}

export function combineEndpoints (endpoints: LinkOption[]): Group[] {
  return endpoints.reduce((result: Group[], e): Group[] => {
    if (e.isHeader) {
      result.push({ header: e.text, isDevelopment: e.isDevelopment, isSpaced: e.isSpaced, networks: [] });
    } else {
      const prev = result[result.length - 1];
      const prov = { isLightClient: e.isLightClient, name: e.textBy, url: e.value };

      if (prev.networks[prev.networks.length - 1] && e.text === prev.networks[prev.networks.length - 1].name) {
        prev.networks[prev.networks.length - 1].providers.push(prov);
      } else if (!e.isUnreachable) {
        prev.networks.push({
          isChild: e.isChild,
          isRelay: !!e.genesisHash,
          name: e.text as string,
          nameRelay: e.textRelay as string,
          paraId: e.paraId,
          providers: [prov],
          ui: e.ui
        });
      }
    }

    return result;
  }, []);
}

export function extractUrlState (apiUrl: string, groups: Group[]): UrlState {
  let groupIndex = groups.findIndex(({ networks }) =>
    networks.some(({ providers }) =>
      providers.some(({ url }) => url === apiUrl)
    )
  );

  if (groupIndex === -1) {
    groupIndex = groups.findIndex(({ isDevelopment }) => isDevelopment);
  }

  return {
    apiUrl,
    groupIndex,
    hasUrlChanged: settings.get().apiUrl !== apiUrl,
    isUrlValid: isValidUrl(apiUrl)
  };
}

export function loadAffinities (groups: Group[]): Record<string, string> {
  return Object
    .entries<string>(store.get(STORAGE_AFFINITIES) as Record<string, string> || {})
    .filter(([network, apiUrl]) =>
      groups.some(({ networks }) =>
        networks.some(({ name, providers }) =>
          name === network && providers.some(({ url }) => url === apiUrl)
        )
      )
    )
    .reduce((result: Record<string, string>, [network, apiUrl]): Record<string, string> => ({
      ...result,
      [network]: apiUrl
    }), {});
}

export function isSwitchDisabled (hasUrlChanged: boolean, apiUrl: string, isUrlValid: boolean): boolean {
  if (!hasUrlChanged) {
    return true;
  } else if (apiUrl.startsWith('light://')) {
    return false;
  } else if (isUrlValid) {
    return false;
  }

  return true;
}

function Endpoints ({ className = '', offset, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const linkOptions = createWsEndpoints(t);
  const [groups] = useState(() => combineEndpoints(linkOptions));
  const [{ apiUrl, groupIndex, hasUrlChanged, isUrlValid }, setApiUrl] = useState<UrlState>(() => extractUrlState(settings.get().apiUrl, groups));
  const [affinities, setAffinities] = useState(() => loadAffinities(groups));
  const sidebarRef = useRef<HTMLDivElement>(null);

  const _changeGroup = useCallback(
    (groupIndex: number) => setApiUrl((state) => ({ ...state, groupIndex })),
    []
  );

  const _setApiUrl = useCallback(
    (network: string, apiUrl: string): void => {
      setAffinities((affinities): Record<string, string> => {
        const newValue = { ...affinities, [network]: apiUrl };

        store.set(STORAGE_AFFINITIES, newValue);

        return newValue;
      });
      setApiUrl(extractUrlState(apiUrl, groups));
    },
    [groups]
  );

  const _onApply = useCallback(
    (): void => {
      settings.set({ ...(settings.get()), apiUrl });
      window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(apiUrl)}${window.location.hash}`);
      // window.location.reload();
      onClose();
    },
    [apiUrl, onClose]
  );

  const canSwitch = useMemo(
    () => isSwitchDisabled(hasUrlChanged, apiUrl, isUrlValid),
    [hasUrlChanged, apiUrl, isUrlValid]
  );

  return (
    <StyledSidebar
      button={
        <Button
          icon='sync'
          isDisabled={canSwitch}
          label={t<string>('Switch')}
          onClick={_onApply}
        />
      }
      className={className}
      offset={offset}
      onClose={onClose}
      position='left'
      sidebarRef={sidebarRef}
    >
      {groups.map((group, index): React.ReactNode => (
        <GroupDisplay
          affinities={affinities}
          apiUrl={apiUrl}
          index={index}
          isDisabled={canSwitch}
          isSelected={groupIndex === index}
          key={index}
          setApiUrl={_setApiUrl}
          setGroup={_changeGroup}
          value={group}
        >
        </GroupDisplay>
      ))}
    </StyledSidebar>
  );
}

const StyledSidebar = styled(Sidebar)`
  color: var(--color-text);
  padding-top: 3.5rem;

  .customButton {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .endpointCustom {
    input {
      padding-right: 4rem;
    }
  }

  .endpointCustomWrapper {
    position: relative;
  }
`;

export default React.memo(Endpoints);
