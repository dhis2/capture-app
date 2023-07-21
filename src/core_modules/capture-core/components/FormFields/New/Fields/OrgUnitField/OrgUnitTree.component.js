// @flow
import * as React from 'react';
import { OrganisationUnitTree } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';
import { usePreviousOrganizationUnit } from './usePreviousOrganizationUnit';

const getStyles = () => ({
    orgunitTree: {
        padding: 4,
        minHeight: 42,
        paddingTop: 8,
        backgroundColor: 'white',
        display: 'flex',
        maxWidth: '100vw',
    },
});

type Props = {
    roots: Array<Object>,
    classes: {
        orgunitTree: string,
    },
    onSelectClick: Function,
    treeKey: string,
    previousOrgUnitId?: Object
};

const OrgUnitTreePlain = (props: Props) => {
    const { roots, classes, treeKey, previousOrgUnitId, onSelectClick } = props;
    const previousSelectedOrgUnit = usePreviousOrganizationUnit(previousOrgUnitId);
    const getExpandedItems = () => {
        if (roots && roots.length === 1) {
            return [`/${roots[0].id}`];
        } else if (roots?.length > 1) {
            return roots.map(root => root.path);
        }

        return undefined;
    };

    const getHighlightedItems = () => {
        if (previousSelectedOrgUnit?.path) {
            return [previousSelectedOrgUnit?.path];
        }
        return undefined;
    };

    const initiallyExpanded = getExpandedItems();

    const [expanded, setExpanded] = React.useState(initiallyExpanded);

    React.useEffect(() => {
        if (previousSelectedOrgUnit?.expandedPaths) {
            setExpanded(previousSelectedOrgUnit.expandedPaths);
        }
    }, [previousSelectedOrgUnit?.expandedPaths]);

    const handleExpand = ({ path }) => {
        if (expanded && !expanded.includes(path)) {
            setExpanded([...expanded, path]);
        }
    };

    const handleCollapse = ({ path }) => {
        const pathIndex = expanded?.indexOf(path);

        if (pathIndex && pathIndex !== -1 && expanded) {
            const updatedExpanded =
                pathIndex === 0
                    ? expanded.slice(1)
                    : [
                        ...expanded.slice(0, pathIndex),
                        ...expanded.slice(pathIndex + 1),
                    ];
            setExpanded(updatedExpanded);
        }
    };


    if (!roots) {
        return null;
    }

    return (
        <div className={classes.orgunitTree}>
            <OrganisationUnitTree
                key={treeKey}
                roots={roots.map(item => item.id)}
                expanded={expanded}
                handleExpand={handleExpand}
                handleCollapse={handleCollapse}
                singleSelection
                selected={getHighlightedItems()}
                onChange={onSelectClick}
            />
        </div>
    );
};

export const OrgUnitTree = withStyles(getStyles)(withLoadingIndicator(() => ({ margin: 4 }), () => ({ size: 20 }))(OrgUnitTreePlain));
