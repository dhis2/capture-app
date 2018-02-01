// @flow
import React, { Component, PropTypes } from 'react';

import D2Section from './D2Section.component';
import MetaDataStage from '../../metaData/Stage/Stage';

type Props = {
    metaDataStage: MetaDataStage,
    dataId: string,
};

class D2Form extends Component<Props> {
    id: string;
    validateForm: () => void;
    sectionInstances: Map<string, D2Section>;

    constructor(props: Props) {
        super(props);

        const metaData = this.props.metaDataStage;
        this.id = metaData.id;

        this.validateForm = this.validateForm.bind(this);

        this.sectionInstances = new Map();
    }

    validateForm() {
        return Array.from(this.sectionInstances.entries())
            .map(entry => entry[1])
            .every((sectionInstance: D2Section) => {
                if (sectionInstance && sectionInstance.sectionFieldsInstance && sectionInstance.sectionFieldsInstance.getWrappedInstance() && sectionInstance.sectionFieldsInstance.getWrappedInstance().formBuilderInstance) {
                    const formBuilderInstance = sectionInstance.sectionFieldsInstance.getWrappedInstance().formBuilderInstance;
                    return formBuilderInstance.isValid();
                }
                return true;
            });
    }

    validateFormReturningFailedFields(): Array<any> {
        return Array.from(this.sectionInstances.entries())
            .map(entry => entry[1])
            .reduce((failedFormFields: Array<any>, sectionInstance: D2Section) => {
                if (sectionInstance && sectionInstance.sectionFieldsInstance && sectionInstance.sectionFieldsInstance.getWrappedInstance() && sectionInstance.sectionFieldsInstance.getWrappedInstance().formBuilderInstance) {
                    const formBuilderInstance = sectionInstance.sectionFieldsInstance.getWrappedInstance().formBuilderInstance;
                    if (!formBuilderInstance.isValid()) {
                        failedFormFields = [...failedFormFields, ...formBuilderInstance.getInvalidFields()];
                    }
                }
                return failedFormFields;
            }, []);
    }

    validateFormScrollToFirstFailedField() {
        const failedFields = this.validateFormReturningFailedFields();
        if (!failedFields || failedFields.length === 0) {
            return true;
        }

        const firstFailureInstance = failedFields[0].instance;
        firstFailureInstance.goto && firstFailureInstance.goto();
        return false;
    }

    setSectionInstance(instance: ?D2Section, id: string) {
        if (!instance) {
            if (this.sectionInstances.has(id)) {
                this.sectionInstances.delete(id);
            }
        } else {
            this.sectionInstances.set(id, instance);
        }
    }

    render() {
        const { metaDataStage, ...passOnProps } = this.props;

        const metaDataSectionsAsArray = Array.from(metaDataStage.sections.entries()).map(entry => entry[1]);

        const sections = metaDataSectionsAsArray.map(section => (
            <D2Section
                ref={(sectionInstance) => { this.setSectionInstance(sectionInstance, section.id); }}
                key={section.id}
                sectionMetaData={section}
                getDataId={this.resolveStateContainerId}
                {...passOnProps}
            />
        ));

        return (
            <div>
                {sections}
            </div>
        );
    }
}

D2Form.propTypes = {

};

export default D2Form;
