// @flow
import * as React from 'react';
import getD2 from 'capture-core/d2/d2Instance';
import { OrgUnitTreeMultipleRoots as D2OrgUnitTree } from '@dhis2/d2-ui-org-unit-tree';
import { withStyles } from '@material-ui/core/styles';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';

const getStyles = () => ({
    orgunitTree: {
        borderBottom: '1px solid #C4C4C4',
        borderLeft: '1px solid #C4C4C4',
        borderRight: '1px solid #C4C4C4',
        boxShadow: '0px 0px 2px 0px #C4C4C4 inset',
        padding: 5,
        minHeight: 42,
        paddingTop: 10,
    },
});

type SourceRoot = {
    id: string,
};

type Props = {
    roots: Array<SourceRoot>,
    classes: {
        orgunitTree: string,
    },
};

type State = {
    rootsForTree: ?Array<Object>,
};

class OrgUnitTree extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            rootsForTree: null,
        };
    }

    componentDidMount() {
        const rootIds = this.props.roots.map(r => r.id).join(',');
        this.getRoots(rootIds);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.roots !== this.props.roots) {
            const rootIds = nextProps.roots.map(r => r.id).join(',');
            this.setState({
                rootsForTree: null,
            });
            rootIds && this.getRoots(rootIds);
        }
    }

    getRoots(rootIds: string) {
        getD2()
            .models
            .organisationUnits
            .list({
                filter: `id:in:[${rootIds}]`,
                paging: false,
                fields: [
                    'id,displayName,path,publicAccess,access,lastUpdated', 'children[id,displayName,publicAccess,access,path,children::isNotEmpty]',
                ].join(','),
            })
            .then(orgUnitCollection => orgUnitCollection.toArray())
            .then((orgUnits) => {
                this.setState({
                    rootsForTree: orgUnits,
                });
            });
    }

    getExpandedItems() {
        const { rootsForTree } = this.state;
        if (rootsForTree && rootsForTree.length === 1) {
            return rootsForTree
                .map(r => r.path);
        }
        return undefined;
    }

    render() {
        const { roots, classes, ...passOnProps } = this.props;
        const { rootsForTree } = this.state;

        if (!rootsForTree) {
            return null;
        }

        return (
            <div className={classes.orgunitTree}>
                <D2OrgUnitTree
                    roots={rootsForTree}
                    initiallyExpanded={this.getExpandedItems()}
                    hideCheckboxes
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(withLoadingIndicator(null, null, props => !props.isLoading)(OrgUnitTree));
