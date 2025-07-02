import { colors, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { ReactNode } from 'react';

export const styles = () => ({
    container: {
        width: '100%',
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
        padding: spacers.dp16,
    },
    headerContainer: {
        marginBottom: spacers.dp16,
    },
    listContainer: {},
    title: {
        fontSize: 16,
        color: colors.grey800,
        fontWeight: 500,
    },
});

type Props = {
    children: ReactNode;
} & WithStyles<typeof styles>;

const EventWorkingListsInitHeaderPlain =
    ({ children, classes: { container, headerContainer, listContainer, title } }: Props) => (
        <div className={container}>
            <div
                className={headerContainer}
            >
                <span
                    className={title}
                >
                    {i18n.t('Registered events') as string}
                </span>
            </div>
            <div
                className={listContainer}
            >
                {children}
            </div>
        </div>
    );

export const EventWorkingListsInitHeader =
    withStyles(styles)(EventWorkingListsInitHeaderPlain) as ComponentType<Omit<Props, keyof WithStyles<typeof styles>>>;
