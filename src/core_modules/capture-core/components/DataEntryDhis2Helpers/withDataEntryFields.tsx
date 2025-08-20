import * as React from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { placements } from '../DataEntry/constants/placements.const';
import { DataEntryField } from '../DataEntry/dataEntryField/internal/DataEntryField.component';
import { makeReselectComponentProps } from '../DataEntry/dataEntryField/withDataEntryField.selectors';
import type { Props, Settings } from './withDataEntryFields.types';

const getDataEntryField = (settings: Settings, InnerComponent: React.ComponentType<any>) => {
    class DataEntryFieldBuilder extends React.Component<Props> {
        reselectComponentProps: (props?: any) => any;
        constructor(props: Props) {
            super(props);
            this.reselectComponentProps = makeReselectComponentProps();
        }

        getFieldElement(fieldId: string) {
            const { id, completionAttempted, saveAttempted, onUpdateDataEntryField } = this.props;
            const { getComponent, getComponentProps, getValidatorContainers, getPropName } = settings;

            const Component = getComponent(this.props);
            const componentProps = this.reselectComponentProps(getComponentProps?.(this.props, fieldId));
            const validatorContainers = getValidatorContainers?.(this.props, fieldId) || [];
            const key = getPropName(this.props, fieldId);

            const handleRef = (instance: any) => {
                if (this.props.dataEntryFieldRef) {
                    if (!key) {
                        log.error(
                            errorCreator(
                                'data entry field needs a key, but no propName was specified')({}));
                        return;
                    }
                    this.props.dataEntryFieldRef(instance, key);
                }
            };

            return (
                <DataEntryField
                    ref={handleRef}
                    dataEntryId={id}
                    completionAttempted={completionAttempted ?? undefined}
                    saveAttempted={saveAttempted ?? undefined}
                    Component={Component}
                    validatorContainers={validatorContainers}
                    propName={key}
                    onUpdateField={onUpdateDataEntryField}
                    componentProps={{ ...componentProps }}
                />
            );
        }

        getFieldElementFromProps(fieldId: string) {
            const { getMeta } = settings;
            const meta = getMeta?.(this.props);
            const fieldContainer = this.getFieldElement(fieldId);
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
            const { getIsHidden, getFieldIds } = settings;
            const { fields } = this.props;
            const fieldIds = getFieldIds?.(this.props) || [];

            if (getIsHidden?.(this.props)) return fields ? [...fields] : [];

            const otherFields = fieldIds ? [...fieldIds.map((fieldId: any) => this.getFieldElementFromProps(fieldId))] : [];
            return fields ? [...otherFields, ...fields] : [...otherFields];
        }

        render() {
            const { fields, ...passOnProps } = this.props;

            return (
                <div>
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


export const withDataEntryFields = (settings: Settings) =>
    (InnerComponent: React.ComponentType<any>) => getDataEntryField(settings, InnerComponent);
