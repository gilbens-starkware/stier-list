import { FC, MutableRefObject, PropsWithChildren } from 'react';
type PopperContext = {
    containerRef: MutableRefObject<HTMLDivElement | null>;
};
export declare const popperContext: import("react").Context<PopperContext | undefined>;
export declare const PopperProvider: FC<PropsWithChildren>;
export declare const usePopper: () => PopperContext;
export {};
