import React, { FC, PropsWithChildren } from 'react';
import { WalletGroupOption } from '../../shared';
export type WalletGroupContextType = {
    selectedWalletGroup?: WalletGroupOption;
    navigateToWalletGroup: (walletGroup: WalletGroupOption) => void;
};
export declare const WalletGroupContext: React.Context<WalletGroupContextType | undefined>;
export declare const useWalletGroupContext: () => WalletGroupContextType;
export declare const WalletGroupContextProvider: FC<PropsWithChildren>;
