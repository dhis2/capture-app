const MAX_FILTER_LABEL_LENGTH = 35;

export const buildFilterLabel = (title: string, valueLabel = ''): string =>
    (valueLabel ? `${title}: ${valueLabel}` : title);

export const truncateFilterLabel = (label: string): string => {
    if (label.length <= MAX_FILTER_LABEL_LENGTH) return label;
    return `${label.substring(0, MAX_FILTER_LABEL_LENGTH - 3).trimEnd()}...`;
};

export const isFilterLabelTruncated = (label: string): boolean =>
    label.length > MAX_FILTER_LABEL_LENGTH;
