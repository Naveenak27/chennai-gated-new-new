import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className={classnames("pagination-container", className)}>
      {/* Left Arrow */}
      <li
        className={classnames("pagination-item", {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>

      {/* Page Numbers */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li key={index} className="pagination-item dots">
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={index}
            className={classnames("pagination-item", {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}

      {/* Right Arrow */}
      <li
        className={classnames("pagination-item", {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>

      <style>
        {`
          .pagination-container {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0;
            list-style: none;
            margin: 20px 0;
            justify-content: center;
          }
          
          .pagination-item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            width: 32px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            border: 1px solid #ddd;
            color: #666;
          }
          
          .pagination-item:hover {
            background-color: #f0f0f0;
          }
          
          .pagination-item.selected {
            background-color: #033;
            color: white;
            border: none;
          }
          
          .pagination-item.selected:hover {
            background-color: #033;
          }
          
          .pagination-item.disabled {
            cursor: not-allowed;
            opacity: 0.5;
            pointer-events: none;
          }
          
          .pagination-item.dots {
            cursor: default;
            border: none;
          }
          
          .pagination-item.dots:hover {
            background-color: transparent;
          }
          
          .arrow {
            width: 8px;
            height: 8px;
            border: solid #666;
            border-width: 0 2px 2px 0;
            padding: 2px;
          }
          
          .left {
            transform: rotate(135deg);
          }
          
          .right {
            transform: rotate(-45deg);
          }
          
          @media screen and (max-width: 480px) {
            .pagination-container {
              gap: 4px;
            }
          
            .pagination-item {
              height: 28px;
              width: 28px;
              font-size: 12px;
            }
          
            .arrow {
              width: 6px;
              height: 6px;
            }
          }
        `}
      </style>
    </ul>
  );
};

export default Pagination;