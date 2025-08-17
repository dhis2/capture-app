export type Size = 'extrasmall' | 'small' | 'medium' | 'large' | 'extralarge';

export type OwnProps = {
    imageUrl: string;
    dataTest: string;
    className: any;
    size: Size;
};

export type Props = OwnProps & {
    classes: any;
};
