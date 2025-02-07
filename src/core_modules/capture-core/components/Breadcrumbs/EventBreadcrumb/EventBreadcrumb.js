// @flow
import React, { type ComponentType, useCallback, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, IconChevronRight16 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { BreadcrumbItem } from '../common/BreadcrumbItem';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';
import { useWorkingListLabel } from './hooks/useWorkingListLabel';

export const pageKeys = Object.freeze({
    MAIN_PAGE: 'mainPage',
    VIEW_EVENT: 'viewEvent',
    EDIT_EVENT: 'editEvent',
});

type Props = {
    page: string,
    programId: string,
    userInteractionInProgress?: boolean,
    onBackToMainPage?: () => void,
    onBackToViewEvent?: () => void,
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
    },
};


const EventBreadcrumbPlain = ({
    page,
    programId,
    userInteractionInProgress,
    onBackToViewEvent,
    onBackToMainPage,
    classes,
}) => {
    const [openWarning, setOpenWarning] = useState(null);
    const { label } = useWorkingListLabel({ programId });

    const handleNavigation = useCallback((callback, warningType) => {
        if (userInteractionInProgress) {
            setOpenWarning(warningType);
        } else {
            callback && callback();
        }
    }, [userInteractionInProgress]);

    const breadcrumbItems = useMemo(() => ([
        {
            key: pageKeys.MAIN_PAGE,
            onClick: () => handleNavigation(onBackToMainPage, pageKeys.MAIN_PAGE),
            label,
            selected: page === pageKeys.MAIN_PAGE,
            condition: true,
        },
        {
            key: pageKeys.VIEW_EVENT,
            onClick: () => handleNavigation(onBackToViewEvent, pageKeys.VIEW_EVENT),
            label: i18n.t('View event'),
            selected: page === pageKeys.VIEW_EVENT,
            condition: page === pageKeys.VIEW_EVENT || page === pageKeys.EDIT_EVENT,
        },
        {
            key: pageKeys.EDIT_EVENT,
            onClick: () => {},
            label: i18n.t('Edit event'),
            selected: page === pageKeys.EDIT_EVENT,
            condition: page === pageKeys.EDIT_EVENT,
        },
    ].filter(item => item.condition !== false)), [
        label,
        handleNavigation,
        onBackToViewEvent,
        onBackToMainPage,
        page,
    ]);

    return (
        <div className={classes.container}>
            {breadcrumbItems.map((button, index) => (
                <React.Fragment key={button.key}>
                    <BreadcrumbItem
                        label={button.label}
                        onClick={button.onClick}
                        selected={button.selected}
                        classes={classes}
                    />
                    {index < (breadcrumbItems.length - 1) && (
                        <IconChevronRight16 color={colors.grey800} />
                    )}
                </React.Fragment>
            ))}

            <DiscardDialog
                open={openWarning === pageKeys.MAIN_PAGE}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToMainPage && onBackToMainPage();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />
            <DiscardDialog
                open={openWarning === pageKeys.VIEW_EVENT}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToViewEvent && onBackToViewEvent();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />
        </div>
    );
};


export const EventBreadcrumb: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(EventBreadcrumbPlain);
