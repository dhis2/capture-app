import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
// @ts-expect-error - SelectorBarItem is available at runtime, but its TypeScript definition is not exposed by the UI library
import { SelectorBarItem, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { OrgUnitField } from '../../FormFields/New';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';
import { useProgramLabel } from '../../../metaData';

const styles = () => ({
    selectBarMenu: {
        minWidth: '640px',
        maxHeight: '80vh',
        overflow: 'auto',
        minHeight: spacers.dp96,
    },
});

type OwnProps = {
    handleClickOrgUnit?: (
        orgUnitId: string | null | undefined,
        orgUnitObject: Record<string, any> | null | undefined
    ) => void;
    onReset: () => void;
    selectedOrgUnitId?: string;
    selectedOrgUnit?: {
        name: string;
    };
    previousOrgUnitId?: string;
    isReadOnly?: boolean;
    tooltip?: boolean;
    orgUnitLabel?: string;
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

    handleClick(selectedOu: { id: string; displayName: string; code?: string }) {
        const orgUnitObject = { id: selectedOu.id, name: selectedOu.displayName, code: selectedOu.code };
        const { handleClickOrgUnit } = this.props;
        handleClickOrgUnit && handleClickOrgUnit(selectedOu.id, orgUnitObject);
    }

    render() {
        const {
            selectedOrgUnitId,
            selectedOrgUnit,
            previousOrgUnitId,
            onReset,
            isReadOnly,
            tooltip,
            classes,
            orgUnitLabel,
        } = this.props;
        const orgUnit = orgUnitLabel ?? i18n.t('Organisation unit');

        return (
            <ConditionalTooltip
                enabled={Boolean(tooltip)}
                content={i18n.t('Choose an {{orgUnit}} in the form below', {
                    orgUnit,
                    interpolation: { escapeValue: false },
                })}
            >
                <SelectorBarItem
                    label={orgUnit}
                    noValueMessage={isReadOnly ? i18n.t('None selected') : i18n.t('Choose an {{orgUnit}}', {
                        orgUnit,
                        interpolation: { escapeValue: false },
                    })}
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

const StyledOrgUnitSelector = withStyles(styles)(OrgUnitSelectorPlain) as
    React.ComponentType<{ [key: string]: unknown; orgUnitLabel?: string }>;

export const OrgUnitSelector = (props: { [key: string]: unknown }) => {
    const orgUnitLabel = useProgramLabel('orgUnit') ?? i18n.t('Organisation unit');
    return <StyledOrgUnitSelector {...props} orgUnitLabel={orgUnitLabel} />;
};
