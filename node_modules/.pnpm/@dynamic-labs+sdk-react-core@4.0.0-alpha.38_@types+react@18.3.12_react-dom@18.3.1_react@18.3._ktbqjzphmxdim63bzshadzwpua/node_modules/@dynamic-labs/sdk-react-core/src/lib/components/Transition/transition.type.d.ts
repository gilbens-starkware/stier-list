import { PropsWithChildren } from 'react';
export interface ITransitionOptions {
    className?: string;
    duration?: number;
    inDuration?: number;
    inDelay?: number;
    isShown?: boolean;
    outDuration?: number;
    outDelay?: number;
    delay?: number;
}
export type TransitionProps = ITransitionOptions & PropsWithChildren;
