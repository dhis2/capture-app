// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import defaultClasses from './table.module.css';

type Props = {
  currentPage: number,
  rowsCountSelector?: ?React.Node,
  rowsCountSelectorLabel?: ?string,
  navigationElements: React.Node,
};

class Pagination extends React.Component<Props> {
  static getRowsCountElement(rowsCountSelectorLabel?: ?string, rowsCountSelector?: ?React.Node) {
    if (!rowsCountSelector) {
      return null;
    }

    return rowsCountSelectorLabel ? (
      <div className={defaultClasses.paginationRowsPerPageElementContainer}>
        {rowsCountSelectorLabel}:
        <span className={defaultClasses.paginationRowsPerPageElement}>{rowsCountSelector}</span>
      </div>
    ) : (
      rowsCountSelector
    );
  }

  render() {
    const {
      currentPage,
      rowsCountSelector,
      rowsCountSelectorLabel,
      navigationElements,
    } = this.props;

    const rowsCountElement = Pagination.getRowsCountElement(
      rowsCountSelectorLabel,
      rowsCountSelector,
    );
    return (
      <div data-test="dhis2-capture-pagination" className={defaultClasses.pagination}>
        {rowsCountElement}
        {currentPage && (
          <div className={defaultClasses.paginationDisplayRowsContainer}>
            {i18n.t('Page {{currentPage}}', { currentPage })}
          </div>
        )}
        {navigationElements}
      </div>
    );
  }
}

export default Pagination;
