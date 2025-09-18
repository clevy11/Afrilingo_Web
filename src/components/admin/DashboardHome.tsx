
import React from 'react';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { PopularCourses } from './PopularCourses';
import { RecentCertificates } from './RecentCertificates';
import { RecentProctorEvents } from './RecentProctorEvents';
import { roleUtils } from '@/utils/roleUtils';

export function DashboardHome() {
  const isAdmin = roleUtils.isAdmin();
  const userRole = roleUtils.getUserDisplayRole();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl p-6 sm:p-8 shadow-lg border border-amber-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-red-300/20 to-pink-300/20 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="text-4xl">👋</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">Muraho</h2>
              <p className="text-amber-700 text-base sm:text-lg">
                Welcome to Afrilingo - {isAdmin ? 'Administrative Dashboard' : 'Content Management Hub'}
              </p>
            </div>
          </div>
          
          {/* Current Learning Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-amber-200/50 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🇷🇼</div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900">Currently Role: {userRole}</h3>
                <p className="text-sm text-amber-700">Rwanda's beautiful native language</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {userRole} Access
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {isAdmin ? 'Full System Access' : 'Content Management'}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  User Management
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-medium text-amber-800 mb-1">Platform Status</div>
              <div className="text-xs text-amber-600">All systems operational</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium text-amber-800 mb-1">Growth This Week</div>
              <div className="text-xs text-amber-600">+23% new Kinyarwanda learners</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-sm font-medium text-amber-800 mb-1">Global Reach</div>
              <div className="text-xs text-amber-600">Rwanda & diaspora communities</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards - Only show for admins */}
      {isAdmin && <StatsCards />}
      
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Actions and Activity */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <QuickActions />
          {/* <PopularCourses /> */}
        </div>
        
        {/* Right Column - Activity and Backend-backed widgets */}
        <div className="space-y-6 lg:space-y-8">
          {/* <RecentActivity /> */}
          {isAdmin && (
            <>
              <RecentCertificates />
              <RecentProctorEvents />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
