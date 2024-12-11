/// <reference types="react" />
import { WalletConnector } from '@dynamic-labs/wallet-connector-core';
type Props = {
    className?: string;
    showNetworkName?: boolean;
    walletConnector: WalletConnector;
};
export declare const NonNetworkSwitchingSupportedControl: ({ walletConnector, className, showNetworkName, }: Props) => JSX.Element;
export {};
