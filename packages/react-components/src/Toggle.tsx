// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { styled } from './styled';

interface Props {
  className?: string;
  isDisabled?: boolean;
  isRadio?: boolean;
  label: React.ReactNode;
  onChange?: (isChecked: boolean) => void;
  preventDefault?: boolean;
  value?: boolean;
}

function Toggle ({ className = '', isDisabled, label, onChange, preventDefault, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const _onClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      if (!isDisabled) {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }

        onChange && onChange(!value);
      }
    },
    [isDisabled, onChange, preventDefault, value]
  );

  return (
    <StyledDiv
      className={`${className} ui--Toggle ${isDisabled ? 'isDisabled' : ''}`}
      onClick={_onClick}
    >
      {label && <label>{label}</label>}
      <StyledBtn
        className={`${isDisabled ? 'isDisabled' : ''} ui--Switch`}
        disabled={isDisabled}
      >{t<string>('Switch')}</StyledBtn>
    </StyledDiv>
  );
}

const StyledBtn = styled.button`
  background: var(--bg-toggle);
`;

const StyledDiv = styled.div`
  > label {
    display: inline-block;
    margin: 0 0.5rem !important;
  }

  > label,
  > div {
    vertical-align: middle;
  }

  .ui--Switch {
    padding: 5px 10px !important;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &.isDisabled {
      cursor: not-allowed;
    }

    &:not(.isDisabled):hover {
      border-radius: unset;
    }
  }

  .ui--Toggle-Slider {
    background: var(--bg-toggle);
    border-radius: 1.5rem;
    display: inline-block;
    height: 1.5rem;
    position: relative;
    width: 3rem;

    &::before {
      background: var(--bg-table);
      border: 0.125rem solid var(--bg-toggle);
      border-radius: 50%;
      content: "";
      height: 1.5rem;
      left: 0;
      position: absolute;
      top: 0;
      width: 1.5rem;
    }
  }

  &:not(.isDisabled) {
    cursor: pointer;

    > label {
      cursor: pointer;
    }
  }

  &.isChecked {
    &:not(.isRadio) {
      .ui--Toggle-Slider:before {
        transform: translateX(1.5rem);
      }
    }

    &.isRadio {
      .ui--Toggle-Slider:before {
        border-width: 0.5rem;
      }
    }
  }

  &.isRadio {
    .ui--Toggle-Slider {
      width: 1.5rem;
    }
  }
`;

export default React.memo(Toggle);
