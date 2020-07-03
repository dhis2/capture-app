// @flow
import * as React from 'react';
import { OrgUnitTreeMultipleRoots as D2OrgUnitTree } from '@dhis2/d2-ui-org-unit-tree';
import { withStyles } from '@material-ui/core/styles';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';

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
    treeKey: string,
};

class OrgUnitTree extends React.Component<Props> {
    getExpandedItems() {
        const { roots } = this.props;
        if (roots && roots.length === 1) {
            return roots
                .map(r => r.path);
        }
        return undefined;
    }

    render() {
        const { roots, classes, treeKey, ...passOnProps } = this.props;

        if (!roots) {
            return null;
        }

        return (
            <div className={classes.orgunitTree}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <D2OrgUnitTree
                    key={treeKey}
                    roots={roots}
                    initiallyExpanded={this.getExpandedItems()}
                    hideCheckboxes
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(withLoadingIndicator(() => ({ margin: 4 }), () => ({ size: 20 }))(OrgUnitTree));
