// @flow

export default function (value: string) {
    return {
        requestData: `like:${value}`,
        appliedText: value,
    };
}
