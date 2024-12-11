import { AuthModeType } from '../../../shared';
type Props = {
    authMode: AuthModeType;
    setAuthMode: (authMode: AuthModeType) => void;
};
export declare const AuthModeSwitch: ({ authMode, setAuthMode, }: Props) => JSX.Element;
export {};
