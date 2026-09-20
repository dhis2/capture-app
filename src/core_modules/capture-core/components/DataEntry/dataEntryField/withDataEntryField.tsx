import * as React from 'react';
import { connect } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { placements } from '../constants/placements.const';
import { DataEntryField } from './internal/DataEntryField.component';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { makeReselectComponentProps } from './withDataEntryField.selectors';
import type { Props, Settings, FieldContainer } from './withDataEntryField.types';

const getDataEntryField = (settings: Settings, InnerComponent: React.ComponentType<any>) => {
    class DataEntryFieldBuilder extends React.Component<Props> {
        dataEntryFieldInstance?: any;
        reselectComponentProps: (componentProps?: Record<string, any>) => Record<string, any>;

        constructor(props: Props) {
            super(props);
            this.reselectComponentProps = makeReselectComponentProps();
        }

        handleRef = (instance: any) => {
            if (this.props.dataEntryFieldRef) {
                const { getPropName } = settings;
                const key = getPropName(this.props);

                this.dataEntryFieldInstance = instance;

                if (!key) {
                    log.error(
                        errorCreator(
                            'data entry field needs a key, but no propName was specified')({}));
                    return;
                }
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

        setField(value: any) {
            if (!this.dataEntryFieldInstance) {
                log.error(
                    errorCreator(
                        'No data entry field instance ')({}));
                return;
            }
            this.dataEntryFieldInstance.handleSet(value);
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
                pluginContext = {},
                ...passOnProps
            } = this.props;
            const key = settings.getPropName(this.props);
            const valueKey = `${key}DataEntryFieldValue`;
            delete passOnProps[valueKey];

            return (
                <div>
                    <InnerComponent
                        fields={this.getFields()}
                        pluginContext={{
                            [key]: {
                                setDataEntryFieldValue: this.setField.bind(this),
                                value: this.props[valueKey],
                            },
                            ...pluginContext,
                        }}
                        {...passOnProps}
                    />
                </div>
            );
        }
    }
    return DataEntryFieldBuilder;
};

// Default is to always pass the field's redux value through so it lands in
// `pluginContext.<propName>.value` for plugins. Settings may opt out with
// `getPassOnFieldData: () => false`.
const getMapStateToProps = (settings: Settings) => (state: any, props: Props) => {
    const { getPassOnFieldData, getPropName } = settings;
    const shouldPass = getPassOnFieldData ? getPassOnFieldData(props) : true;
    if (!shouldPass) return {};

    const dataEntry = state.dataEntries[props.id];
    if (!dataEntry) return {};

    const propName = getPropName(props);
    const key = getDataEntryKey(props.id, dataEntry.itemId);
    const value = state.dataEntriesFieldsValue[key]?.[propName];
    return { [`${propName}DataEntryFieldValue`]: value };
};


export const withDataEntryField = (settings: Settings) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(getMapStateToProps(settings), () => ({}))(
            getDataEntryField(settings, InnerComponent),
        );
