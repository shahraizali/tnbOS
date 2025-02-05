import {ReactNode, useMemo} from 'react';
import {useSelector} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import {mdiArrowDownCircleOutline, mdiArrowUpCircleOutline} from '@mdi/js';

import Table from 'apps/Trade/components/Table';
import {getHoldingAccounts} from 'apps/Trade/selectors/state';
import {Transaction, TransactionPerspective, TransactionStatus} from 'apps/Trade/types';
import {useToggle} from 'system/hooks';
import {getSelf} from 'system/selectors/state';
import {Dict, NetworkBlock as TNetworkBlock, SFC} from 'system/types';
import {shortDate} from 'system/utils/dates';
import {camelToTitle} from 'system/utils/strings';
import * as S from './Styles';

export interface NetworkBlockProps {
  networkBlock: TNetworkBlock | Transaction;
  networkDisplayName: string;
}

const NetworkBlock: SFC<NetworkBlockProps> = ({className, networkBlock, networkDisplayName}) => {
  const [expanded, toggleExpanded] = useToggle(false);
  const holdingAccounts = useSelector(getHoldingAccounts);
  const self = useSelector(getSelf);

  const perspective = useMemo((): TransactionPerspective => {
    let accountNumbers = [self.accountNumber];

    if ('networkId' in networkBlock) {
      const networkHoldingAccounts = holdingAccounts[networkBlock.networkId];

      if (networkHoldingAccounts && !isEmpty(networkHoldingAccounts)) {
        const holdingAccountNumbers = Object.values(networkHoldingAccounts).map(({accountNumber}) => accountNumber);
        accountNumbers = [...accountNumbers, ...holdingAccountNumbers];
      }
    }

    return accountNumbers.includes(networkBlock.sender)
      ? TransactionPerspective.sender
      : TransactionPerspective.receiver;
  }, [holdingAccounts, networkBlock, self.accountNumber]);

  const transactionStatus = useMemo((): TransactionStatus => {
    return perspective === TransactionPerspective.receiver ? TransactionStatus.received : TransactionStatus.sent;
  }, [perspective]);

  const renderDetails = () => {
    const actions = {
      [TransactionStatus.received]: 'Received',
      [TransactionStatus.sent]: 'Sent',
    };

    const action = actions[transactionStatus];

    return (
      <S.Details>
        <S.DetailsTopText>
          {action} {networkDisplayName}
        </S.DetailsTopText>
        <S.BottomText>{shortDate(networkBlock.date, true)}</S.BottomText>
      </S.Details>
    );
  };

  const renderExpandedDetails = () => {
    const keyOverrides: Dict<string> = {
      id: 'Block ID',
      transaction_fee: 'Transaction Fee',
    };

    const valueOverrides: {[key: string]: (value?: any) => ReactNode} = {
      payload: (value) => JSON.stringify(value, null, 4),
    };

    /* eslint-disable sort-keys */
    const orderedNetworkBlock: TNetworkBlock = {
      id: networkBlock.id,
      amount: networkBlock.amount,
      transaction_fee: networkBlock.transaction_fee,
      sender: networkBlock.sender,
      recipient: networkBlock.recipient,
      signature: networkBlock.signature,
      payload: networkBlock.payload,
      date: networkBlock.date,
    };
    /* eslint-enable sort-keys */

    const rows = Object.entries(orderedNetworkBlock)
      .filter(([key]) => key !== 'date')
      .map(([key, value]) => ({
        key: keyOverrides[key] || camelToTitle(key),
        value: valueOverrides[key] ? valueOverrides[key](value) : value,
      }));

    return (
      <S.ExpandedDetails>
        <Table rows={rows} />
      </S.ExpandedDetails>
    );
  };

  const renderIcon = () => {
    const colors = {
      [TransactionStatus.received]: '#45c696',
      [TransactionStatus.sent]: '#818497',
    };

    const paths = {
      [TransactionStatus.received]: mdiArrowDownCircleOutline,
      [TransactionStatus.sent]: mdiArrowUpCircleOutline,
    };

    const color = colors[transactionStatus];
    const path = paths[transactionStatus];

    return <S.Icon color={color} path={path} size="24px" />;
  };

  const renderValueContainer = () => {
    const sign = transactionStatus === TransactionStatus.sent ? '-' : '+';
    return (
      <S.ValueContainer>
        <S.Value transactionStatus={transactionStatus}>
          {sign}
          {networkBlock.amount}
        </S.Value>
      </S.ValueContainer>
    );
  };

  return (
    <S.Container className={className}>
      <S.Top onClick={toggleExpanded}>
        {renderIcon()}
        {renderDetails()}
        {renderValueContainer()}
      </S.Top>
      {expanded ? renderExpandedDetails() : null}
    </S.Container>
  );
};

export default NetworkBlock;
