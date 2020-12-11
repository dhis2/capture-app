// @flow
import * as React from 'react';
import { SplitButton, Menu, MenuItem } from '@dhis2/ui';

type Item = {
  key: string,
  text: string,
  onClick: ?Function,
};

type Props = {
  dropDownItems: Array<Item>,
};

const SimpleSplitButton = (props: Props) => {
  const { dropDownItems, ...passOnProps } = props;
  return (
    // $FlowFixMe[cannot-spread-inexact] automated comment
    <SplitButton
      component={
        <Menu>
          {dropDownItems.map((i) => (
            <MenuItem label={i.text} value={i.text} onClick={i.onClick} />
          ))}
        </Menu>
      }
      {...passOnProps}
    />
  );
};
export default SimpleSplitButton;
