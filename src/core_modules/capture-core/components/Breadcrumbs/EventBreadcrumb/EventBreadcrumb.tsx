import React, { ComponentType, useCallback, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors } from '@dhis2/ui';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { RtlChevron } from '../../../utils/rtl';
import { BreadcrumbItem } from '../common/BreadcrumbItem';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';
import { useWorkingListLabel } from './hooks/useWorkingListLabel';

export const pageKeys = {
    MAIN_PAGE: 'mainPage',
    VIEW_EVENT: 'viewEvent',
    EDIT_EVENT: 'editEvent',
} as const;

type PageKeys = typeof pageKeys[keyof typeof pageKeys];

type OwnProps = {
    page: PageKeys;
    programId: string;
    userInteractionInProgress?: boolean;
    onBackToMainPage?: () => void;
    onBackToViewEvent?: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

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
}: Props) => {
    const [openWarning, setOpenWarning] = useState<PageKeys | null>(null);
    const { label } = useWorkingListLabel({ programId });

    const handleNavigation = useCallback((callback?: () => void, warningType?: PageKeys) => {
        if (userInteractionInProgress && warningType) {
            setOpenWarning(warningType);
        } else {
            callback?.();
        }
    }, [userInteractionInProgress]);

    type BreadcrumbItemType = {
        key: PageKeys;
        onClick: () => void;
        label: string;
        selected: boolean;
        condition: boolean;
    };

    const breadcrumbItems = useMemo<BreadcrumbItemType[]>(() => ([
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
            onClick: () => undefined,
            label: i18n.t('Edit event'),
            selected: page === pageKeys.EDIT_EVENT,
            condition: page === pageKeys.EDIT_EVENT,
        },
    ] as BreadcrumbItemType[]).filter((item): item is BreadcrumbItemType => item.condition), [
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
                        dataTest={`event-breadcrumb-${button.key}-item`}
                    />
                    {index < (breadcrumbItems.length - 1) && (
                        <RtlChevron color={colors.grey800} />
                    )}
                </React.Fragment>
            ))}

            <DiscardDialog
                open={openWarning === pageKeys.MAIN_PAGE}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToMainPage?.();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />
            <DiscardDialog
                open={openWarning === pageKeys.VIEW_EVENT}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToViewEvent?.();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />
        </div>
    );
};

export const EventBreadcrumb = withStyles(styles)(EventBreadcrumbPlain) as ComponentType<OwnProps>;
