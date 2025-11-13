export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  classId: string;
  enrollmentDate: Date;
  isActive: boolean;
  studentNumber?: string;
}

export interface StudentClass {
  id: string;
  name: string;
  description?: string;
  academicYear: string;
  semester: string;
  createdAt: Date;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  period: 'semester' | 'year';
  semester?: string;
  academicYear: string;
  hoursPresent: number;
  hoursAbsent: number;
  totalHours: number;
  notes?: string;
}

export interface FrequencyReport {
  classId: string;
  className: string;
  period: 'semester' | 'year';
  academicYear: string;
  semester?: string;
  totalClassHours: number;
  studentReports: StudentFrequencyReport[];
  classAveragePresence: number;
  classAverageAbsence: number;
  generatedAt: Date;
}

export interface StudentFrequencyReport {
  studentId: string;
  studentName: string;
  totalHoursPresent: number;
  totalHoursAbsent: number;
  totalHours: number;
  presencePercentage: number;
  absencePercentage: number;
}
