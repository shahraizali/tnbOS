import styled from 'styled-components';

import UNetworkLogo from 'system/components/NetworkLogo';
import {Status} from 'system/components/NetworkLogo/Styles';

export const Balance = styled.div`
  color: #74788d;
  font-size: 12px;
`;

export const Container = styled.div<{isActive: boolean}>`
  align-items: flex-start;
  background: ${({isActive}) => (isActive ? '#f6f6f6' : '#fff')};
  border-radius: 4px;
  display: flex;
  padding: 8px 12px;

  ${Status} {
    border-color: ${({isActive}) => (isActive ? '#f6f6f6' : '#fff')};
  }

  &:hover {
    background: #f6f6f6;
    cursor: pointer;
  }
`;

export const DisplayName = styled.div`
  color: #343a40;
  font-size: 14px;
  font-weight: 600;
`;

export const NetworkId = styled.div`
  color: #74788d;
  font-size: 12px;
`;

export const NetworkLogo = styled(UNetworkLogo)`
  margin-right: 10px;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
`;
