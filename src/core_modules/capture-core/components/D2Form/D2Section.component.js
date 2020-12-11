// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Section from '../Section/Section.component';
import SectionHeaderSimple from '../Section/SectionHeaderSimple.component';
import D2SectionFields from './D2SectionFields.container';
import { Section as MetaDataSection } from '../../metaData';

const getStyles = (theme) => ({
  section: {
    backgroundColor: 'white',
    maxWidth: theme.typography.pxToRem(892),
  },
});

type Props = {
  sectionMetaData: MetaDataSection,
  isHidden?: ?boolean,
  classes: {
    section: string,
  },
  formHorizontal: ?boolean,
  sectionId: string,
  formBuilderId: string,
  formId: string,
};

class D2Section extends React.PureComponent<Props> {
  // $FlowFixMe[speculation-ambiguous] automated comment
  sectionFieldsInstance: ?D2SectionFields;

  renderSectionHeader() {
    const title = this.props.sectionMetaData.name;

    if (!title) {
      return null;
    }

    return <SectionHeaderSimple title={title} />;
  }

  render() {
    const { sectionMetaData, isHidden, classes, sectionId, ...passOnProps } = this.props;

    if (isHidden) {
      return null;
    }

    if (!sectionMetaData.showContainer || this.props.formHorizontal) {
      return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <D2SectionFields
          ref={(instance) => {
            this.sectionFieldsInstance = instance;
          }}
          fieldsMetaData={sectionMetaData.elements}
          {...passOnProps}
        />
      );
    }
    return (
      <div>
        <Section header={this.renderSectionHeader()} elevation={2} className={classes.section}>
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
}

export default withStyles(getStyles)(D2Section);
