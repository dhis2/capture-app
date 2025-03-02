// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import { theme } from '../../../../../../styles/theme';
import type { Props } from './EnrollmentAddEventPageDefault.types';
import { EnrollmentPageLayout } from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import {
    EnrollmentPageKeys,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';

export const EnrollmentAddEventPageDefaultComponent = ({
    pageLayout,
    availableWidgets,
    program,
    stageId,
    orgUnitId,
    teiId,
    enrollmentId,
    widgetEffects,
    hideWidgets,
    onDelete,
    onAddNew,
    onEnrollmentError,
    onEnrollmentSuccess,
    pageFailure,
    ready,
    onAccessLostFromTransfer,
    ...passOnProps
}: Props) => {
    if (pageFailure) {
        return (
            <div>
                {i18n.t('There was an error loading the page')}
            </div>
        );
    }

    if (!ready) {
        return null;
    }
    return (
        <div className="container">
            <EnrollmentPageLayout
                {...passOnProps}
                currentPage={EnrollmentPageKeys.NEW_EVENT}
                program={program}
                pageLayout={pageLayout}
                stageId={stageId}
                availableWidgets={availableWidgets}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
                widgetEffects={widgetEffects}
                hideWidgets={hideWidgets}
                onDelete={onDelete}
                onAddNew={onAddNew}
                onEnrollmentError={onEnrollmentError}
                onEnrollmentSuccess={onEnrollmentSuccess}
                onAccessLostFromTransfer={onAccessLostFromTransfer}
                feedbackEmptyText={i18n.t('No feedback for this event yet')}
                indicatorEmptyText={i18n.t('No indicator output for this event yet')}
            />

            <style jsx>{`
                .container {
                    padding: 16px 24px 16px 24px;
                }
                
                .columns {
                    display: flex;
                }
                
                .left-column {
                    flex-grow: 3;
                    flex-shrink: 1;
                    width: 872px;
                }
                
                .right-column {
                    flex-grow: 1;
                    flex-shrink: 1;
                    padding-left: ${spacersNum.dp16}px;
                    width: 360px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .title {
                    font-size: ${theme.typography.title.fontSize};
                    font-weight: ${theme.typography.title.fontWeight};
                    line-height: ${theme.typography.title.lineHeight};
                    color: ${theme.typography.title.color};
                    margin: ${spacersNum.dp16}px 0;
                }
            `}</style>
        </div>
    );
};

