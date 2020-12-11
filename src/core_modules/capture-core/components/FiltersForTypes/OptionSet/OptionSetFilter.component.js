// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SelectBoxes from '../../FormFields/Options/SelectBoxes/SelectBoxes.component';
import { orientations } from '../../FormFields/Options/MultiSelectBoxes/multiSelectBoxes.const';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import {
  getSingleSelectOptionSetFilterData,
  getMultiSelectOptionSetFilterData,
} from './optionSetFilterDataGetter';
import type { UpdatableFilterContent } from '../filters.types';

const getStyles = (theme: Theme) => ({
  selectBoxesContainer: {
    maxHeight: theme.typography.pxToRem(250),
    overflowY: 'auto',
    marginRight: theme.typography.pxToRem(-24),
  },
});

type Props = {
  optionSet: OptionSet,
  value: any,
  onCommitValue: (value: any) => void,
  classes: {
    selectBoxesContainer: string,
  },
  singleSelect?: ?boolean,
};
// $FlowSuppress
// $FlowFixMe[incompatible-variance] automated comment
// $FlowFixMe[cannot-resolve-name] automated comment
class OptionSetFilter extends Component<Props> implements UpdatableFilterContent<Value> {
  onGetUpdateData() {
    const { value, singleSelect } = this.props;

    if (!value) {
      return null;
    }

    if (singleSelect) {
      return getSingleSelectOptionSetFilterData(value);
    }

    return getMultiSelectOptionSetFilterData(value);
  }

  onIsValid() {
    //eslint-disable-line
    return true;
  }

  render() {
    const { onCommitValue, optionSet, value, classes, singleSelect } = this.props;

    return (
      <div className={classes.selectBoxesContainer}>
        <SelectBoxes
          optionSet={optionSet}
          value={value}
          onBlur={onCommitValue}
          orientation={orientations.VERTICAL}
          multiSelect={!singleSelect}
        />
      </div>
    );
  }
}

export default withStyles(getStyles)(OptionSetFilter);
