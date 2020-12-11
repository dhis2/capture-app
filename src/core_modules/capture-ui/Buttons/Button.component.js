// @flow
import * as React from 'react';

import MuiButton from '@material-ui/core/Button';

const buttonKinds = {
  basic: 'basic',
  primary: 'primary',
  secondary: 'secondary',
  destructive: 'destructive',
};

const buttonKindDefinitions = {
  basic: {
    color: 'primary',
    variant: 'text',
  },
  primary: {
    color: 'primary',
    variant: 'raised',
  },
  secondary: {
    color: 'secondary',
    variant: 'raised',
  },
  destructive: {
    color: undefined,
    variant: 'raised',
  },
};

const buttonSizes = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

type Props = {
  kind?: $Values<typeof buttonKinds>,
  size?: $Values<typeof buttonSizes>,
  disabled?: boolean,
  onClick?: ?() => void,
  children: any,
  className: string,
};

class Button extends React.Component<Props> {
  static defaultProps = {
    size: buttonSizes.medium,
    kind: buttonKinds.basic,
    disabled: false,
  };

  render() {
    const { kind, size, disabled, onClick, children, className } = this.props;

    return (
      <MuiButton
        className={className}
        size={size}
        onClick={onClick}
        disabled={disabled}
        color={kind && buttonKindDefinitions[kind].color}
        variant={kind && buttonKindDefinitions[kind].variant}
      >
        {children}
      </MuiButton>
    );
  }
}

export default Button;
