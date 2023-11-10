// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Section } from '../Section/Section.component';
import { SectionHeaderSimple } from '../Section/SectionHeaderSimple.component';
import { D2SectionFields } from './D2SectionFields.container';
import { Section as MetaDataSection } from '../../metaData';
import { SectionDescriptionBox } from './SectionDescriptionBox.component';

const getStyles = theme => ({
    section: {
        backgroundColor: 'white',
        maxWidth: theme.typography.pxToRem(892),
    },
    containerCustomForm: {
        paddingTop: 10,
        paddingBottom: 10,
    },
});

type Props = {
    sectionMetaData: MetaDataSection,
    isHidden?: ?boolean,
    classes: {
        section: string,
        containerCustomForm: string,
    },
    formHorizontal: ?boolean,
    applyCustomFormClass: boolean,
    sectionId: string,
    formBuilderId: string,
    formId: string,
    onFieldsValidated: ?(any, formBuilderId: string) => void,
};

class D2SectionPlain extends React.PureComponent<Props> {
    // $FlowFixMe[speculation-ambiguous] automated comment
    sectionFieldsInstance: ?D2SectionFields;
    componentDidMount() {
        if (this.props.isHidden) {
            // Inform withSaveHandler that this section is done initialising
            this.props.onFieldsValidated && this.props.onFieldsValidated(
                {},
                this.props.formBuilderId,
            );
        }
    }

    renderSectionHeader() {
        const title = this.props.sectionMetaData.name;

        if (!title) {
            return null;
        }

        return (
            <SectionHeaderSimple
                title={title}
            />
        );
    }

    renderSectionDescription() {
        const description = this.props.sectionMetaData.displayDescription;

        if (!description) {
            return null;
        }

        return (
            <SectionDescriptionBox description={description} />
        );
    }

    renderSection(sectionProps) {
        const { sectionMetaData, applyCustomFormClass, classes, sectionId, ...passOnProps } = sectionProps;

        if (sectionMetaData.showContainer || this.props.formHorizontal) {
            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <D2SectionFields
                    ref={(instance) => { this.sectionFieldsInstance = instance; }}
                    fieldsMetaData={sectionMetaData.elements}
                    customForm={sectionMetaData.customForm}
                    {...passOnProps}
                />
            );
        }

        return (
            <div
                data-test="d2-section-vertical"
                className={applyCustomFormClass ? this.props.classes.containerCustomForm : ''}
            >
                <Section
                    header={this.renderSectionHeader()}
                    description={this.renderSectionDescription()}
                    elevation={2}
                    className={classes.section}
                >
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <D2SectionFields
                        ref={(instance) => {
                            this.sectionFieldsInstance = instance;
                        }}
                        fieldsMetaData={sectionMetaData.elements}
                        {...passOnProps}
                    />

                </Section>
            </div>
        );
    }

    render() {
        const { isHidden, ...passOnProps } = this.props;

        if (isHidden) {
            return null;
        }

        return this.renderSection(passOnProps);
    }
}

export const D2Section = withStyles(getStyles)(D2SectionPlain);
