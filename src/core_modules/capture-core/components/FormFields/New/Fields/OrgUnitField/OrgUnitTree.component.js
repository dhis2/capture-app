// @flow
import * as React from 'react';
import { OrganisationUnitTree } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';

const getStyles = () => ({
    orgunitTree: {
        padding: 5,
        minHeight: 42,
        paddingTop: 10,
        backgroundColor: 'white',
    },
});

type Props = {
    roots: Array<Object>,
    classes: {
        orgunitTree: string,
    },
    onSelectClick: Function,
    treeKey: string,
    previousSelectedOrgUnit?: Object
};

const OrgUnitTreePlain = (props: Props) => {
    const { roots, classes, treeKey, previousSelectedOrgUnit, onSelectClick } = props;

    const getExpandedItems = () => {
        if (roots && roots.length === 1) {
            return roots
                .map(r => r.path);
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

    React.useEffect(() => {
        if (previousSelectedOrgUnit?.path && expanded?.[0] === roots[0].path) {
            setExpanded(previousSelectedOrgUnit?.path);
        }
    }, [previousSelectedOrgUnit, expanded, roots]);


    if (!roots) {
        return null;
    }
    console.log({ expanded });
    return (
        <div className={classes.orgunitTree}>
            <OrganisationUnitTree
                key={treeKey}
                roots={roots.map(item => item.id)}
                expanded={expanded}
                handleExpand={handleExpand}
                handleCollapse={handleCollapse}
                singleSelection
                highlighted={getHighlightedItems()}
                onChange={onSelectClick}
            />
        </div>
    );
};

export const OrgUnitTree = withStyles(getStyles)(withLoadingIndicator(() => ({ margin: 4 }), () => ({ size: 20 }))(OrgUnitTreePlain));
