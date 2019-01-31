// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { DebounceField } from 'capture-ui';
import OrgUnitTree from './OrgUnitTree.component';

const getStyles = () => ({
    container: {
        border: '1px solid #C4C4C4',
        borderRadius: '3px',
        height: '100%',
        width: '100%',
        boxShadow: '0px 0px 2px 0px #C4C4C4 inset',
        zIndex: 0,
        backgroundColor: 'white',
    },
    searchField: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: 'none',
        border: 'none',
    },
    debounceFieldContainer: {
        padding: 2,
        paddingBottom: 0,
    },
    orgUnitTreeContainer: {
        padding: 2,
        borderTop: '1px solid #C4C4C4',
    },
});

type Props = {
    roots: Array<Object>,
    treeKey: string,
    onSelectClick: (selectedOrgUnit: Object) => void,
    onSearch: (searchText: string) => void,
    searchText: ?string,
    ready?: ?boolean,
    selected?: ?string,
    maxTreeHeight?: ?number,
    classes: {
        outerContainer: string,
        container: string,
        searchField: string,
        debounceFieldContainer: string,
        orgUnitTreeContainer: string,
    },
};

class OrgUnitField extends React.Component<Props> {
    static defaultProps = {
        roots: [],
    }
    classes: Object;
    constructor(props: Props) {
        super(props);
        this.classes = {
            input: this.props.classes.searchField,
        };
    }

    handleFilterChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onSearch(event.currentTarget.value);
    }

    render() {
        const {
            roots,
            onSelectClick,
            searchText,
            onSearch,
            ready,
            treeKey,
            classes,
            selected,
            maxTreeHeight,
            ...passOnProps // eslint-disable-line
        } = this.props;
        const styles = maxTreeHeight ? { maxHeight: maxTreeHeight, overflowY: 'auto' } : null;
        return (
            <div
                className={classes.container}
            >
                <div className={classes.debounceFieldContainer}>
                    <DebounceField
                        onDebounced={this.handleFilterChange}
                        value={searchText}
                        placeholder={i18n.t('Search')}
                        classes={this.classes}
                    />
                </div>
                <div className={classes.orgUnitTreeContainer} style={styles}>
                    <OrgUnitTree
                        roots={roots}
                        onSelectClick={onSelectClick}
                        ready={ready}
                        treeKey={treeKey}
                        selected={selected}
                    />
                </div>

            </div>
        );
    }
}

export default withStyles(getStyles)(OrgUnitField);
