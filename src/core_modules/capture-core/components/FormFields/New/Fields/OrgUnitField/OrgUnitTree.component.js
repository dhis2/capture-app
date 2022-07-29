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
};

class OrgUnitTreePlain extends React.Component<Props> {
    getExpandedItems() {
        const { roots } = this.props;
        if (roots && roots.length === 1) {
            return [`/${roots[0].id}`];
        } else if (roots.length > 1) {
            return roots.map(root => root.path);
        }
        return [];
    }

    render() {
        const { roots, classes, treeKey, onSelectClick } = this.props;

        if (!roots) {
            return null;
        }

        return (
            <div className={classes.orgunitTree}>
                <OrganisationUnitTree
                    key={treeKey}
                    roots={roots.map(item => item.id)}
                    initiallyExpanded={this.getExpandedItems()}
                    singleSelection
                    onChange={onSelectClick}
                />
            </div>
        );
    }
}

export const OrgUnitTree = withStyles(getStyles)(withLoadingIndicator(() => ({ margin: 4 }), () => ({ size: 20 }))(OrgUnitTreePlain));
