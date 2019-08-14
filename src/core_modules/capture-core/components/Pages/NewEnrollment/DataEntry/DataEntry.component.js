// @flow
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import i18n from '@dhis2/d2-i18n';

import {
    placements,
    inMemoryFileStore,
} from '../../../DataEntry';
import { Enrollment, RenderFoundation } from '../../../../metaData';
import {
    sectionKeysForEnrollmentDataEntry as dataEntrySectionKeys,
} from '../../../DataEntries';
import ConfiguredDataEntry from './ConfiguredDataEntry.component';
import newEnrollmentSaveTypes from './newEnrollmentSaveTypes';

const getStyles = theme => ({
    savingContextContainer: {
        paddingTop: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.grey.dark,
        fontSize: theme.typography.pxToRem(13),
    },
    savingContextText: {
        paddingLeft: theme.typography.pxToRem(10),
    },
    topButtonsContainer: {
        display: 'flex',
        flexFlow: 'row-reverse',
    },
    horizontal: {
        padding: theme.typography.pxToRem(10),
        paddingTop: theme.typography.pxToRem(20),
        paddingBottom: theme.typography.pxToRem(15),
    },
    fieldLabelMediaBased: {
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
    dataEntryVerticalContainer: {
        padding: theme.typography.pxToRem(8),
    },
});

type Props = {
    enrollmentMetadata: Enrollment,
    programName: string,
    orgUnitName: string,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSetSaveTypes: (saveTypes: ?Array<$Values<typeof newEnrollmentSaveTypes>>) => void,
    onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
    onSaveAndAddAnother: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
    onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
    onCancel: () => void,
    classes: {
        savingContextContainer: string,
        savingContextText: string,
        topButtonsContainer: string,
        horizontalPaper: string,
        dataEntryVerticalContainer: string,
        fieldLabelMediaBased: string,
        horizontal: string,
    },
    theme: Theme,
    formHorizontal: ?boolean,
};
type DataEntrySection = {
    placement: $Values<typeof placements>,
    name: string,
};

const dataEntrySectionDefinitions = {
    [dataEntrySectionKeys.ENROLLMENT]: {
        placement: placements.TOP,
        name: i18n.t('Enrollment'),
    },
};

class NewEnrollmentDataEntry extends Component<Props> {
    fieldOptions: { theme: Theme };
    dataEntrySections: { [$Values<typeof dataEntrySectionKeys>]: DataEntrySection };

    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
        this.dataEntrySections = dataEntrySectionDefinitions;
    }

    componentWillMount() {
        // this.props.onSetSaveTypes(null);
    }

    componentWillUnmount() {
        inMemoryFileStore.clear();
    }

    handleSave = (itemId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: ?string) => {
        if (saveType === newEnrollmentSaveTypes.SAVEANDADDANOTHER) {
            if (!this.props.formHorizontal) {
                this.props.onSetSaveTypes([
                    newEnrollmentSaveTypes.SAVEANDADDANOTHER,
                    newEnrollmentSaveTypes.SAVEANDEXIT],
                );
            }
            this.props.onSaveAndAddAnother(itemId, dataEntryId, formFoundation);
        } else if (saveType === newEnrollmentSaveTypes.SAVEANDEXIT) {
            this.props.onSave(itemId, dataEntryId, formFoundation);
        }
    }

    getSavingText() {
        const { orgUnitName, programName, enrollmentMetadata } = this.props;
        const translatedText = i18n.t('Creating a new {{TET}} in {{program}} in {{orgUnit}}', {
            TET: enrollmentMetadata.trackedEntityType.name,
            program: programName,
            orgUnit: orgUnitName,
        });

        return translatedText;
    }

    renderHorizontal = () => {
        const classes = this.props.classes;
        return (
            <div
                className={classes.horizontal}
            >
                {this.renderContent()}
            </div>
        );
    }

    renderVertical = () => (<div className={this.props.classes.dataEntryVerticalContainer}>{this.renderContent()}</div>);

    renderContent = () => {
        const {
            onUpdateField,
            onStartAsyncUpdateField,
            programName, // eslint-disable-line
            orgUnitName, // eslint-disable-line
            classes,
            onSave,
            onSetSaveTypes,
            onSaveAndAddAnother,
            theme,
            enrollmentMetadata,
            ...passOnProps
        } = this.props;
        return (
            <div>
                <div>
                    <ConfiguredDataEntry
                        id={'enrollment'}
                        onUpdateFormField={onUpdateField}
                        onUpdateFormFieldAsync={onStartAsyncUpdateField}
                        onSave={this.handleSave}
                        fieldOptions={this.fieldOptions}
                        dataEntrySections={this.dataEntrySections}
                        enrollmentMetadata={enrollmentMetadata}
                        {...passOnProps}
                    />
                </div>
                <div
                    className={classes.savingContextContainer}
                >
                    <InfoIcon />
                    <div
                        className={classes.savingContextText}
                    >
                        {this.getSavingText()}
                    </div>
                </div>
            </div>
        );
    }


    render() {
        return (
            <div>
                {this.props.formHorizontal ? this.renderHorizontal() : this.renderVertical()}
            </div>
        );
    }
}

// $FlowFixMe
export default withStyles(getStyles)(withTheme()(NewEnrollmentDataEntry));
