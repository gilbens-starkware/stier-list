type OpenFundingProps = {
    address?: string;
    token?: string;
};
export declare const useFunding: () => {
    enabled: boolean;
    openFunding: ({ address, token }?: OpenFundingProps) => Promise<void>;
};
export {};
