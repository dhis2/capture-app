// @flow
import React, { Component, PropTypes } from 'react';
import { withStyles } from 'material-ui-next/styles';

import D2Section from './D2Section.component';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';

const styles = theme => ({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
    },
});

type Props = {
    formFoundation: RenderFoundation,
    id: string,
    classes: Object,
};

class D2Form extends Component<Props> {
    validateForm: () => void;
    sectionInstances: Map<string, D2Section>;

    constructor(props: Props) {
        super(props);

        this.validateForm = this.validateForm.bind(this);

        this.sectionInstances = new Map();
    }

    validateForm() {
        return Array.from(this.sectionInstances.entries())
            .map(entry => entry[1])
            .every((sectionInstance: D2Section) => {
                if (sectionInstance && sectionInstance.sectionFieldsInstance && sectionInstance.sectionFieldsInstance.getWrappedInstance()) {
                    const sectionFieldsInstance = sectionInstance.sectionFieldsInstance.getWrappedInstance();
                    return sectionFieldsInstance.isValid();
                }
                return true;
            });
    }

    validateFormReturningFailedFields(): Array<any> {
        return Array.from(this.sectionInstances.entries())
            .map(entry => entry[1])
            .reduce((failedFormFields: Array<any>, sectionInstance: D2Section) => {
                if (sectionInstance && sectionInstance.sectionFieldsInstance && sectionInstance.sectionFieldsInstance.getWrappedInstance()) {
                    const sectionFieldsInstance = sectionInstance.sectionFieldsInstance.getWrappedInstance();
                    if (!sectionFieldsInstance.isValid()) {
                        failedFormFields = [...failedFormFields, ...sectionFieldsInstance.getInvalidFields()];
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

    getFormId() {
        return this.props.id;
    }

    getFormBuilderId(sectionId: string) {
        return `${this.props.id}-${sectionId}`;
    }

    render() {
        const { formFoundation, id, classes, ...passOnProps } = this.props;

        const metaDataSectionsAsArray = Array.from(formFoundation.sections.entries()).map(entry => entry[1]);

        const sections = metaDataSectionsAsArray.map(section => (
            <div
                className={classes.container}
                key={section.id}
            >
                <D2Section
                    ref={(sectionInstance) => { this.setSectionInstance(sectionInstance, section.id); }}
                    sectionMetaData={section}
                    formId={this.getFormId()}
                    formBuilderId={this.getFormBuilderId(section.id)}
                    {...passOnProps}
                />
            </div>
        ));

        return (
            <div>
                {sections}
            </div>
        );
    }
}

export default withStyles(styles)(D2Form);
