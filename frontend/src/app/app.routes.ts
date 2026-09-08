import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/core/welcome/welcome.component';
import { GuestAuthComponent } from './features/guest/guest-auth/guest-auth.component';
import { GuestLayoutComponent } from './features/guest/guest-layout/guest-layout.component';
import { StaffAuthComponent } from './features/staff/staff-auth/staff-auth.component';
import { StaffDashboardComponent } from './features/staff/staff-dashboard/staff-dashboard.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminRequestsComponent } from './features/admin/admin-requests/admin-requests.component';
import { StaffManagementComponent } from './features/admin/staff-management/staff-management.component';
import { AnalyticsComponent } from './features/admin/analytics/analytics.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent, pathMatch: 'full' },
    { path: 'login/:token', component: GuestAuthComponent },
    { path: 'room/:token', component: GuestLayoutComponent },
    { path: 'staff', redirectTo: '/staff/login', pathMatch: 'full' },
    { path: 'staff/login', component: StaffAuthComponent },
    { path: 'staff/dashboard', component: StaffDashboardComponent },
    // All admin pages share the AdminLayoutComponent shell (sidebar stays visible)
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'requests', component: AdminRequestsComponent },
            { path: 'staff', component: StaffManagementComponent },
            { path: 'analytics', component: AnalyticsComponent },
        ]
    }
];
