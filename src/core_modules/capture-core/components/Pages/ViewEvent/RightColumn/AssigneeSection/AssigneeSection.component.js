// @flow

import * as React from 'react';
import { IconUser24 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { type ProgramStage } from '../../../../../metaData';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';
import { Contents } from './Contents.component';

const LoadingContents = withLoadingIndicator(null, props => ({ style: props.loadingIndicatorStyle }))(Contents);

type Props = {
    programStage: ProgramStage,
    classes: Object,
}

const loadingIndicatorStyle = {
    height: 36,
    width: 36,
};

export class AssigneeSectionComponent extends React.Component<Props> {
    renderHeader = () => (
        <ViewEventSectionHeader
            icon={IconUser24}
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
