// @flow
import type { CustomRowMenuContents, DataSourceItem } from '../types';

export type Props = {
    classes: {
        deleteIcon: string,
        menuList: string,
        popperContainerHidden: string,
        popperContainer: string,
        iconContainer: string,
        icon: string,
    },
    row: DataSourceItem,
    customRowMenuContents?: CustomRowMenuContents,
};

export type State = {
    menuOpen: ?boolean,
};
