// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { type OptionGroup } from '../../../../../metaData';
import { makeGetOptionsVisibility } from './rulesOptionsVisibility.selectors';

const effectKeys = {
  SHOW_OPTION_GROUPS: 'showOptionGroups',
  HIDE_OPTION_GROUPS: 'hideOptionGroups',
  HIDE_OPTIONS: 'hideOptions',
};

const allFilters = [
  {
    key: effectKeys.SHOW_OPTION_GROUPS,
    createFilter: (showGroupEffects: Array<Object>, optionGroups: Map<string, OptionGroup>) => {
      const showOptionGroups = showGroupEffects.map((effect) =>
        optionGroups.get(effect.optionGroupId),
      );

      return (option: any) => showOptionGroups.some((og) => og && !!og.optionIds.get(option.id));
    },
  },
  {
    key: effectKeys.HIDE_OPTION_GROUPS,
    createFilter: (hideGroupEffects: Array<Object>, optionGroups: Map<string, OptionGroup>) => {
      const hideOptionGroups = hideGroupEffects.map((effect) =>
        optionGroups.get(effect.optionGroupId),
      );
      return (option: any) => !hideOptionGroups.some((og) => og && !!og.optionIds.get(option.id));
    },
  },
  {
    key: effectKeys.HIDE_OPTIONS,
    createFilter: (hideOptionEffects: Array<Object>) => (option: any) =>
      !hideOptionEffects.some((o) => o.optionId === option.id),
  },
];

type Props = {
  optionGroups: Map<string, OptionGroup>,
  options: Array<{ id: string }>,
  rulesOptionsVisibility: { [key: $Values<typeof effectKeys>]: Array<any> },
};

const getCreateRulesOptionsVisibilityHandlerHOC = (InnerComponent: React.ComponentType<any>) =>
  class CreateRulesOptionsVisibilityHandlerHOC extends React.Component<Props> {
    static getFilteredOptions = (props: Props) => {
      const { options, rulesOptionsVisibility, optionGroups } = props;

      const filters = allFilters
        .filter((f) => rulesOptionsVisibility[f.key] && rulesOptionsVisibility[f.key].length > 0)
        // $FlowFixMe
        .map((f) => f.createFilter(rulesOptionsVisibility[f.key], optionGroups));

      // $FlowFixMe[missing-annot] automated comment
      return options.filter((option) => filters.every((f) => f(option)));
    };

    filteredOptions: any;

    constructor(props: Props) {
      super(props);

      this.filteredOptions = CreateRulesOptionsVisibilityHandlerHOC.getFilteredOptions(props);
    }

    UNSAFE_componentWillReceiveProps(newProps: Props) {
      if (newProps.rulesOptionsVisibility !== this.props.rulesOptionsVisibility) {
        this.filteredOptions = CreateRulesOptionsVisibilityHandlerHOC.getFilteredOptions(newProps);
      }
    }

    render() {
      const { options, ...passOnProps } = this.props;

      return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <InnerComponent options={this.filteredOptions} {...passOnProps} />
      );
    }
  };

const makeMapStateToProps = () => {
  const getOptionsVisibility = makeGetOptionsVisibility();

  const mapStateToProps = (state: ReduxState, props: Object) => ({
    rulesOptionsVisibility: getOptionsVisibility(state, props),
  });
  // $FlowFixMe[not-an-object] automated comment
  return mapStateToProps;
};

export default () => (InnerComponent: React.ComponentType<any>) =>
  // $FlowFixMe[missing-annot] automated comment
  connect(makeMapStateToProps, () => ({}))(
    getCreateRulesOptionsVisibilityHandlerHOC(InnerComponent),
  );
