import * as React from 'react';
import classNames from 'classnames';
import { IconCross16 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import type { RelationshipType } from '../../../../metaData';
import type { SelectedRelationshipType } from '../newRelationship.types';

type OwnProps = {
    relationshipTypes?: Array<RelationshipType>;
    selectedRelationshipType?: SelectedRelationshipType;
    onSelectRelationshipType: (relationshipType: SelectedRelationshipType) => void;
    onDeselectRelationshipType: () => void;
};

type Props = OwnProps & WithStyles<typeof getStyles>;

const getStyles = (theme: Theme) => ({
    relationshipType: {
        display: 'flex',
        padding: theme.typography.pxToRem(10),
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: theme.typography.pxToRem(4),
        margin: theme.typography.pxToRem(10),
    },
    relationshipTypeSelectable: {
        cursor: 'pointer',
    },
    relationshipTypeSelected: {
        backgroundColor: '#f0f9f8',
    },
    relationshipTypeSelectedText: {
        paddingLeft: theme.typography.pxToRem(5),
        display: 'flex',
        alignItems: 'center',
        borderLeft: '2px solid #4ca899',
    },
    container: {
        display: 'flex',
    },
});


class RelationshipTypeSelectorPlain extends React.Component<Props> {
    onSelectRelationshipType = (rt: RelationshipType) => {
        this.props.onSelectRelationshipType({
            id: rt.id,
            name: rt.name,
            from: {
                entity: rt.from.entity,
                programId: rt.from.programId || undefined,
                programStageId: rt.from.programStageId || undefined,
                trackedEntityTypeId: rt.from.trackedEntityTypeId,
            },
            to: {
                entity: rt.to.entity,
                programId: rt.to.programId || undefined,
                programStageId: rt.to.programStageId || undefined,
                trackedEntityTypeId: rt.to.trackedEntityTypeId,
            },
        });
    }
    renderRelationshipTypes = () => {
        const { classes, relationshipTypes } = this.props;
        return relationshipTypes ? relationshipTypes.map(rt => (
            <div
                key={rt.id}
                data-test={`relationship-type-selector-button-${rt.id}`}
                className={classNames(classes.relationshipType, classes.relationshipTypeSelectable)}
                role="button"
                tabIndex={0}
                onClick={() => this.onSelectRelationshipType(rt)}
            >
                {rt.name}
            </div>
        )) : [];
    }

    renderSelectedRelationshipType = (selectedRelationshipType: SelectedRelationshipType) => {
        const { classes, onDeselectRelationshipType } = this.props;
        return (
            <div className={classNames(classes.relationshipType, classes.relationshipTypeSelected)}>
                <div className={classes.relationshipTypeSelectedText} onClick={onDeselectRelationshipType} role="button" tabIndex={0}>
                    <div>{selectedRelationshipType.name}</div>
                    <IconCross16 />
                </div>
            </div>
        );
    }

    render() {
        const { selectedRelationshipType, classes } = this.props;
        return (
            <div className={classes.container}>
                {selectedRelationshipType ?
                    this.renderSelectedRelationshipType(selectedRelationshipType) :
                    this.renderRelationshipTypes()
                }
            </div>
        );
    }
}

export const RelationshipTypeSelector = withStyles(getStyles)(RelationshipTypeSelectorPlain);
