import { ReactNode, SetStateAction, Dispatch } from 'react';
export type FundingContextProps = {
    updateSupportsFunding: (props?: {
        address?: string;
        token?: string;
    }) => Promise<void>;
    fundingEnabled: boolean;
    fundingRef: React.RefObject<HTMLDivElement>;
    fundingUrl: string;
    setShowFunding: Dispatch<SetStateAction<boolean>>;
    showFunding: boolean;
    supportsFunding: boolean;
};
export declare const FundingContext: import("react").Context<FundingContextProps | undefined>;
export declare const FundingContextProvider: ({ children, }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useFundingContext: () => FundingContextProps;
