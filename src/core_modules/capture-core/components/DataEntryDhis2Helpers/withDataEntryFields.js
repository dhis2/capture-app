// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { placements } from '../DataEntry/constants/placements.const';
import { DataEntryField } from '../DataEntry/dataEntryField/internal/DataEntryField.component';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';
import { makeReselectComponentProps } from '../DataEntry/dataEntryField/withDataEntryField.selectors';

import type { ValidatorContainer } from '../DataEntry/dataEntryField/internal/dataEntryField.utils';

type Props = {
    id: string,
    fields?: ?Array<React.Element<any>>,
    rawFields?: ?Array<any>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    dataEntryFieldRef?: ?(instance: any, key: string) => void,
    onUpdateDataEntryField?: ?(innerAction: ReduxAction<any, any>, data: { value: any }) => void,
};

type Settings = {
    getComponent: (props: Object) => React.ComponentType<any>,
    getComponentProps?: ?(props: Object, extraProps?: any) => Object,
    getPropName: (props: Object) => string,
    getValidatorContainers?: ?(props: Object) => Array<ValidatorContainer>,
    getMeta?: ?(props: Props) => Object,
    getIsHidden?: ?(props: Object) => boolean,
    getPassOnFieldData?: ?(props: Props) => boolean,
    getOnUpdateField?: ?(props: Object) => (innerAction: ReduxAction<any, any>, data: { value: any }) => void,
    getConverter?: ?(props: Object) => (value: any) => string
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

        getFieldElement(customProps?: Object, customPropsName?: Function, converter?: Function) {
            const { id, completionAttempted, saveAttempted, onUpdateDataEntryField } = this.props;
            const { getComponent, getComponentProps, getValidatorContainers, getPropName } = settings;

            const Component = getComponent(this.props);
            const componentProps = this.reselectComponentProps(getComponentProps && getComponentProps(this.props, converter));
            const validatorContainers = (getValidatorContainers && getValidatorContainers(this.props)) || [];
            const propName = customPropsName ?? getPropName(this.props);
            return (
                <DataEntryField
                    ref={this.handleRef}
                    dataEntryId={id}
                    completionAttempted={completionAttempted}
                    saveAttempted={saveAttempted}
                    Component={Component}
                    validatorContainers={validatorContainers}
                    propName={propName}
                    onUpdateField={onUpdateDataEntryField}
                    componentProps={{ ...componentProps, ...customProps }}
                />
            );
        }

        getFieldElementFromProps(field: Object) {
            const { id: fieldId } = field;
            const { getPropName, getMeta, getConverter } = settings;
            const meta = getMeta && getMeta(this.props);
            const converter = getConverter && getConverter(field);
            const fieldContainer = this.getFieldElement(field, `${getPropName(this.props)}-${fieldId}`, converter);
            const metaData = meta ? {
                placement: meta.placement ?? placements.TOP,
                section: meta.section,
                sectionName: meta.sectionName,
            } : null;
            return {
                field: fieldContainer,
                ...metaData,
            };
        }

        getFields() {
            const { getIsHidden } = settings;
            const { fields, rawFields } = this.props;
            if (getIsHidden && getIsHidden(this.props)) return fields ? [...fields] : [];

            const allFields = [];
            if (rawFields) {
                allFields.push(...rawFields.map(field => this.getFieldElementFromProps(field)));
            }
            if (fields) {
                allFields.push(...fields);
            }

            return allFields;
        }

        render() {
            const { fields, rawFields, ...passOnProps } = this.props;

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


export const withDataEntryFields = (settings: Settings) =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowFixMe
        connect(getMapStateToProps(settings), () => ({}))(
            getDataEntryField(settings, InnerComponent),
        );
