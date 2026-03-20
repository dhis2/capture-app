export const MAX_FILTER_LABEL_LENGTH = 20;

export const truncateFilterLabelForTest = (label) => {
    if (label.length <= MAX_FILTER_LABEL_LENGTH) return label;
    return `${label.substring(0, MAX_FILTER_LABEL_LENGTH - 3).trimEnd()}...`;
};
