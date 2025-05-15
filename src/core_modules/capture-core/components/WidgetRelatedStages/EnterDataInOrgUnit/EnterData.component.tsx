import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors, spacers, spacersNum, IconInfo16 } from '@dhis2/ui';
import { OrgUnitSelectorForRelatedStages } from '../FormComponents';
import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';

const styles: Readonly<any> = {
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
    infoBox: {
        margin: '8px 8px',
        display: 'flex',
        fontSize: '14px',
        gap: '5px',
        background: colors.grey100,
        padding: '12px 8px',
        border: `1px solid ${colors.grey600}`,
    },
};

type Props = {
    linkableStageLabel: string;
    relatedStagesDataValues: RelatedStageDataValueStates;
    setRelatedStagesDataValues: (callback: (prevValues: RelatedStageDataValueStates) => RelatedStageDataValueStates) => void;
    saveAttempted: boolean;
    errorMessages: ErrorMessagesForRelatedStages;
    classes?: {
        wrapper?: string;
        fieldWrapper?: string;
        fieldLabel?: string;
        fieldContent?: string;
        alternateColor?: string;
        infoBox?: string;
    };
}

export const EnterDataInOrgUnitPlain = ({
    linkableStageLabel,
    relatedStagesDataValues,
    setRelatedStagesDataValues,
    saveAttempted,
    errorMessages,
    classes = {},
}: Props) => {
    const onSelectOrgUnit = (e: { id: string; displayName: string; path: string }) => {
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
            orgUnit: undefined,
        }));
    };

    return (
        <div className={classes.wrapper}>
            <div>
                <OrgUnitSelectorForRelatedStages
                    relatedStagesDataValues={relatedStagesDataValues}
                    onSelectOrgUnit={onSelectOrgUnit}
                    onDeselectOrgUnit={onDeselectOrgUnit}
                    errorMessages={errorMessages}
                    saveAttempted={saveAttempted}
                />
            </div>
            <div className={classes.infoBox}>
                <IconInfo16 />
                {i18n.t(
                    relatedStagesDataValues?.orgUnit?.name
                        ? 'Enter {{linkableStageLabel}} details for {{orgUnitLabel}} in the next step'
                        : 'Select organisation unit and enter {{linkableStageLabel}} details in the next step',
                    {
                        linkableStageLabel,
                        orgUnitLabel: relatedStagesDataValues?.orgUnit?.name,
                    },
                )}
            </div>
        </div>
    );
};

export const EnterDataInOrgUnit = withStyles(styles)(EnterDataInOrgUnitPlain) as ComponentType<Props>;
