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
});

type FieldContainer = {
    field: React.Element<any>,
    placement: $Values<typeof placements>,
};

type Props = {
    id: string,
    itemId: string,
    formFoundation: ?RenderFoundation,
    completeButton?: ?React.Element<any>,
    saveButton?: ?React.Element<any>,
    cancelButton?: ?React.Element<any>,
    fields?: ?Array<FieldContainer>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    classes: Object,
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

        const topFields = this.getFieldWithPlacement(placements.TOP);
        const bottomFields = this.getFieldWithPlacement(placements.BOTTOM);

        return (
            <div>
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
