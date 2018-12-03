// @flow
import * as React from 'react';
import classNames from 'classnames';
import ClearIcon from '@material-ui/icons/Clear';
import withStyles from '@material-ui/core/styles/withStyles';
import RelationshipType from '../../../../metaData/RelationshipType/RelationshipType';

type Props = {
    relationshipTypes: ?Array<RelationshipType>,
    selectedRelationshipTypeId?: ?string,
    onSetSelectedRelationshipType: (relationshipTypeId: string) => void,
    onDeseletRelationshipType: () => void,
    classes: {
        relationshipType: string,
        relationshipTypeSelected: string,
        relationshipTypeSelectable: string,
        container: string,
    }
}

const getStyles = theme => ({
    relationshipType: {
        display: 'flex',
        padding: theme.typography.pxToRem(10),
        border: `1px solid ${theme.palette.grey.light}`,
        borderRadius: theme.typography.pxToRem(4),
        margin: theme.typography.pxToRem(10),

    },
    relationshipTypeSelectable: {
        cursor: 'pointer',
    },
    relationshipSelected: {
    },
    container: {
        display: 'flex',
    },
});


class RelationshipTypeSelector extends React.Component<Props> {
    onRelationshipTypeSelected = (relationshipType: Object) => {
        this.props.onSetSelectedRelationshipType(relationshipType.id);
    };
    renderRelationshipTypes = () => {
        const { classes, relationshipTypes } = this.props;
        return relationshipTypes ? relationshipTypes.map(rt => (
            <div className={classNames(classes.relationshipType, classes.relationshipTypeSelectable)} key={rt.id} role="button" tabIndex="0" onClick={() => this.onRelationshipTypeSelected(rt)}>
                {rt.displayName}
            </div>
        )) : [];
    }

    renderSelectedRelationshipType = () => {
        const { classes, selectedRelationshipTypeId, relationshipTypes, onDeseletRelationshipType } = this.props;
        // $FlowFixMe
        const relationshipType = relationshipTypes.find(r => r.id === selectedRelationshipTypeId);
        return (
            <div className={classNames(classes.relationshipType, classes.relationshipTypeSelected)}>
                { /* $FlowFixMe */}
                <div>{relationshipType.displayName}</div>
                <ClearIcon fontSize="small" onClick={onDeseletRelationshipType} />
            </div>
        );
    }

    render() {
        return (
            <div className={this.props.classes.container}>
                {this.props.selectedRelationshipTypeId ?
                    this.renderSelectedRelationshipType() :
                    this.renderRelationshipTypes()
                }
            </div>
        );
    }
}

export default withStyles(getStyles)(RelationshipTypeSelector);

