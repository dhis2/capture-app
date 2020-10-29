// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { AssignmentInd as AssignmentIcon } from '@material-ui/icons';
import ViewEventSection from '../../Section/ViewEventSection.component';
import ViewEventSectionHeader from '../../Section/ViewEventSectionHeader.component';
import Contents from './Contents.component';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';
import { type ProgramStage } from '../../../../../metaData';

const LoadingContents = withLoadingIndicator(null, props => ({ style: props.loadingIndicatorStyle }))(Contents);

type Props = {
    programStage: ProgramStage,
    classes: Object,
}

const loadingIndicatorStyle = {
    height: 36,
    width: 36,
};

class AssigneeSection extends React.Component<Props> {
    renderHeader = () => (
        <ViewEventSectionHeader
            icon={AssignmentIcon}
            text={i18n.t('Assignee')}
        />
    )

    render() {
        const { programStage, ...passOnProps } = this.props;

        if (!programStage.enableUserAssignment) {
            return null;
        }

        return (
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <LoadingContents
                    loadingIndicatorStyle={loadingIndicatorStyle}
                    {...passOnProps}
                />
            </ViewEventSection>
        );
    }
}

export default AssigneeSection;
