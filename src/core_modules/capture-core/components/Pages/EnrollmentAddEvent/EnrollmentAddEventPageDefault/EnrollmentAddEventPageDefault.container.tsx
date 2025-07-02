import React from 'react';
import { useLocationQuery } from '../../../../utils/routing';
import type { ContainerProps } from './EnrollmentAddEventPageDefault.types';
import { EnrollmentAddEventPageDefaultComponent } from './EnrollmentAddEventPageDefault.component';

const EnrollmentAddEventPageDefault = ({
    pageLayout,
    commonDataError,
}: ContainerProps) => {
    const { stageId, orgUnitId, teiId, enrollmentId } = useLocationQuery();

    const handleSave = () => {
    };

    const handleAction = () => {
    };

    return (
        <EnrollmentAddEventPageDefaultComponent
            program={null}
            stageId={stageId || ''}
            orgUnitId={orgUnitId || ''}
            teiId={teiId || ''}
            enrollmentId={enrollmentId || ''}
            onSave={handleSave}
            dataEntryHasChanges={false}
            userInteractionInProgress={false}
            onBackToMainPage={handleAction}
            onBackToDashboard={handleAction}
            onCancel={handleAction}
            onDelete={handleAction}
            onAddNew={handleAction}
            onEnrollmentError={handleAction}
            onEnrollmentSuccess={handleAction}
            onAccessLostFromTransfer={handleAction}
            widgetEffects={null}
            hideWidgets={{}}
            rulesExecutionDependencies={{}}
            pageFailure={commonDataError}
            ready={!commonDataError}
            widgetReducerName="enrollmentEvent"
            events={[]}
            onUpdateEnrollmentStatus={handleAction}
            onUpdateEnrollmentStatusSuccess={handleAction}
            onUpdateEnrollmentStatusError={handleAction}
            pageLayout={pageLayout}
            availableWidgets={{}}
            onDeleteTrackedEntitySuccess={handleAction}
            classes={{}}
        />
    );
};

export { EnrollmentAddEventPageDefault };
