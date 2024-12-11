import { Dispatch, SetStateAction } from 'react';
import { EvmNetwork } from '@dynamic-labs/types';
import { WalletConnector } from '@dynamic-labs/wallet-connector-core';
type Props = {
    activeClassName?: string;
    buttonClassName?: string;
    evmNetworks?: EvmNetwork[];
    isOpen: boolean;
    loading: boolean;
    network: number | string | undefined;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    showNetworkName?: boolean;
    walletConnector: WalletConnector | undefined;
};
export declare const NetworkControl: ({ loading, walletConnector, buttonClassName, network, evmNetworks, activeClassName, isOpen, setIsOpen, showNetworkName, }: Props) => JSX.Element;
export {};
