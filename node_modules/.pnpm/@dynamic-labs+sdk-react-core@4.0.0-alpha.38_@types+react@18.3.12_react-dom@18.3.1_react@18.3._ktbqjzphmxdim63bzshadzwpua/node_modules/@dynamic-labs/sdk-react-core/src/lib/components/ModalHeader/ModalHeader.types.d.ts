import { CSSProperties, ReactElement, ReactNode } from 'react';
export type ModalHeaderProps = {
    alignContent?: 'bottom';
    children?: ReactNode;
    leading?: ReactElement | ReactElement[];
    displayLeading?: boolean;
    positionAbsolute?: boolean;
    trailing?: ReactNode;
    displayTrailing?: boolean;
    style?: CSSProperties;
    displayBorder?: boolean;
};
export type ModalHeaderComponent = (props: ModalHeaderProps) => ReactElement;
