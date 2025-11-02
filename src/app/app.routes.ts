import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './students/students.component';
import { FrequencyComponent } from './frequency/frequency.component';
import { AttendanceComponent } from './attendance/attendance.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'frequency', component: FrequencyComponent },
  { path: 'reports', component: DashboardComponent }, // Placeholder
  { path: 'settings', component: DashboardComponent }, // Placeholder
];
