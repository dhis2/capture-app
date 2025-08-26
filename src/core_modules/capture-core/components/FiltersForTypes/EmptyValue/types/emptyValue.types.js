// @flow
export type EmptyValueFilterCheckboxesProps = {
    value: ?string,
    onEmptyChange: ({| checked: boolean |}) => void,
    onNotEmptyChange: ({| checked: boolean |}) => void,
};

export type EmptyValueFilterData = {|
    value: string,
    isEmpty?: boolean,
|};
