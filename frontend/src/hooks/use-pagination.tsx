import { Pagination } from "@/config/pagination";
import React from "react";

export function usePagination() {
  const [pagination, setPagination] = React.useState({
    pageSize: Pagination.LIMIT,
    pageIndex: 0,
  });
  const { pageSize, pageIndex } = pagination;

  return {
    limit: pageSize,
    onPaginationChange: setPagination,
    pagination,
    skip: pageSize * pageIndex,
  };
}