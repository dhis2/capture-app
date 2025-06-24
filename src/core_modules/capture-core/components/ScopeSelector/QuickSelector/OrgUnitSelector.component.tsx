import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
// @ts-expect-error - SelectorBarItem exists at runtime but not in TypeScript definitions
import { SelectorBarItem, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { OrgUnitField } from '../../FormFields/New';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';

const styles = () => ({
    selectBarMenu: {
        minWidth: '640px',
        maxHeight: '80vh',
        overflow: 'auto',
        minHeight: spacers.dp96,
    },
});

type OwnProps = {
    handleClickOrgUnit?: (orgUnitId: string | null | undefined, orgUnitObject: Record<string, any> | null | undefined) => void;
    onReset: () => void;
    selectedOrgUnitId?: string;
    selectedOrgUnit?: {
        name: string;
    };
    previousOrgUnitId?: string;
    isReadOnly?: boolean;
    tooltip?: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

type State = {
    open: boolean;
};

class OrgUnitSelectorPlain extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            open: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (selectedOu: { id: string; displayName: string; code?: string }) => {
        const orgUnitObject = { id: selectedOu.id, name: selectedOu.displayName, code: selectedOu.code };
        const { handleClickOrgUnit } = this.props;
        handleClickOrgUnit && handleClickOrgUnit(selectedOu.id, orgUnitObject);
    }

    render() {
        const { selectedOrgUnitId, selectedOrgUnit, previousOrgUnitId, onReset, isReadOnly, tooltip, classes } = this.props;

        return (
            <ConditionalTooltip
                enabled={!!tooltip}
                content={i18n.t('Choose an organisation unit in the form below')}
            >
                <SelectorBarItem
                    label={i18n.t('Organisation unit')}
                    noValueMessage={i18n.t(isReadOnly ? 'None selected' : 'Choose an organisation unit')}
                    value={selectedOrgUnitId ? selectedOrgUnit?.name : ''}
                    open={!isReadOnly && this.state.open}
                    setOpen={open => this.setState({ open })}
                    onClearSelectionClick={!isReadOnly ? () => onReset() : undefined}
                    displayOnly={isReadOnly}
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
            </ConditionalTooltip>
        );
    }
}

export const OrgUnitSelector = withStyles(styles)(OrgUnitSelectorPlain);
