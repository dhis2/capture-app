// @flow
export type PlainProps = {|
    description: string,
|};

export type Props = {|
    classes: {
        descriptionBox: string,
        icon: string,
        description: string,
    },
    ...PlainProps,
|};
