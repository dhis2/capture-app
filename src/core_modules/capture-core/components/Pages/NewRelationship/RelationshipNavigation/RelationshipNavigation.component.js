// @flow

import * as React from 'react';
import I18n from '@dhis2/d2-i18n';
import type { SelectedRelationshipType } from '../newRelationship.types';
import LinkButton from '../../../Buttons/LinkButton.component';
import { findModes, findModeDisplayNames } from '../findModes';


type Props = {
    selectedRelationshipType?: ?SelectedRelationshipType,
    onInitializeNewRelationship: () => void,
    findMode?: ?$Values<typeof findModes>,
    searching?: ?boolean,
    onSelectRelationshipType: Function,
    onSelectFindMode: Function,
    header: any,
}

class RelationshipNavigation extends React.Component<Props> {
    renderForRelationshipType = (selectedRelationshipType: SelectedRelationshipType) => {
        const { onSelectRelationshipType, findMode } = this.props;
        const relationshipTypeName = selectedRelationshipType.name;
        return (
            <React.Fragment>
                {this.renderSlash()}
                { findMode ?
                    <React.Fragment>
                        <LinkButton onClick={() => onSelectRelationshipType(selectedRelationshipType)}>{relationshipTypeName}</LinkButton>
                        {this.renderForFindMode(findMode)}
                    </React.Fragment> :
                    relationshipTypeName
                }
            </React.Fragment>
        );
    }

    renderSlash = () => (<span style={{ padding: 5 }}>/</span>)

    renderForFindMode = (findMode: $Values<typeof findModes>) => {
        const { onSelectFindMode, searching } = this.props;
        const displayName = findModeDisplayNames[findMode];
        return (
            <React.Fragment>
                {this.renderSlash()}
                {searching ?
                    <React.Fragment>
                        <LinkButton onClick={() => onSelectFindMode(findMode)}>{displayName}</LinkButton>
                        {this.renderForSearching()}
                    </React.Fragment> :
                    displayName
                }
            </React.Fragment>
        );
    }

    renderForSearching = () => (
        <React.Fragment>
            {this.renderSlash()}
            {I18n.t('Search results')}
        </React.Fragment>
    )

    render() {
        const { selectedRelationshipType, onInitializeNewRelationship, header } = this.props;
        return (
            <div style={{ padding: 10 }}>
                {selectedRelationshipType ?
                    <React.Fragment>
                        <LinkButton onClick={onInitializeNewRelationship}>{header}</LinkButton>
                        {this.renderForRelationshipType(selectedRelationshipType)}
                    </React.Fragment> :
                    header
                }
            </div>
        );
    }
}

export default RelationshipNavigation;
