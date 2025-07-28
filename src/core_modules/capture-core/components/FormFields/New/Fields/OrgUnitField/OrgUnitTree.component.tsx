import * as React from 'react';
import { OrganisationUnitTree } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
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

type OrgUnitTreeProps = {
    roots: Array<Record<string, any>>;
    onSelectClick: (payload: any) => void;
    treeKey: string;
    previousOrgUnitId?: Record<string, any> | string;
};

type Props = OrgUnitTreeProps & WithStyles<typeof getStyles>;

const OrgUnitTreePlain = (props: Props) => {
    const { roots, classes, treeKey, previousOrgUnitId, onSelectClick } = props;
    const previousSelectedOrgUnit = usePreviousOrganizationUnit(typeof previousOrgUnitId === 'string' ? previousOrgUnitId : previousOrgUnitId?.id);
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

    const [expanded, setExpanded] = React.useState<string[] | undefined>(initiallyExpanded);

    React.useEffect(() => {
        if (previousSelectedOrgUnit?.expandedPaths) {
            setExpanded(previousSelectedOrgUnit.expandedPaths);
        }
    }, [previousSelectedOrgUnit?.expandedPaths]);

    const handleExpand = ({ path }: { path: string }) => {
        if (expanded && !expanded.includes(path)) {
            setExpanded([...expanded, path]);
        }
    };

    const handleCollapse = ({ path }: { path: string }) => {
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
                initiallyExpanded={expanded}
                onExpand={handleExpand}
                onCollapse={handleCollapse}
                singleSelection
                selected={getHighlightedItems()}
                onChange={(payload: any) => onSelectClick(payload)}
            />
        </div>
    );
};

export const OrgUnitTree = withStyles(getStyles)(withLoadingIndicator(() => ({ margin: 4 }), () => ({ size: 20 }))(OrgUnitTreePlain));
