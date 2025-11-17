import * as React from 'react';
import { connect } from 'react-redux';
import type { OptionGroup } from '../../../../../../metaData';
import { makeGetOptionsVisibility } from './rulesOptionsVisibility.selectors';

const effectKeys = {
    SHOW_OPTION_GROUPS: 'showOptionGroups',
    HIDE_OPTION_GROUPS: 'hideOptionGroups',
    HIDE_OPTIONS: 'hideOptions',
};

const allFilters = [
    {
        key: effectKeys.SHOW_OPTION_GROUPS,
        createFilter: (showGroupEffects: Array<any>, optionGroups: Map<string, OptionGroup>) => {
            const showOptionGroups = showGroupEffects.map(effect => optionGroups.get(effect.optionGroupId));

            return (option: any) => showOptionGroups.some(og => og && !!og.optionIds.get(option.id));
        },
    },
    {
        key: effectKeys.HIDE_OPTION_GROUPS,
        createFilter: (hideGroupEffects: Array<any>, optionGroups: Map<string, OptionGroup>) => {
            const hideOptionGroups = hideGroupEffects.map(effect => optionGroups.get(effect.optionGroupId));
            return (option: any) => !hideOptionGroups.some(og => og && !!og.optionIds.get(option.id));
        },
    },
    {
        key: effectKeys.HIDE_OPTIONS,
        createFilter: (hideOptionEffects: Array<any>) => (option: any) =>
            !hideOptionEffects.some(o => o.optionId === option.id),
    },
];

type Props = {
    optionGroups: Map<string, OptionGroup>,
    options: Array<{id: string}>,
    rulesOptionsVisibility: {[key: typeof effectKeys[keyof typeof effectKeys]]: Array<any> },
}

const getCreateRulesOptionsVisibilityHandlerHOC =
    (InnerComponent: React.ComponentType<any>) =>
        (class CreateRulesOptionsVisibilityHandlerHOC extends React.Component<Props> {
            static getFilteredOptions = (props: Props) => {
                const { options, rulesOptionsVisibility, optionGroups } = props;

                const filters = allFilters
                    .filter(f => rulesOptionsVisibility[f.key] && rulesOptionsVisibility[f.key].length > 0)
                    .map(f => f.createFilter(rulesOptionsVisibility[f.key], optionGroups));

                return options.filter(option => filters.every(f => f(option)));
            }

            filteredOptions: any;

            constructor(props: Props) {
                super(props);

                this.filteredOptions = CreateRulesOptionsVisibilityHandlerHOC.getFilteredOptions(props);
            }


            componentDidUpdate(prevProps: Props) {
                if (this.props.rulesOptionsVisibility !== prevProps.rulesOptionsVisibility) {
                    this.filteredOptions = CreateRulesOptionsVisibilityHandlerHOC.getFilteredOptions(this.props);
                }
            }

            render() {
                const { options, ...passOnProps } = this.props;

                return (
                    <InnerComponent
                        options={this.filteredOptions}
                        {...passOnProps}
                    />
                );
            }
        });

const makeMapStateToProps = () => {
    const getOptionsVisibility = makeGetOptionsVisibility();

    const mapStateToProps = (state: any, props: any) => ({
        rulesOptionsVisibility: getOptionsVisibility(state, props),
    });
    return mapStateToProps;
};

export const withRulesOptionVisibilityHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(makeMapStateToProps, () => ({}))(getCreateRulesOptionsVisibilityHandlerHOC(InnerComponent));
