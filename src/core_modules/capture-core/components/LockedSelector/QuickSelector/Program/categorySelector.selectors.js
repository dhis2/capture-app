// @flow
import { createSelector } from 'reselect';

const filteredOptionsSelector = (data) => data.options;
const onSelectFromPropsSelector = (data) => data.onSelect;

export const makeOnSelectSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(
    filteredOptionsSelector,
    onSelectFromPropsSelector,
    (filteredOptions, onSelect) => (optionId) => {
      const option = filteredOptions.find((o) => o.value === optionId);

      onSelect({
        name: option.label,
        id: option.value,
        writeAccess: option.writeAccess,
      });
    },
  );
