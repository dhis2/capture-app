import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Section } from '../Section/Section.component';
import { SectionHeaderSimple } from '../Section/SectionHeaderSimple.component';
import { D2SectionFields } from './D2SectionFields.container';
import { Section as MetaDataSection } from '../../metaData';
import { SectionDescriptionBox } from './SectionDescriptionBox.component';

const styles: Readonly<any> = (theme: any) => ({
    section: {
        backgroundColor: 'white',
        maxWidth: theme.typography.pxToRem(892),
    },
    containerCustomForm: {
        paddingTop: 10,
        paddingBottom: 10,
    },
});

type OwnProps = {
    sectionMetaData: MetaDataSection;
    isHidden?: boolean | null;
    formHorizontal: boolean | null;
    applyCustomFormClass: boolean;
    sectionId: string;
    formBuilderId: string;
    formId: string;
    fieldOptions?: Record<string, any>;
    onFieldsValidated?: ((fieldsUI: any, formId: string, uidsForIsValidating: Array<string>) => void) | null;
};

type Props = OwnProps & WithStyles<typeof styles>;

class D2SectionPlain extends React.PureComponent<Props> {
    componentDidMount() {
        if (this.props.isHidden) {
            this.props.onFieldsValidated?.(
                Array.from(this.props.sectionMetaData.elements.keys()).reduce((acc: any, fieldKey: any) => {
                    acc[fieldKey] = { valid: true };
                    return acc;
                }, {}),
                this.props.formId,
                [],
            );
        }
    }

    sectionFieldsInstance: any | null = null;

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

    renderSection(sectionProps: any) {
        const { sectionMetaData, classes, sectionId, ...passOnProps } = sectionProps;

        const sectionFields = (
            <D2SectionFields
                ref={(instance) => { this.sectionFieldsInstance = instance; }}
                fieldsMetaData={sectionMetaData.elements}
                customForm={sectionMetaData.customForm}
                {...passOnProps}
            />
        );

        if (sectionMetaData.showContainer && !this.props.formHorizontal) {
            return (
                <div>
                    <Section
                        header={this.renderSectionHeader() || undefined}
                        description={this.renderSectionDescription() || undefined}
                        className={classes.section}
                    >
                        {sectionFields}
                    </Section>
                </div>
            );
        }
        return sectionFields;
    }


    render() {
        const { isHidden, applyCustomFormClass, ...passOnProps } = this.props;

        if (isHidden) {
            return null;
        }

        return (<div
            data-test="d2-section"
            className={applyCustomFormClass ? this.props.classes.containerCustomForm : ''}
        >
            {
                this.renderSection(passOnProps)
            }
        </div>);
    }
}

export const D2Section = withStyles(styles)(D2SectionPlain);
