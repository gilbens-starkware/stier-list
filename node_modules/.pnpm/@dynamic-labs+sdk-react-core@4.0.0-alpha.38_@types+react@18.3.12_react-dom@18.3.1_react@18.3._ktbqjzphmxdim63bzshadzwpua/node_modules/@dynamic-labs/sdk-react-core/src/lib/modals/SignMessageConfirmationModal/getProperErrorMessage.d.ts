import { PasskeyError } from '@dynamic-labs/utils';
export declare const getProperErrorMessage: (originalError: PasskeyError | {
    reason?: string;
}) => string | undefined;
