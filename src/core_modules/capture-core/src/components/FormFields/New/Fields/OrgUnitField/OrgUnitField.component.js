// @flow
import * as React from 'react';
import { DebounceField } from 'capture-ui';
import OrgUnitTree from './OrgUnitTree.component';


type Props = {
    roots: Array<Object>,
    onSelectClick: (selectedOrgUnit: Object) => void,
};

class OrgUnitField extends React.Component<Props> {
    static defaultProps = {
        roots: [],
    }

    handleFilterChange = (event: SyntheticEvent<HTMLInputElement>) => {

    }

    render() {
        const { roots, onSelectClick, ...passOnProps } = this.props;
        return (
            <div>
                <DebounceField
                    onChange={this.handleFilterChange}
                />
                <OrgUnitTree
                    roots={roots}
                    onSelectClick={onSelectClick}
                />
            </div>
        );
    }
}

export default OrgUnitField;
