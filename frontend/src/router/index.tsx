import { createBrowserRouter, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import Layout from '../components/Layout';
import AdminLayout from '../components/AdminLayout';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

import P_parent_center from '../pages/p-parent_center';
import P_children_manage from '../pages/p-children_manage';
import P_teen_info_manage from '../pages/p-teen_info_manage';
import P_course_list from '../pages/p-course_list';
import P_match_result from '../pages/p-match_result';
import P_my_courses from '../pages/p-my_courses';
import P_course_calendar from '../pages/p-course_calendar';
import P_course_detail from '../pages/p-course_detail';
import P_login_register from '../pages/p-login_register';
import P_home from '../pages/p-home';

import P_teacher_center from '../pages/p-teacher_center/index';
import P_course_management from '../pages/p-teacher_center/CourseManagement';
import P_evaluation_management from '../pages/p-teacher_center/EvaluationManagement';
import P_schedule from '../pages/p-teacher_center/Schedule';
import P_system_settings from '../pages/p-teacher_center/SystemSettings';

import P_admin_dashboard from '../pages/p-admin_dashboard';
import P_admin_community_manage from '../pages/p-admin_community_manage';
import P_admin_course_manage from '../pages/p-admin_course_manage';
import P_admin_evaluation_manage from '../pages/p-admin_evaluation_manage';
import P_admin_user_manage from '../pages/p-admin_user_manage';
import P_admin_system_config from '../pages/p-admin_system_config';
import P_admin_report from '../pages/p-admin_report';

import P_course_publish from '../pages/p-course_publish';
import P_evaluation_submit from '../pages/p-evaluation_submit';
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
    element: (
      <AuthProvider>
        <Listener />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
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
            <Layout userRole="parent">
              <P_parent_center />
            </Layout>
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'teen-info-manage',
            element: (
              <ErrorBoundary>
                <P_teen_info_manage />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'children-manage',
            element: (
              <ErrorBoundary>
                <P_children_manage />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
        ],
      },


      {
        path: '/teacher-center',
        element: (
          <ErrorBoundary>
            <ProtectedRoute requiredRole="teacher">
              <P_teacher_center />
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'courses',
            element: (
              <ErrorBoundary>
                <ProtectedRoute requiredRole="teacher">
                  <P_course_management />
                </ProtectedRoute>
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'evaluations',
            element: (
              <ErrorBoundary>
                <ProtectedRoute requiredRole="teacher">
                  <P_evaluation_management />
                </ProtectedRoute>
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'schedule',
            element: (
              <ErrorBoundary>
                <ProtectedRoute requiredRole="teacher">
                  <P_schedule />
                </ProtectedRoute>
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'settings',
            element: (
              <ErrorBoundary>
                <ProtectedRoute requiredRole="teacher">
                  <P_system_settings />
                </ProtectedRoute>
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: '/admin',
        element: (
          <ErrorBoundary>
            <AdminLayout />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'dashboard',
            element: (
              <ErrorBoundary>
                <P_admin_dashboard />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'community-manage',
            element: (
              <ErrorBoundary>
                <P_admin_community_manage />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'course-manage',
            element: (
              <ErrorBoundary>
                <P_admin_course_manage />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'evaluation-manage',
            element: (
              <ErrorBoundary>
                <P_admin_evaluation_manage />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'user-manage',
            element: (
              <ErrorBoundary>
                <P_admin_user_manage />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'system-config',
            element: (
              <ErrorBoundary>
                <P_admin_system_config />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'report',
            element: (
              <ErrorBoundary>
                <P_admin_report />
              </ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
          },
        ]
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
        path: '/evaluation-submit',
        element: (
          <ErrorBoundary>
            <P_evaluation_submit />
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

      // 登录注册页面
      {
        path: '/login-register',
        element: (
          <ErrorBoundary>
            <P_login_register />
          </ErrorBoundary>
        ),
        errorElement: <ErrorPage />,
      },

      // 管理员路径重定向
      {
        path: '/admin-dashboard',
        element: <Navigate to="/admin/dashboard" replace />,
        errorElement: <ErrorPage />,
      },

      // 课程相关页面
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
        path: '/course-calendar',
        element: (
          <ErrorBoundary>
            <P_course_calendar />
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
        path: '*',
        element: <NotFoundPage />,
      },
    ]
  }
]);

export default router;