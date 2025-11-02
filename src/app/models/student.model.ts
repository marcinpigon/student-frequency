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
