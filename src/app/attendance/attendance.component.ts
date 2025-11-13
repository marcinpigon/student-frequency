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
  totalHoursPresent: number;
  totalHoursAbsent: number;
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
    MatCheckboxModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
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
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadClasses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.attendanceForm = this.fb.group({
      classId: ['', Validators.required],
      period: ['semester', Validators.required],
      semester: ['', Validators.required],
      academicYear: ['', Validators.required],
      totalClassHours: [0, [Validators.required, Validators.min(1)]],
      students: this.fb.array([]),
    });

    // Watch for period changes to toggle semester requirement
    this.attendanceForm.get('period')?.valueChanges.subscribe((period) => {
      const semesterControl = this.attendanceForm.get('semester');
      if (period === 'semester') {
        semesterControl?.setValidators([Validators.required]);
      } else {
        semesterControl?.clearValidators();
        semesterControl?.setValue('');
      }
      semesterControl?.updateValueAndValidity();
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

    // Pre-fill academic year and semester from class
    if (this.selectedClass) {
      this.attendanceForm.patchValue({
        academicYear: this.selectedClass.academicYear,
        semester: this.selectedClass.semester,
      });
    }

    // Clear existing student forms
    while (this.studentsArray.length) {
      this.studentsArray.removeAt(0);
    }

    // Create form controls for each student
    this.students.forEach((student) => {
      const studentForm = this.fb.group({
        studentId: [student.id],
        studentName: [`${student.firstName} ${student.lastName}`],
        totalHoursPresent: [0, [Validators.required, Validators.min(0)]],
        totalHoursAbsent: [0, [Validators.required, Validators.min(0)]],
        notes: [''],
      });

      // Auto-calculate hours absent when hours present changes
      studentForm
        .get('totalHoursPresent')
        ?.valueChanges.subscribe((present) => {
          const totalClassHours =
            this.attendanceForm.get('totalClassHours')?.value || 0;
          const absent = Math.max(0, totalClassHours - (present ?? 0));
          studentForm
            .get('totalHoursAbsent')
            ?.setValue(absent, { emitEvent: false });
        });

      this.studentsArray.push(studentForm);
    });
  }
  onTotalClassHoursChange(totalHours: number): void {
    // Update all student forms when total class hours changes
    this.studentsArray.controls.forEach((control) => {
      const present = control.get('totalHoursPresent')?.value ?? 0;
      const absent = Math.max(0, totalHours - present);
      control.get('totalHoursAbsent')?.setValue(absent, { emitEvent: false });
    });
  }

  markAllPresent(): void {
    const totalHours = this.attendanceForm.get('totalClassHours')?.value || 0;
    this.studentsArray.controls.forEach((control) => {
      control.get('totalHoursPresent')?.setValue(totalHours);
      control.get('totalHoursAbsent')?.setValue(0);
    });
    this.snackBar.open(
      'Wszyscy uczniowie oznaczeni jako w pełni obecni',
      'Zamknij',
      {
        duration: 2000,
      }
    );
  }

  clearAllHours(): void {
    this.studentsArray.controls.forEach((control) => {
      control.get('totalHoursPresent')?.setValue(0);
      control.get('totalHoursAbsent')?.setValue(0);
    });
    this.snackBar.open('Wszystkie godziny wyczyszczone', 'Zamknij', {
      duration: 2000,
    });
  }

  saveAttendance(): void {
    if (this.attendanceForm.invalid) {
      this.snackBar.open('Proszę wypełnić wszystkie wymagane pola', 'Zamknij', {
        duration: 3000,
      });
      return;
    }

    const formValue = this.attendanceForm.value;
    const totalHours = formValue.totalClassHours;
    const classId = formValue.classId;
    const period = formValue.period;
    const semester = formValue.semester;
    const academicYear = formValue.academicYear;

    let savedCount = 0;

    // Save attendance for each student
    formValue.students.forEach((studentData: StudentAttendanceForm) => {
      const record: Omit<AttendanceRecord, 'id'> = {
        studentId: studentData.studentId,
        classId: classId,
        date: new Date(),
        period: period,
        semester: semester,
        academicYear: academicYear,
        hoursPresent: studentData.totalHoursPresent,
        hoursAbsent: studentData.totalHoursAbsent,
        totalHours: totalHours,
        notes: studentData.notes,
      };

      this.studentService.addAttendanceRecord(record);
      savedCount++;
    });

    this.snackBar.open(
      `Frekwencja zapisana dla ${savedCount} uczniów`,
      'Zamknij',
      {
        duration: 3000,
      }
    );

    // Reset hours but keep class selection
    this.studentsArray.controls.forEach((control) => {
      control.get('totalHoursPresent')?.setValue(0);
      control.get('totalHoursAbsent')?.setValue(totalHours);
      control.get('notes')?.setValue('');
    });
  }

  resetForm(): void {
    this.attendanceForm.reset({
      period: 'semester',
      totalClassHours: 0,
    });
    while (this.studentsArray.length) {
      this.studentsArray.removeAt(0);
    }
    this.selectedClass = null;
    this.students = [];
  }

  getStudentPresencePercentage(hoursPresent: number): number {
    const totalHours = this.attendanceForm.get('totalClassHours')?.value || 1;
    return totalHours > 0 ? (hoursPresent / totalHours) * 100 : 0;
  }
}
