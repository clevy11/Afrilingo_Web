import React from 'react';
import { Navigate } from 'react-router-dom';
import { roleUtils, UserRole } from '@/utils/roleUtils';
import { authService } from '@/services/authService';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/' 
}: RoleProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const currentRole = roleUtils.getCurrentUserRole();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If authenticated but role not allowed, show access denied
  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-amber-200">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Access Denied</h2>
            <p className="text-amber-700 mb-6">
              You don't have permission to access this page. Your current role ({roleUtils.getUserDisplayRole()}) 
              is not authorized for this section.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
