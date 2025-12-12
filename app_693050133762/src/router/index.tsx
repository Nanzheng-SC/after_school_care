import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

import P_login_register from '../pages/p-login_register';
import P_home from '../pages/p-home';
import P_parent_center from '../pages/p-parent_center';
import P_teen_info_manage from '../pages/p-teen_info_manage';
import P_course_list from '../pages/p-course_list';
import P_course_detail from '../pages/p-course_detail';
import P_match_result from '../pages/p-match_result';
import P_my_courses from '../pages/p-my_courses';
import P_evaluation_submit from '../pages/p-evaluation_submit';
import P_refund_apply from '../pages/p-refund_apply';
import P_teacher_center from '../pages/p-teacher_center';
import P_course_publish from '../pages/p-course_publish';
import P_teacher_course_schedule from '../pages/p-teacher_course_schedule';
import P_student_match from '../pages/p-student_match';
import P_teacher_eval_stats from '../pages/p-teacher_eval_stats';
import P_admin_dashboard from '../pages/p-admin_dashboard';
import P_admin_user_manage from '../pages/p-admin_user_manage';
import P_admin_community_manage from '../pages/p-admin_community_manage';
import P_admin_course_manage from '../pages/p-admin_course_manage';
import P_admin_evaluation_manage from '../pages/p-admin_evaluation_manage';
import P_admin_refund_manage from '../pages/p-admin_refund_manage';
import P_admin_system_config from '../pages/p-admin_system_config';
import P_admin_report from '../pages/p-admin_report';
import P_payment_confirm from '../pages/p-payment_confirm';
import P_course_calendar from '../pages/p-course_calendar';
import P_evaluation_view from '../pages/p-evaluation_view';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

function Listener() {
  const location = useLocation();
  useEffect(() => {
    const pageId = 'P-' + location.pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', location.pathname, ', search:', location.search);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: location.pathname,
        search: location.search,
      }, '*');
    }
  }, [location]);

  return <Outlet />;
}

// 使用 createBrowserRouter 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <Listener />,
    children: [
      {
    path: '/',
    element: <Navigate to='/login-register' replace={true} />,
  },
      {
    path: '/login-register',
    element: (
      <ErrorBoundary>
        <P_login_register />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/home',
    element: (
      <ErrorBoundary>
        <P_home />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/parent-center',
    element: (
      <ErrorBoundary>
        <P_parent_center />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/teen-info-manage',
    element: (
      <ErrorBoundary>
        <P_teen_info_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/course-list',
    element: (
      <ErrorBoundary>
        <P_course_list />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/course-detail',
    element: (
      <ErrorBoundary>
        <P_course_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/match-result',
    element: (
      <ErrorBoundary>
        <P_match_result />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/my-courses',
    element: (
      <ErrorBoundary>
        <P_my_courses />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/evaluation-submit',
    element: (
      <ErrorBoundary>
        <P_evaluation_submit />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/refund-apply',
    element: (
      <ErrorBoundary>
        <P_refund_apply />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/teacher-center',
    element: (
      <ErrorBoundary>
        <P_teacher_center />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/course-publish',
    element: (
      <ErrorBoundary>
        <P_course_publish />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/teacher-course-schedule',
    element: (
      <ErrorBoundary>
        <P_teacher_course_schedule />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/student-match',
    element: (
      <ErrorBoundary>
        <P_student_match />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/teacher-eval-stats',
    element: (
      <ErrorBoundary>
        <P_teacher_eval_stats />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-dashboard',
    element: (
      <ErrorBoundary>
        <P_admin_dashboard />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-user-manage',
    element: (
      <ErrorBoundary>
        <P_admin_user_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-community-manage',
    element: (
      <ErrorBoundary>
        <P_admin_community_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-course-manage',
    element: (
      <ErrorBoundary>
        <P_admin_course_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-evaluation-manage',
    element: (
      <ErrorBoundary>
        <P_admin_evaluation_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-refund-manage',
    element: (
      <ErrorBoundary>
        <P_admin_refund_manage />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-system-config',
    element: (
      <ErrorBoundary>
        <P_admin_system_config />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/admin-report',
    element: (
      <ErrorBoundary>
        <P_admin_report />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/payment-confirm',
    element: (
      <ErrorBoundary>
        <P_payment_confirm />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/course-calendar',
    element: (
      <ErrorBoundary>
        <P_course_calendar />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/evaluation-view',
    element: (
      <ErrorBoundary>
        <P_evaluation_view />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '*',
    element: <NotFoundPage />,
  },
    ]
  }
]);

export default router;