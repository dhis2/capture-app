// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { SelectorBarItem, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { OrgUnitField } from '../../FormFields/New';

const styles = () => ({
    selectBarMenu: {
        minWidth: '60vw',
        maxHeight: '90vh',
        overflow: 'scroll',
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

class OrgUnitSelectorPlain extends Component<Props> {
    handleClose: () => void;
    handleClick: (orgUnit: Object) => void;
    constructor(props: Props) {
        super(props);

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
            <div data-test="org-unit-selector">
                <SelectorBarItem
                    displayOnly={Boolean(selectedOrgUnitId)}
                    label={i18n.t('Organization unit')}
                    noValueMessage={i18n.t('Select a Organization unit')}
                    value={Boolean(selectedOrgUnitId) && selectedOrgUnit?.name}
                    open={Boolean(!selectedOrgUnitId)}
                    // TODO fix this in the ui library
                    setOpen={() => {}}
                    onClearSelectionClick={() => onReset()}
                >
                    <div className={classes.selectBarMenu}>
                        <OrgUnitField
                            data-test="org-unit-field"
                            onSelectClick={selectedOu => this.handleClick(selectedOu)}
                            previousOrgUnitId={previousOrgUnitId}
                        />
                    </div>
                </SelectorBarItem>
            </div>
        );
    }
}

export const OrgUnitSelector = withStyles(styles)(OrgUnitSelectorPlain);
