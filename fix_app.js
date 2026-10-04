const fs = require('fs');
let content = fs.readFileSync('uniquecare/frontend/src/App.tsx', 'utf8');

// Conflict 1: Imports
const importsFix = `import { SmartRoutingSection, WhatHappensNextSection } from './components/public/UniquesCommunitySections'
import { PreventiveMaintenanceSection } from './components/public/PreventiveMaintenanceSection'
import { StudentDashboard } from './components/student/StudentDashboard'
import { TechnicianDashboard } from './components/technician/TechnicianDashboard'
import { AdminDashboard } from './components/AdminDashboard'
import Hero3DHub from './components/public/Hero3DHub'
import StarBorder from './components/shared/StarBorder'
import { Footer } from './components/shared/Footer'
import { ProtectedRoute, getDefaultDashboard } from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import type { DisplayRole } from './context/AuthContext'`;

content = content.replace(/<<<<<<< HEAD\nimport { SmartRoutingSection[\s\S]*?=======\n[\s\S]*?>>>>>>> 9ed745b[^\n]*\n/, importsFix + '\n');

// Conflict 2: allNavLinks
const navLinksFix = `const allNavLinks: readonly [string, string, typeof GraduationCap, readonly DisplayRole[]][] = [
  ['/student', 'Student Portal', GraduationCap, ['Student']],
  ['/technician', 'Technician Queue', Wrench, ['Tech']],
  ['/dashboard', 'Admin Dashboard', LayoutDashboard, ['Admin']],
  ['/issues', 'Issues Tracker', ClipboardList, ['Admin', 'Tech']],
  ['/report', 'Report via QR', QrCode, ['Admin', 'Student']],
  ['/inventory', 'Inventory DB', Grid2X2, ['Admin', 'Tech']],
  ['/analytics', 'Analytics', BarChart3, ['Admin']],
]`;

content = content.replace(/<<<<<<< HEAD\nconst allNavLinks[\s\S]*?=======\n[\s\S]*?>>>>>>> 9ed745b[^\n]*\n/, navLinksFix + '\n');

// Conflict 3: Nav mapping
const navMappingFix = `          {allNavLinks
            .filter(([, , , roles]) => (roles as readonly string[]).includes(role))
            .map(([to, label, Icon]) => (
            <NavLink key={to} to={to as string} onClick={() => setSideOpen(false)}>`;

content = content.replace(/<<<<<<< HEAD\n          {allNavLinks[\s\S]*?=======\n[\s\S]*?>>>>>>> 9ed745b[^\n]*\n/, navMappingFix + '\n');

// Conflict 4: Routes
const routesFix = `          <Route path="/" element={<Navigate to={getDefaultDashboard(user?.role || 'student')} replace />} />
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard records={records} onAddRecord={(newR) => setRecords([newR, ...records])} onSelectIssue={setSelectedIssue} />
            </ProtectedRoute>
          } />
          <Route path="/technician" element={
            <ProtectedRoute allowedRoles={['technician']}>
              <TechnicianDashboard records={records} onStatusChange={handleStatusChange} onSelectIssue={setSelectedIssue} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'lab_admin']}>
              <AdminDashboard records={records} onSelectIssue={setSelectedIssue} />
            </ProtectedRoute>
          } />
          <Route path="/issues" element={
            <ProtectedRoute allowedRoles={['admin', 'lab_admin', 'technician']}>
              <Issues records={records} onSelectIssue={setSelectedIssue} />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute allowedRoles={['admin', 'lab_admin', 'student']}>
              <Report onAddRecord={(newR) => setRecords([newR, ...records])} />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['admin', 'lab_admin', 'technician']}>
              <Inventory assets={assets} onAddAsset={(newA) => setAssets([newA, ...assets])} />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute allowedRoles={['admin', 'lab_admin']}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute allowedRoles={['technician']}>
              <TechnicianDashboard records={records} onStatusChange={handleStatusChange} onSelectIssue={setSelectedIssue} />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to={getDefaultDashboard(user?.role || 'student')} replace />} />`;

content = content.replace(/<<<<<<< HEAD\n          <Route path="\/[\s\S]*?=======\n[\s\S]*?>>>>>>> 9ed745b[^\n]*\n/, routesFix + '\n');

fs.writeFileSync('uniquecare/frontend/src/App.tsx', content);
