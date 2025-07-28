import type { OptionSet } from '../../../../metaData';
import { orientations } from './selectBoxes.const';

type BaseProps = {
    multiSelect?: boolean | null;
    orientation?: typeof orientations[keyof typeof orientations] | null;
    onBlur: (value: any) => void;
    label?: string;
    value?: any;
    required?: boolean | null;
};

type SingleSelectBaseProps<OptionsType> = Readonly<BaseProps & {
    nullable?: boolean;
} & OptionsType>;

type MultiSelectBaseProps<OptionsType> = Readonly<BaseProps & {
    style?: any | null;
    passOnClasses?: any | null;
} & OptionsType>;

type WithOptionSet = {
    optionSet: OptionSet;
    options?: null;
};

export type Options = Array<{text: string; value: any}>;

type WithOptions = {
    options: Options;
    optionSet: null;
};

export type Props =
    | SingleSelectBaseProps<WithOptionSet>
    | SingleSelectBaseProps<WithOptions>
    | MultiSelectBaseProps<WithOptionSet>
    | MultiSelectBaseProps<WithOptions>;
