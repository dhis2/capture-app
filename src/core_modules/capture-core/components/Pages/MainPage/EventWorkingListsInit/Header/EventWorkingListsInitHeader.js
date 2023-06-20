// @flow
import { colors, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import type { Props } from './eventWorkingListsInitHeader.types';

const getStyles = () => ({
    container: {
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
        padding: spacers.dp16,
    },
    headerContainer: {
        marginBottom: spacers.dp16,
    },
    title: {
        fontSize: 16,
        color: colors.grey800,
        fontWeight: 500,
    },
});

const EventWorkingListsInitHeaderPlain =
    ({ children, classes: { container, headerContainer, listContainer, title } }: Props) => (
        <div className={container}>
            <div
                className={headerContainer}
            >
                <span
                    className={title}
                >
                    {i18n.t('Registered events')}
                </span>
            </div>
            <div
                className={listContainer}
            >
                {children}
            </div>
        </div>
    );

export const EventWorkingListsInitHeader: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(EventWorkingListsInitHeaderPlain);
