// @flow
import type { OptionSet } from '../../../../metaData';
import { orientations } from './selectBoxes.const';

type BaseProps = {|
    multiSelect?: ?boolean,
    orientation?: ?$Values<typeof orientations>,
    onBlur: (value: any) => void,
    label?: string,
    value?: any,
    required?: ?boolean,
|};
type SingleSelectBaseProps<OptionsType> = $ReadOnly<{|
    ...BaseProps,
    nullable?: boolean,
    ...OptionsType,
|}>;

type MultiSelectBaseProps<OptionsType> = $ReadOnly<{|
    ...BaseProps,
    style?: ?Object,
    passOnClasses?: ?Object,
    ...OptionsType,
|}>;

type WithOptionSet = {|
    optionSet: OptionSet,
    options: null,
|};

export type Options = Array<{text: string, value: any}>;

type WithOptions = {|
    options: Options,
    optionSet: null,
|};
export type Props =
    SingleSelectBaseProps<WithOptionSet> |
    SingleSelectBaseProps<WithOptions> |
    MultiSelectBaseProps<WithOptionSet> |
    MultiSelectBaseProps<WithOptions>;
