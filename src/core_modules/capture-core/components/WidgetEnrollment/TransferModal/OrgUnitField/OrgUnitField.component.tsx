import * as React from 'react';
import { OrganisationUnitTree } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { Props } from './OrgUnitField.types';

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
    roots: Array<{ id: string; path: string }>;
    classes: {
        orgunitTree: string;
    };
    onSelectClick: (payload: any) => void;
    selected?: { path: string; id: string };
    treeKey: string;
};

const OrgUnitTreePlain = (props: OrgUnitTreeProps) => {
    const { roots, selected, classes, treeKey, onSelectClick } = props;
    const getExpandedItems = () => {
        if (roots && roots.length === 1) {
            return [`/${roots[0].id}`];
        } else if (roots?.length > 1) {
            return roots.map(root => root.path);
        }

        return undefined;
    };

    const getHighlightedItems = () => {
        if (selected?.path) {
            return [selected?.path];
        }
        return undefined;
    };

    const initiallyExpanded = getExpandedItems();

    const [expanded, setExpanded] = React.useState<string[] | undefined>(initiallyExpanded);

    const handleExpand = ({ path }: { path: string }) => {
        if (expanded && !expanded.includes(path)) {
            setExpanded([...expanded, path]);
        }
    };

    const handleCollapse = ({ path }: { path: string }) => {
        const pathIndex = expanded?.indexOf(path);

        if (pathIndex !== undefined && pathIndex !== -1 && expanded) {
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
                dataTest={'widget-enrollment-transfer-orgunit-tree'}
                roots={roots.map(item => item.id)}
                expanded={false}
                handleExpand={handleExpand}
                handleCollapse={handleCollapse}
                singleSelection
                selected={getHighlightedItems()}
                onChange={onSelectClick}
            />
        </div>
    );
};

export const OrgUnitTreeComponent = withStyles(getStyles)(OrgUnitTreePlain);
