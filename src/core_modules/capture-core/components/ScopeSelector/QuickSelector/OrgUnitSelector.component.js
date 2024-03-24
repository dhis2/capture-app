// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { SelectorBarItem, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { OrgUnitField } from '../../FormFields/New';

const styles = () => ({
    selectBarMenu: {
        minWidth: '640px',
        maxHeight: '80vh',
        overflow: 'auto',
        minHeight: spacers.dp96,
    },
});
type Props = {
    handleClickOrgUnit?: (orgUnitId: ?string, orgUnitObject: ?Object) => void,
    onReset: () => void,
    selectedOrgUnitId?: string,
    selectedOrgUnit?: {
        name: string
    },
    previousOrgUnitId?: string,
    classes: Object,
};

type State = {
   open: boolean,
};

class OrgUnitSelectorPlain extends Component<Props, State> {
    handleClose: () => void;
    handleClick: (orgUnit: Object) => void;
    constructor(props: Props) {
        super(props);

        this.state = {
            open: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(selectedOu: {id: string, displayName: string, code?: string}) {
        const orgUnitObject = { id: selectedOu.id, name: selectedOu.displayName, code: selectedOu.code };
        const { handleClickOrgUnit } = this.props;
        handleClickOrgUnit && handleClickOrgUnit(selectedOu.id, orgUnitObject);
    }

    render() {
        const { selectedOrgUnitId, selectedOrgUnit, previousOrgUnitId, onReset, classes } = this.props;

        return (
            <SelectorBarItem
                label={i18n.t('Organisation unit')}
                noValueMessage={i18n.t('Choose an organisation unit')}
                value={selectedOrgUnitId ? selectedOrgUnit?.name : ''}
                open={this.state.open}
                setOpen={open => this.setState({ open })}
                onClearSelectionClick={() => onReset()}
                dataTest="org-unit-selector-container"
            >
                <div className={classes.selectBarMenu}>
                    <OrgUnitField
                        data-test="org-unit-field"
                        onSelectClick={(selectedOu, event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            this.setState({ open: false });
                            this.handleClick(selectedOu);
                        }}
                        previousOrgUnitId={selectedOrgUnitId || previousOrgUnitId}
                    />
                </div>
            </SelectorBarItem>
        );
    }
}

export const OrgUnitSelector = withStyles(styles)(OrgUnitSelectorPlain);
