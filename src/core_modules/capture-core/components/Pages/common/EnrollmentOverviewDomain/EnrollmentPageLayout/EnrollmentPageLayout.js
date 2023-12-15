// @flow
import React, { useCallback, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { useWidgetColumns } from './hooks/useWidgetColumns';
import { AddRelationshipRefWrapper } from './AddRelationshipRefWrapper';
import type { PlainProps } from '../../../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';
import { DefaultPageTitle, EnrollmentPageKeys } from './DefaultEnrollmentLayout.constants';

const getEnrollmentPageStyles = () => ({
    container: {
        padding: '16px 24px 16px 24px',
    },
    contentContainer: {
        position: 'relative',
    },
    columns: {
        display: 'flex',
        gap: spacers.dp16,
    },
    leftColumn: {
        flexGrow: 3,
        flexShrink: 1,
        width: 872,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp16,
    },
    rightColumn: {
        flexGrow: 1,
        flexShrink: 1,
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp16,
    },
    title: {
        fontSize: '1.25rem',
        color: colors.grey900,
        fontWeight: 500,
        paddingTop: spacersNum.dp8,
        paddingBottom: spacersNum.dp16,
    },
});

const getTitle = (inputTitle, page) => {
    const title = inputTitle || i18n.t('Enrollment');
    const titles = {
        [EnrollmentPageKeys.OVERVIEW]: !inputTitle ? `${title} ${DefaultPageTitle.OVERVIEW}` : title,
        [EnrollmentPageKeys.NEW_EVENT]: `${title}: ${DefaultPageTitle.NEW_EVENT}`,
        [EnrollmentPageKeys.EDIT_EVENT]: `${title}: ${DefaultPageTitle.EDIT_EVENT}`,
        [EnrollmentPageKeys.VIEW_EVENT]: `${title}: ${DefaultPageTitle.VIEW_EVENT}`,
    };
    return titles[page] || title;
};

const EnrollmentPageLayoutPlain = ({
    pageLayout,
    availableWidgets,
    currentPage,
    classes,
    ...passOnProps
}: PlainProps) => {
    const [mainContentVisible, setMainContentVisibility] = useState(true);
    const [addRelationShipContainerElement, setAddRelationshipContainerElement] =
        useState<HTMLDivElement | void>(undefined);
    const toggleVisibility = useCallback(() => setMainContentVisibility(current => !current), []);

    const allProps = useMemo(() => ({
        ...passOnProps,
        toggleVisibility,
        addRelationShipContainerElement,
    }), [addRelationShipContainerElement, passOnProps, toggleVisibility]);

    const {
        leftColumnWidgets,
        rightColumnWidgets,
    } = useWidgetColumns({
        pageLayout,
        availableWidgets,
        props: allProps,
    });

    return (
        <div className={classes.container}>
            <AddRelationshipRefWrapper setRelationshipRef={setAddRelationshipContainerElement} />
            <div
                className={classes.contentContainer}
                style={!mainContentVisible ? { display: 'none' } : undefined}
            >
                <div className={classes.title}>{getTitle(pageLayout.title, currentPage)}</div>
                <div className={classes.columns}>
                    {pageLayout.leftColumn && !!leftColumnWidgets?.length && (
                        <div className={classes.leftColumn}>
                            {leftColumnWidgets}
                        </div>
                    )}
                    {pageLayout.rightColumn && !!rightColumnWidgets?.length && (
                        <div className={classes.rightColumn}>
                            {rightColumnWidgets}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const EnrollmentPageLayout = withStyles(
    getEnrollmentPageStyles,
)(EnrollmentPageLayoutPlain);
