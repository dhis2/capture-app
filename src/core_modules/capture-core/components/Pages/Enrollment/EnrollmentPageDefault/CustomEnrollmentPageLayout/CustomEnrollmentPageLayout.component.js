// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './CustomEnrollmentPageLayout.types';
import { AddRelationshipRefWrapper } from '../../../EnrollmentEditEvent/AddRelationshipRefWrapper';
import { useCustomColumns } from './hooks/useCustomColumns';

const getEnrollmentPageDefaultStyles = () => ({
    container: {
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

export const CustomEnrollmentPageLayoutPlain = ({
    customPageLayoutConfig,
    classes,
    ...passOnProps
}: Props) => {
    const [mainContentVisible, setMainContentVisibility] = useState(true);
    const [addRelationShipContainerElement, setAddRelationshipContainerElement] =
        useState<HTMLDivElement | void>(undefined);
    const toggleVisibility = useCallback(() => setMainContentVisibility(current => !current), []);
    const allProps = useMemo(() => ({
        ...passOnProps,
        addRelationShipContainerElement,
        toggleVisibility,
    }), [addRelationShipContainerElement, passOnProps, toggleVisibility]);
    const {
        leftColumnWidgets,
        rightColumnWidgets,
    } = useCustomColumns({ customPageLayoutConfig, allProps });

    return (
        <>
            <AddRelationshipRefWrapper setRelationshipRef={setAddRelationshipContainerElement} />
            <div
                className={classes.container}
                style={!mainContentVisible ? { display: 'none' } : undefined}
            >
                <div className={classes.title}>{i18n.t('Enrollment Dashboard')}</div>
                <div className={classes.columns}>
                    {customPageLayoutConfig.leftColumn && (
                        <div className={classes.leftColumn}>
                            {leftColumnWidgets}
                        </div>
                    )}
                    {customPageLayoutConfig.rightColumn && (
                        <div className={classes.rightColumn}>
                            {rightColumnWidgets}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export const CustomEnrollmentPageLayout = withStyles(
    getEnrollmentPageDefaultStyles,
)(CustomEnrollmentPageLayoutPlain);
