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
            <>
                {this.renderSlash()}
                { findMode ?
                    <>
                        <LinkButton onClick={() => onSelectRelationshipType(selectedRelationshipType)}>{relationshipTypeName}</LinkButton>
                        {this.renderForFindMode(findMode)}
                    </> :
                    relationshipTypeName
                }
            </>
        );
    }

    renderSlash = () => (<span style={{ padding: 5 }}>/</span>)

    renderForFindMode = (findMode: $Values<typeof findModes>) => {
        const { onSelectFindMode, searching } = this.props;
        const displayName = findModeDisplayNames[findMode];
        return (
            <>
                {this.renderSlash()}
                {searching ?
                    <>
                        <LinkButton onClick={() => onSelectFindMode(findMode)}>{displayName}</LinkButton>
                        {this.renderForSearching()}
                    </> :
                    displayName
                }
            </>
        );
    }

    renderForSearching = () => (
        <>
            {this.renderSlash()}
            {I18n.t('Search results')}
        </>
    )

    render() {
        const { selectedRelationshipType, onInitializeNewRelationship, header } = this.props;
        return (
            <div style={{ padding: 10 }}>
                {selectedRelationshipType ?
                    <>
                        <LinkButton onClick={onInitializeNewRelationship}>{header}</LinkButton>
                        {this.renderForRelationshipType(selectedRelationshipType)}
                    </> :
                    header
                }
            </div>
        );
    }
}

export default RelationshipNavigation;
