import { Dispatch, FC, SetStateAction } from 'react';
import { DotsMenuOption } from '../DotsMenu/DotsMenu';
export type DotsMenuDropdownProps = {
    options: DotsMenuOption[];
    setShowMenu: Dispatch<SetStateAction<boolean>>;
};
export type DotsMenuDropdownComponent = FC<DotsMenuDropdownProps>;
