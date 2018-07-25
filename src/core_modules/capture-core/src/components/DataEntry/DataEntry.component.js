// @flow
/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import D2Form from '../D2Form/D2Form.component';
import { placements } from './dataEntryField/dataEntryField.const';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import getDataEntryKey from './common/getDataEntryKey';

const styles = theme => ({
    footerBar: {
        display: 'flex',
    },
    button: {
        paddingRight: theme.spacing.unit * 2,
    },
    horizontalFormContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    verticalDataEntryContainer: {
        flexGrow: 1,
    },
    verticalContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

type FieldContainer = {
    field: React.Element<any>,
    placement: $Values<typeof placements>,
};

type DirectionClasses = {
    container?: ?string,
    dataEntryContainer?: ?string,
    infoWidgetsContainer?: ?string,
    infoWidgetsInnerContainer?: ?string,
    formContainer?: ?string,
}

type Props = {
    id: string,
    itemId: string,
    formFoundation: ?RenderFoundation,
    completeButton?: ?React.Element<any>,
    saveButton?: ?React.Element<any>,
    cancelButton?: ?React.Element<any>,
    fields?: ?Array<FieldContainer>,
    infoWidgets?: ?Array<any>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    classes: Object,
    formHorizontal: ?boolean,
    onUpdateFieldInner: (
        action: ReduxAction<any, any>,
    ) => void,
    onUpdateFormField?: ?(
        innerAction: ReduxAction<any, any>,
    ) => void,
    onUpdateFormFieldAsync: (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        formId: string,
        callback: Function,
        dataEntryId: string,
        itemId: string,
    ) => void,

};

class DataEntry extends React.Component<Props> {
    static errorMessages = {
        NO_ITEM_SELECTED: 'No item selected',
        FORM_FOUNDATION_MISSING: 'form foundation missing. see log for details',
    };

    formInstance: ?D2Form;

    getWrappedInstance() {
        return this.formInstance;
    }

    handleUpdateField = (...args) => {
        this.props.onUpdateFieldInner(...args, this.props.id, this.props.itemId, this.props.onUpdateFormField);
    }

    getClasses = (): DirectionClasses => {
        const { classes, formHorizontal } = this.props;
        if (formHorizontal) {
            return {
                formContainer: classes.horizontalFormContainer,
                infoWidgetsContainer: classes.horizontalWidgetsContainer,
            };
        }
        return {
            container: classes.verticalContainer,
            dataEntryContainer: classes.verticalDataEntryContainer,
        };
    }

    handleUpdateFieldAsync = (...args) => {
        this.props.onUpdateFormFieldAsync(...args, this.props.id, this.props.itemId);
    }

    getFieldWithPlacement(placement: $Values<typeof placements>) {
        const fields = this.props.fields;

        return fields ?
            fields
                .filter(fieldContainer => fieldContainer.placement === placement)
                .map(fieldContainer => fieldContainer.field)
            : null;
    }

    render() {
        const {
            id,
            classes,
            itemId,
            formFoundation,
            completeButton,
            saveButton,
            cancelButton,
            completionAttempted,
            saveAttempted,
            fields,
            onUpdateFormField,
            onUpdateFieldInner,
            onUpdateFormFieldAsync,
            ...passOnProps } = this.props;

        if (!itemId) {
            return (
                <div>
                    {DataEntry.errorMessages.NO_ITEM_SELECTED}
                </div>
            );
        }

        if (!formFoundation) {
            return (
                <div>
                    {DataEntry.errorMessages.FORM_FOUNDATION_MISSING}
                </div>
            );
        }
        const directionClasses = this.getClasses();

        const topFields = this.getFieldWithPlacement(placements.TOP);
        const bottomFields = this.getFieldWithPlacement(placements.BOTTOM);
        const infoWidgets = this.props.infoWidgets;
        return (
            <div className={directionClasses.container}>
                <div className={directionClasses.dataEntryContainer}>
                    <div className={directionClasses.formContainer}>
                        {topFields}
                        <D2Form
                            innerRef={(formInstance) => { this.formInstance = formInstance; }}
                            formFoundation={formFoundation}
                            id={getDataEntryKey(id, itemId)}
                            validationAttempted={completionAttempted || saveAttempted}
                            onUpdateField={this.handleUpdateField}
                            onUpdateFieldAsync={this.handleUpdateFieldAsync}
                            {...passOnProps}
                        />
                        {bottomFields}
                    </div>
                    <div
                        className={classes.footerBar}
                    >
                        {
                            (() => {
                                if (completeButton) {
                                    return (
                                        <div
                                            className={classes.button}
                                        >
                                            { completeButton }
                                        </div>
                                    );
                                }
                                return null;
                            })()
                        }

                        {
                            (() => {
                                if (saveButton) {
                                    return (
                                        <div
                                            className={classes.button}
                                        >
                                            { saveButton }
                                        </div>
                                    );
                                }
                                return null;
                            })()
                        }

                        {
                            (() => {
                                if (cancelButton) {
                                    return (
                                        <div
                                            className={classes.button}
                                        >
                                            { cancelButton }
                                        </div>
                                    );
                                }
                                return null;
                            })()
                        }
                    </div>
                </div>
                <div className={directionClasses.infoWidgetsContainer}>
                    <div className={directionClasses.infoWidgetsInnerContainer}>
                        {infoWidgets}
                    </div>
                </div>
            </div>
        );
    }
}

const StylesHOC = withStyles(styles)(DataEntry);

type ContainerProps = {

};

class DataEntryContainer extends React.Component<ContainerProps> {
    dataEntryInstance: DataEntry;

    getWrappedInstance() {
        return this.dataEntryInstance;
    }

    render() {
        return (
            <StylesHOC
                innerRef={(dataEntryInstance) => {
                    this.dataEntryInstance = dataEntryInstance;
                }}
                {...this.props}
            />
        );
    }
}

export default DataEntryContainer;
