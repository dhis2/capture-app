// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { EnrollmentRegistrationEntry, SingleEventRegistrationEntry }
    from 'capture-core/components/DataEntries';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { scopeTypes } from '../../metaData';
import { useScopeInfo } from '../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope }
    from '../DataEntries/common/useRegistrationFormInfoForSelectedScope';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';
import { Widget } from '../Widget';
import type { Props } from './WidgetAddEvent.types';

const styles = () => ({
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
});

const WidgetAddEventPlain = ({ programStage, currentScopeId, resultsPageSize, classes }: Props) => {
    const { icon, stageForm } = programStage;
    const { scopeType } = useScopeInfo(currentScopeId);
    const { registrationMetaData } = useRegistrationFormInfoForSelectedScope(currentScopeId);

    const onSaveRegistrationEntry = () => {};
    const renderDuplicatesDialogActions = () => <></>;
    const renderDuplicatesCardActions = () => <></>;

    return (
        <Widget
            noncollapsible
            header={
                <div className={classes.header}>
                    {icon && (
                        <div className={classes.icon}>
                            <NonBundledDhis2Icon
                                name={icon?.name}
                                color={icon?.color}
                                width={30}
                                height={30}
                                cornerRadius={2}
                            />
                        </div>
                    )}
                    <span> {stageForm.name} </span>
                </div>
            }

        >
            <div data-test="add-event-form">
                {scopeType === scopeTypes.TRACKER_PROGRAM && <EnrollmentRegistrationEntry
                    id="newEventId"
                    selectedScopeId={currentScopeId}
                    enrollmentMetadata={registrationMetaData}
                    saveButtonText={i18n.t('Save new')}
                    onSave={onSaveRegistrationEntry}
                    duplicatesReviewPageSize={resultsPageSize}
                    renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                    renderDuplicatesCardActions={renderDuplicatesCardActions}
                />}
                {
                    scopeType === scopeTypes.EVENT_PROGRAM &&
                    <SingleEventRegistrationEntry
                        id="singleEvent"
                    />
                }
            </div>
        </Widget>
    );
};

export const WidgetAddEvent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(WidgetAddEventPlain);
