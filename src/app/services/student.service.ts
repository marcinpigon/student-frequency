import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Student,
  StudentClass,
  AttendanceRecord,
  FrequencyReport,
  StudentFrequencyReport,
} from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly STUDENTS_KEY = 'students';
  private readonly CLASSES_KEY = 'classes';
  private readonly ATTENDANCE_KEY = 'attendance';

  private studentsSubject = new BehaviorSubject<Student[]>(this.loadStudents());
  private classesSubject = new BehaviorSubject<StudentClass[]>(
    this.loadClasses()
  );
  private attendanceSubject = new BehaviorSubject<AttendanceRecord[]>(
    this.loadAttendance()
  );

  students$ = this.studentsSubject.asObservable();
  classes$ = this.classesSubject.asObservable();
  attendance$ = this.attendanceSubject.asObservable();

  constructor() {}

  // Student CRUD Operations
  getStudents(): Student[] {
    return this.studentsSubject.value;
  }

  getStudentById(id: string): Student | undefined {
    return this.studentsSubject.value.find((s) => s.id === id);
  }

  getStudentsByClass(classId: string): Student[] {
    return this.studentsSubject.value.filter((s) => s.classId === classId);
  }

  addStudent(student: Omit<Student, 'id'>): Student {
    const newStudent: Student = {
      ...student,
      id: this.generateId(),
    };
    const students = [...this.studentsSubject.value, newStudent];
    this.saveStudents(students);
    this.studentsSubject.next(students);
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>): boolean {
    const students = this.studentsSubject.value.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    const found = students.some((s) => s.id === id);
    if (found) {
      this.saveStudents(students);
      this.studentsSubject.next(students);
    }
    return found;
  }

  deleteStudent(id: string): boolean {
    const students = this.studentsSubject.value.filter((s) => s.id !== id);
    const wasDeleted = students.length < this.studentsSubject.value.length;
    if (wasDeleted) {
      this.saveStudents(students);
      this.studentsSubject.next(students);
    }
    return wasDeleted;
  }

  // Class CRUD Operations
  getClasses(): StudentClass[] {
    return this.classesSubject.value;
  }

  getClassById(id: string): StudentClass | undefined {
    return this.classesSubject.value.find((c) => c.id === id);
  }

  addClass(classData: Omit<StudentClass, 'id'>): StudentClass {
    const newClass: StudentClass = {
      ...classData,
      id: this.generateId(),
    };
    const classes = [...this.classesSubject.value, newClass];
    this.saveClasses(classes);
    this.classesSubject.next(classes);
    return newClass;
  }

  updateClass(id: string, updates: Partial<StudentClass>): boolean {
    const classes = this.classesSubject.value.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    const found = classes.some((c) => c.id === id);
    if (found) {
      this.saveClasses(classes);
      this.classesSubject.next(classes);
    }
    return found;
  }

  deleteClass(id: string): boolean {
    // Check if any students are assigned to this class
    const studentsInClass = this.getStudentsByClass(id);
    if (studentsInClass.length > 0) {
      return false; // Cannot delete class with students
    }

    const classes = this.classesSubject.value.filter((c) => c.id !== id);
    const wasDeleted = classes.length < this.classesSubject.value.length;
    if (wasDeleted) {
      this.saveClasses(classes);
      this.classesSubject.next(classes);
    }
    return wasDeleted;
  }

  // Local Storage Operations
  private loadStudents(): Student[] {
    try {
      const data = localStorage.getItem(this.STUDENTS_KEY);
      if (data) {
        const students = JSON.parse(data);
        // Convert date strings back to Date objects
        return students.map((s: any) => ({
          ...s,
          enrollmentDate: new Date(s.enrollmentDate),
        }));
      }
    } catch (error) {
      console.error('Error loading students from localStorage:', error);
    }
    return [];
  }

  private saveStudents(students: Student[]): void {
    try {
      localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(students));
    } catch (error) {
      console.error('Error saving students to localStorage:', error);
    }
  }

  private loadClasses(): StudentClass[] {
    try {
      const data = localStorage.getItem(this.CLASSES_KEY);
      if (data) {
        const classes = JSON.parse(data);
        // Convert date strings back to Date objects
        return classes.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
      }
    } catch (error) {
      console.error('Error loading classes from localStorage:', error);
    }
    return [];
  }

  private saveClasses(classes: StudentClass[]): void {
    try {
      localStorage.setItem(this.CLASSES_KEY, JSON.stringify(classes));
    } catch (error) {
      console.error('Error saving classes to localStorage:', error);
    }
  }

  private loadAttendance(): AttendanceRecord[] {
    try {
      const data = localStorage.getItem(this.ATTENDANCE_KEY);
      if (data) {
        const attendance = JSON.parse(data);
        return attendance.map((a: any) => ({
          ...a,
          date: new Date(a.date),
        }));
      }
    } catch (error) {
      console.error('Error loading attendance from localStorage:', error);
    }
    return [];
  }

  private saveAttendance(attendance: AttendanceRecord[]): void {
    try {
      localStorage.setItem(this.ATTENDANCE_KEY, JSON.stringify(attendance));
    } catch (error) {
      console.error('Error saving attendance to localStorage:', error);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility Methods
  clearAllData(): void {
    localStorage.removeItem(this.STUDENTS_KEY);
    localStorage.removeItem(this.CLASSES_KEY);
    this.studentsSubject.next([]);
    this.classesSubject.next([]);
  }

  exportData(): { students: Student[]; classes: StudentClass[] } {
    return {
      students: this.getStudents(),
      classes: this.getClasses(),
    };
  }

  importData(data: { students: Student[]; classes: StudentClass[] }): void {
    if (data.classes) {
      this.saveClasses(data.classes);
      this.classesSubject.next(data.classes);
    }
    if (data.students) {
      this.saveStudents(data.students);
      this.studentsSubject.next(data.students);
    }
  }

  // Attendance CRUD Operations
  getAttendanceRecords(): AttendanceRecord[] {
    return this.attendanceSubject.value;
  }

  getAttendanceByClass(classId: string): AttendanceRecord[] {
    return this.attendanceSubject.value.filter((a) => a.classId === classId);
  }

  getAttendanceByStudent(studentId: string): AttendanceRecord[] {
    return this.attendanceSubject.value.filter(
      (a) => a.studentId === studentId
    );
  }

  addAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const newRecord: AttendanceRecord = {
      ...record,
      id: this.generateId(),
    };
    const attendance = [...this.attendanceSubject.value, newRecord];
    this.saveAttendance(attendance);
    this.attendanceSubject.next(attendance);
    return newRecord;
  }

  updateAttendanceRecord(
    id: string,
    updates: Partial<AttendanceRecord>
  ): boolean {
    const attendance = this.attendanceSubject.value.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    const found = attendance.some((a) => a.id === id);
    if (found) {
      this.saveAttendance(attendance);
      this.attendanceSubject.next(attendance);
    }
    return found;
  }

  deleteAttendanceRecord(id: string): boolean {
    const attendance = this.attendanceSubject.value.filter((a) => a.id !== id);
    const wasDeleted = attendance.length < this.attendanceSubject.value.length;
    if (wasDeleted) {
      this.saveAttendance(attendance);
      this.attendanceSubject.next(attendance);
    }
    return wasDeleted;
  }

  // Frequency Calculation Methods
  generateFrequencyReport(
    classId: string,
    period: 'semester' | 'year',
    semester?: string
  ): FrequencyReport | null {
    const classData = this.getClassById(classId);
    if (!classData) {
      return null;
    }

    const students = this.getStudentsByClass(classId);
    const allAttendance = this.getAttendanceByClass(classId);

    // Filter attendance by period and semester
    const filteredAttendance = allAttendance.filter((record) => {
      // Match the period type
      if (record.period !== period) {
        return false;
      }

      // If requesting semester report, match the specific semester
      if (period === 'semester' && semester) {
        return record.semester === semester;
      }

      // For year reports, include all year records
      return true;
    });

    // Calculate total class hours from the first record (they should all be the same for a given entry)
    const totalClassHours =
      filteredAttendance.length > 0 ? filteredAttendance[0].totalHours : 0;

    // Generate student reports
    const studentReports: StudentFrequencyReport[] = students.map((student) => {
      const studentAttendance = filteredAttendance.filter(
        (a) => a.studentId === student.id
      );

      const totalHoursPresent = studentAttendance.reduce(
        (sum, record) => sum + record.hoursPresent,
        0
      );
      const totalHoursAbsent = studentAttendance.reduce(
        (sum, record) => sum + record.hoursAbsent,
        0
      );
      const totalHours = studentAttendance.reduce(
        (sum, record) => sum + record.totalHours,
        0
      );

      const presencePercentage =
        totalHours > 0 ? (totalHoursPresent / totalHours) * 100 : 0;
      const absencePercentage =
        totalHours > 0 ? (totalHoursAbsent / totalHours) * 100 : 0;

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        totalHoursPresent,
        totalHoursAbsent,
        totalHours,
        presencePercentage,
        absencePercentage,
      };
    });

    // Calculate class averages
    const classAveragePresence =
      studentReports.length > 0
        ? studentReports.reduce(
            (sum, report) => sum + report.presencePercentage,
            0
          ) / studentReports.length
        : 0;

    const classAverageAbsence =
      studentReports.length > 0
        ? studentReports.reduce(
            (sum, report) => sum + report.absencePercentage,
            0
          ) / studentReports.length
        : 0;

    return {
      classId,
      className: classData.name,
      period,
      academicYear: classData.academicYear,
      semester: period === 'semester' ? semester : undefined,
      totalClassHours,
      studentReports,
      classAveragePresence,
      classAverageAbsence,
      generatedAt: new Date(),
    };
  }
}
