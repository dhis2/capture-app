// @flow
import React, { type ComponentType, useCallback, useMemo, useState } from 'react';
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
            key: 'mainPage',
            onClick: () => handleNavigation(onBackToMainPage, 'mainPage'),
            label,
            selected: page === pageKeys.MAIN_PAGE,
            condition: true,
        },
        {
            key: 'viewEvent',
            onClick: () => handleNavigation(null, 'viewEvent'),
            label: 'View event',
            selected: page === pageKeys.VIEW_EVENT,
            condition: page === pageKeys.VIEW_EVENT || page === pageKeys.EDIT_EVENT,
        },
        {
            key: 'editEvent',
            onClick: () => {},
            label: 'Edit event',
            selected: page === pageKeys.EDIT_EVENT,
            condition: page === pageKeys.EDIT_EVENT,
        },
    ].filter(item => item.condition !== false)), [
        label,
        handleNavigation,
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
                open={openWarning === 'mainPage'}
                onCancel={() => setOpenWarning(null)}
                onDestroy={onBackToMainPage}
                {...defaultDialogProps}
            />
        </div>
    );
};


export const EventBreadcrumb: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(EventBreadcrumbPlain);
