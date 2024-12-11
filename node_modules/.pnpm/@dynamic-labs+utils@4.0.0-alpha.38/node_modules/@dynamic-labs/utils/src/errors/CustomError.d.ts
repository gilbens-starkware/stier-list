/**
 * Extend this class to allow usage of instanceof
 */
export declare class CustomError extends Error {
    code: string | undefined;
    constructor(message?: string | undefined, code?: string);
    toJSON(): {
        code: string | undefined;
        error: string;
    };
}
