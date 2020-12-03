// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import placements from '../constants/placements.const';
import DataEntryField from './internal/DataEntryField.component';
import getDataEntryKey from '../common/getDataEntryKey';
import { makeReselectComponentProps } from './withDataEntryField.selectors';

import type { ValidatorContainer } from './internal/dataEntryField.utils';

type FieldContainer = {
    field: React.Element<any>,
    placement: $Values<typeof placements>,
    section?: ?string,
};

type Props = {
    id: string,
    fields?: ?Array<React.Element<any>>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    dataEntryFieldRef?: ?(instance: any, key: string) => void,
    onUpdateDataEntryField?: ?(innerAction: ReduxAction<any, any>, data: { value: any }) => void,
};

type Settings = {
    getComponent: (props: Object) => React.ComponentType<any>,
    getComponentProps?: ?(props: Object) => Object,
    getPropName: (props: Object) => string,
    getValidatorContainers?: ?(props: Object) => Array<ValidatorContainer>,
    getMeta?: ?(props: Props) => Object,
    getIsHidden?: ?(props: Object) => boolean,
    getPassOnFieldData?: ?(props: Props) => boolean,
    getOnUpdateField?: ?(props: Object) => (innerAction: ReduxAction<any, any>, data: { value: any }) => void,
};


const getDataEntryField = (settings: Settings, InnerComponent: React.ComponentType<any>) => {
    class DataEntryFieldBuilder extends React.Component<Props> {
        reselectComponentProps: (?Object) => Object;
        constructor(props: Props) {
            super(props);
            this.reselectComponentProps = makeReselectComponentProps();
        }
        // $FlowFixMe[speculation-ambiguous] automated comment
        handleRef = (instance: DataEntryField) => {
            if (this.props.dataEntryFieldRef) {
                const { getPropName } = settings;
                const key = getPropName(this.props);

                if (!key) {
                    log.error(
                        errorCreator(
                            'data entry field needs a key, but no propName was specified')({}));
                    return;
                }
                // $FlowFixMe
                this.props.dataEntryFieldRef(instance, key);
            }
        };

        getFieldElement() {
            const { id, completionAttempted, saveAttempted, onUpdateDataEntryField } = this.props;
            const { getComponent, getComponentProps, getValidatorContainers, getPropName } = settings;

            const Component = getComponent(this.props);
            const componentProps = this.reselectComponentProps(getComponentProps && getComponentProps(this.props));
            const validatorContainers = (getValidatorContainers && getValidatorContainers(this.props)) || [];

            return (
                <DataEntryField
                    ref={this.handleRef}
                    dataEntryId={id}
                    completionAttempted={completionAttempted}
                    saveAttempted={saveAttempted}
                    Component={Component}
                    validatorContainers={validatorContainers}
                    propName={getPropName(this.props)}
                    onUpdateField={onUpdateDataEntryField}
                    componentProps={componentProps}
                />
            );
        }

        getFields() {
            const fields = this.props.fields;
            const { getMeta, getIsHidden } = settings;
            const meta = getMeta && getMeta(this.props);

            if (getIsHidden && getIsHidden(this.props)) return fields ? [...fields] : [];

            const fieldContainer: FieldContainer = {
                field: this.getFieldElement(),
                placement: (meta && meta.placement) || placements.TOP,
                section: meta && meta.section,
            };

            return fields ? [...fields, fieldContainer] : [fieldContainer];
        }

        render() {
            const {
                fields,
                ...passOnProps
            } = this.props;

            return (
                <div>
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <InnerComponent
                        fields={this.getFields()}
                        {...passOnProps}
                    />
                </div>
            );
        }
    }
    return DataEntryFieldBuilder;
};

const getMapStateToProps = (settings: Settings) => (state: ReduxState, props: Object) => {
    let passOnFieldDataProp;
    const { getPassOnFieldData, getPropName } = settings;
    if (getPassOnFieldData && getPassOnFieldData(props)) {
        const propName = getPropName(props);
        const itemId = state.dataEntries[props.id].itemId;
        const key = getDataEntryKey(props.id, itemId);
        const value = state.dataEntriesFieldsValue[key][propName];
        passOnFieldDataProp = {
            [`${propName}DataEntryFieldValue`]: value,
        };
    }

    return {
        ...passOnFieldDataProp,
    };
};


export default (settings: Settings) =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowFixMe
        connect(getMapStateToProps(settings), () => ({}))(
            getDataEntryField(settings, InnerComponent),
        );
