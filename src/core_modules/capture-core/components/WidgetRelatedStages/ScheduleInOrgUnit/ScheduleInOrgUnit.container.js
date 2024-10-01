// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { convertStringToDateFormat } from '../../../utils/converters/date';
import { DateFieldForRelatedStages, OrgUnitSelectorForRelatedStages } from '../FormComponents';
import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';

const styles = {
    wrapper: {
        padding: `${spacers.dp16} 0`,
        maxWidth: '55.75rem',
    },
    fieldWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'start',
        justifyContent: 'space-between',
        padding: `${spacers.dp8}  ${spacers.dp16}`,
    },
    fieldLabel: {
        color: colors.grey900,
        paddingTop: spacersNum.dp12,
        paddingRight: spacersNum.dp16,
        flexBasis: '200px',
    },
    fieldContent: {
        flexBasis: '150px',
        flexGrow: 1,
    },
    alternateColor: {
        backgroundColor: colors.grey100,
    },
};

type Props = {
    relatedStagesDataValues: RelatedStageDataValueStates,
    setRelatedStagesDataValues: (() => Object) => void,
    errorMessages: ErrorMessagesForRelatedStages,
    scheduledLabel: string,
    saveAttempted: boolean,
    ...CssClasses,
}

export const ScheduleInOrgUnitPlain = ({
    relatedStagesDataValues,
    setRelatedStagesDataValues,
    saveAttempted,
    errorMessages,
    scheduledLabel,
    classes,
}: Props) => {
    const onBlurDateField = (e) => {
        setRelatedStagesDataValues(prevValues => ({
            ...prevValues,
            scheduledAt: convertStringToDateFormat(e),
        }));
    };

    const onSelectOrgUnit = (e: { id: string, displayName: string, path: string }) => {
        const orgUnit = {
            id: e.id,
            name: e.displayName,
            path: e.path,
        };

        setRelatedStagesDataValues(prevValues => ({
            ...prevValues,
            orgUnit,
        }));
    };

    const onDeselectOrgUnit = () => {
        setRelatedStagesDataValues(prevValues => ({
            ...prevValues,
            orgUnit: null,
        }));
    };

    return (
        <div className={classes.wrapper}>
            <div>
                <DateFieldForRelatedStages
                    scheduledLabel={scheduledLabel}
                    errorMessages={errorMessages}
                    saveAttempted={saveAttempted}
                    onBlurDateField={onBlurDateField}
                    relatedStagesDataValues={relatedStagesDataValues}
                />
            </div>

            <div>
                <OrgUnitSelectorForRelatedStages
                    relatedStagesDataValues={relatedStagesDataValues}
                    onSelectOrgUnit={onSelectOrgUnit}
                    onDeselectOrgUnit={onDeselectOrgUnit}
                    errorMessages={errorMessages}
                    saveAttempted={saveAttempted}
                />
            </div>
        </div>
    );
};

export const ScheduleInOrgUnit: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ScheduleInOrgUnitPlain);
