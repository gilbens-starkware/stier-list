/// <reference types="react" />
import { ViewType } from '../../../context/ViewContext';
import { AuthModeType } from '../../../shared';
interface FooterContentProps {
    heading: string;
    copykey: string;
}
interface HeaderContentProps {
    heading: string | JSX.Element;
    copykey: string;
}
interface DynamicLayoutProps {
    view: ViewType;
    authMode: AuthModeType;
}
export declare const useDynamicLayoutData: ({ view, authMode, }: DynamicLayoutProps) => {
    headerData: {
        copykey: string;
        heading: string;
    };
    helpHeaderData?: undefined;
} | {
    headerData: HeaderContentProps | undefined;
    helpHeaderData: FooterContentProps | undefined;
};
export {};
