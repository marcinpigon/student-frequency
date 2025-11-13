import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../services/student.service';
import {
  Student,
  StudentClass,
  AttendanceRecord,
} from '../models/student.model';

interface StudentAttendanceForm {
  studentId: string;
  studentName: string;
  hoursPresent: number;
  hoursAbsent: number;
  notes: string;
}

@Component({
    selector: 'app-attendance',
    imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule
],
    templateUrl: './attendance.component.html',
    styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit, OnDestroy {
  classes: StudentClass[] = [];
  students: Student[] = [];
  attendanceForm!: FormGroup;
  selectedClass: StudentClass | null = null;
  displayedColumns: string[] = [
    'studentName',
    'hoursPresent',
    'hoursAbsent',
    'notes',
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClasses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.attendanceForm = this.fb.group({
      classId: ['', Validators.required],
      date: [new Date(), Validators.required],
      totalHours: [
        8,
        [Validators.required, Validators.min(1), Validators.max(24)],
      ],
      students: this.fb.array([]),
    });
  }

  private loadClasses(): void {
    this.studentService.classes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((classes) => {
        this.classes = classes.filter((c) => c.isActive);
      });
  }

  get studentsArray(): FormArray {
    return this.attendanceForm.get('students') as FormArray;
  }

  onClassChange(classId: string): void {
    this.selectedClass = this.classes.find((c) => c.id === classId) || null;
    this.students = this.studentService.getStudentsByClass(classId);

    // Clear existing student forms
    while (this.studentsArray.length) {
      this.studentsArray.removeAt(0);
    }

    // Create form controls for each student
    this.students.forEach((student) => {
      const studentForm = this.fb.group({
        studentId: [student.id],
        studentName: [`${student.firstName} ${student.lastName}`],
        hoursPresent: [0, [Validators.required, Validators.min(0)]],
        hoursAbsent: [0, [Validators.required, Validators.min(0)]],
        notes: [''],
      });

      // Auto-calculate hours absent when hours present changes
      studentForm.get('hoursPresent')?.valueChanges.subscribe((present) => {
        const totalHours = this.attendanceForm.get('totalHours')?.value || 0;
        const absent = Math.max(0, totalHours - (present ?? 0));
        studentForm.get('hoursAbsent')?.setValue(absent, { emitEvent: false });
      });

      this.studentsArray.push(studentForm);
    });
  }

  onTotalHoursChange(totalHours: number): void {
    // Update all student forms when total hours changes
    this.studentsArray.controls.forEach((control) => {
      const present = control.get('hoursPresent')?.value ?? 0;
      const absent = Math.max(0, totalHours - present);
      control.get('hoursAbsent')?.setValue(absent, { emitEvent: false });
    });
  }

  markAllPresent(): void {
    const totalHours = this.attendanceForm.get('totalHours')?.value || 0;
    this.studentsArray.controls.forEach((control) => {
      control.get('hoursPresent')?.setValue(totalHours);
      control.get('hoursAbsent')?.setValue(0);
    });
    this.snackBar.open('All students marked as present', 'Close', {
      duration: 2000,
    });
  }

  markAllAbsent(): void {
    const totalHours = this.attendanceForm.get('totalHours')?.value || 0;
    this.studentsArray.controls.forEach((control) => {
      control.get('hoursPresent')?.setValue(0);
      control.get('hoursAbsent')?.setValue(totalHours);
    });
    this.snackBar.open('All students marked as absent', 'Close', {
      duration: 2000,
    });
  }

  saveAttendance(): void {
    if (this.attendanceForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    const formValue = this.attendanceForm.value;
    const totalHours = formValue.totalHours;
    const date = formValue.date;
    const classId = formValue.classId;

    let savedCount = 0;

    // Save attendance for each student
    formValue.students.forEach((studentData: StudentAttendanceForm) => {
      const record: Omit<AttendanceRecord, 'id'> = {
        studentId: studentData.studentId,
        classId: classId,
        date: date,
        hoursPresent: studentData.hoursPresent,
        hoursAbsent: studentData.hoursAbsent,
        totalHours: totalHours,
        notes: studentData.notes,
      };

      this.studentService.addAttendanceRecord(record);
      savedCount++;
    });

    this.snackBar.open(`Attendance saved for ${savedCount} students`, 'Close', {
      duration: 3000,
    });

    // Reset hours but keep class and date
    this.studentsArray.controls.forEach((control) => {
      control.get('hoursPresent')?.setValue(0);
      control.get('hoursAbsent')?.setValue(totalHours);
      control.get('notes')?.setValue('');
    });
  }

  resetForm(): void {
    this.attendanceForm.reset({
      totalHours: 8,
      date: new Date(),
    });
    while (this.studentsArray.length) {
      this.studentsArray.removeAt(0);
    }
    this.selectedClass = null;
    this.students = [];
  }

  getStudentPresencePercentage(hoursPresent: number): number {
    const totalHours = this.attendanceForm.get('totalHours')?.value || 1;
    return (hoursPresent / totalHours) * 100;
  }
}
