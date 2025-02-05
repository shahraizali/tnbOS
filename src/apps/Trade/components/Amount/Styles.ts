import styled from 'styled-components';

export const AmountContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
`;

export const BottomText = styled.div`
  color: #74788d;
  font-size: 12px;
`;

export const Container = styled.div<{leftAlign: boolean}>`
  align-items: ${({leftAlign}) => (leftAlign ? 'flex-start' : 'flex-end')};
  display: flex;
  flex-direction: column;
`;

export const Logo = styled.img`
  border-radius: 50%;
  height: 12px;
  margin-left: 4px;
  width: 12px;
`;

export const Price = styled.div`
  color: #343a40;
  font-size: 14px;
  font-weight: 600;
`;
