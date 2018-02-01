// @flow
import React, { Component } from 'react';
import Section from '../Section/Section.component';
import SectionHeaderSimple from '../Section/SectionHeaderSimple.component';

import D2SectionFields from './D2SectionFields.container';

import MetaDataSection from '../../metaData/Stage/Section';

type Props = {
    sectionMetaData: MetaDataSection,
};

class D2Section extends Component<Props> {
    sectionFieldsInstance: ?D2SectionFields;

    constructor(props: Props) {
        super(props);
    }

    renderSectionHeader() {
        const title = this.props.sectionMetaData.name;

        return (
            <SectionHeaderSimple
                title={title}
            />
        );
    }

    render() {
        const { sectionMetaData, onUpdateSectionStatus, ...passOnProps } = this.props;

        if (!sectionMetaData.showContainer) {
            return (
                <D2SectionFields
                    ref={(instance) => { this.sectionFieldsInstance = instance; }}
                    fieldsMetaData={sectionMetaData.elements}
                    {...passOnProps}
                />
            );
        }
        return (
            <div>
                <Section
                    header={this.renderSectionHeader()}
                    elevation={2}
                >
                    <D2SectionFields
                        ref={(instance) => { this.sectionFieldsInstance = instance; }}
                        fieldsMetaData={sectionMetaData.elements}
                        onSectionFieldsUpdate={onUpdateSectionStatus}
                        {...passOnProps}
                    />
                </Section>
            </div>
        );
    }
}

export default D2Section;
