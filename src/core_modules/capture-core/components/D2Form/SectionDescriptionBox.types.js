// @flow
export type Props = {|
    description: string,
|};

export type PlainProps = {|
    classes: {
        descriptionBox: string,
        icon: string,
        description: string,
    },
    ...Props,
|};
