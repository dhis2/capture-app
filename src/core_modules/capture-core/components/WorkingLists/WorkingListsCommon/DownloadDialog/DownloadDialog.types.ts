export type Props = {
    request: { url: string; queryParams?: any };
    open: boolean;
    onClose: () => void;
};

export type PlainProps = {
    open: boolean;
    onClose: () => void;
    absoluteApiPath: string;
    request?: { url: string; queryParams?: any };
};
