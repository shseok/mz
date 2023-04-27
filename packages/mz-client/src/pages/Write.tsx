import React from 'react';
import BasicLayout from '~/components/layout/BasicLayout';
import { useProtectedRoute } from '~/hooks/useProtectedRoute';

const Write = () => {
  const hasPermission = useProtectedRoute();
  if (!hasPermission) {
    return null;
  }
  return <BasicLayout title='새 글 작성' hasBackButton></BasicLayout>;
};

export default Write;