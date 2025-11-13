import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../services/student.service';
import {
  StudentClass,
  FrequencyReport,
  StudentFrequencyReport,
  AttendanceRecord,
} from '../models/student.model';

@Component({
    selector: 'app-frequency',
    imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSnackBarModule
],
    templateUrl: './frequency.component.html',
    styleUrl: './frequency.component.css'
})
export class FrequencyComponent implements OnInit, OnDestroy {
  classes: StudentClass[] = [];
  selectedClass: StudentClass | null = null;
  frequencyReport: FrequencyReport | null = null;
  reportForm!: FormGroup;
  displayedColumns: string[] = [
    'studentName',
    'totalHoursPresent',
    'totalHoursAbsent',
    'totalHours',
    'presencePercentage',
    'absencePercentage',
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
    this.reportForm = this.fb.group({
      classId: ['', Validators.required],
      period: ['semester', Validators.required],
      semester: [''],
    });

    // Watch for period changes to toggle semester requirement
    this.reportForm.get('period')?.valueChanges.subscribe((period) => {
      const semesterControl = this.reportForm.get('semester');
      if (period === 'semester') {
        semesterControl?.setValidators([Validators.required]);
      } else {
        semesterControl?.clearValidators();
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

  onClassChange(classId: string): void {
    this.selectedClass = this.classes.find((c) => c.id === classId) || null;
    this.frequencyReport = null;
  }

  generateReport(): void {
    if (this.reportForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    const { classId, period, semester } = this.reportForm.value;
    const report = this.studentService.generateFrequencyReport(
      classId,
      period,
      semester
    );

    if (report) {
      this.frequencyReport = report;
      this.snackBar.open('Report generated successfully', 'Close', {
        duration: 3000,
      });
    } else {
      this.snackBar.open('Failed to generate report', 'Close', {
        duration: 3000,
      });
    }
  }

  addSampleAttendance(): void {
    if (!this.selectedClass) {
      this.snackBar.open('Please select a class first', 'Close', {
        duration: 3000,
      });
      return;
    }

    const students = this.studentService.getStudentsByClass(
      this.selectedClass.id
    );

    if (students.length === 0) {
      this.snackBar.open('No students found in this class', 'Close', {
        duration: 3000,
      });
      return;
    }

    // Generate sample attendance records for each student
    students.forEach((student) => {
      // Add 10 random attendance records per student
      for (let i = 0; i < 10; i++) {
        const totalHours = 8; // 8 hours per day
        const hoursPresent = Math.floor(Math.random() * 9); // 0-8 hours present
        const hoursAbsent = totalHours - hoursPresent;

        const record: Omit<AttendanceRecord, 'id'> = {
          studentId: student.id,
          classId: this.selectedClass!.id,
          date: new Date(2024, 8 + Math.floor(i / 5), 1 + (i % 5) * 3), // Spread across Sept-Nov
          hoursPresent,
          hoursAbsent,
          totalHours,
          notes: `Sample attendance record ${i + 1}`,
        };

        this.studentService.addAttendanceRecord(record);
      }
    });

    this.snackBar.open(
      `Added sample attendance for ${students.length} students`,
      'Close',
      { duration: 3000 }
    );
  }

  clearReport(): void {
    this.frequencyReport = null;
    this.reportForm.reset({ period: 'semester' });
  }

  exportReport(): void {
    if (!this.frequencyReport) {
      return;
    }

    // Simple CSV export
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency-report-${
      this.frequencyReport.className
    }-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Report exported successfully', 'Close', {
      duration: 3000,
    });
  }

  private generateCSV(): string {
    if (!this.frequencyReport) {
      return '';
    }

    const headers = [
      'Student Name',
      'Total Hours Present',
      'Total Hours Absent',
      'Total Hours',
      'Presence %',
      'Absence %',
    ];

    const rows = this.frequencyReport.studentReports.map((report) => [
      report.studentName,
      report.totalHoursPresent.toFixed(2),
      report.totalHoursAbsent.toFixed(2),
      report.totalHours.toFixed(2),
      report.presencePercentage.toFixed(2),
      report.absencePercentage.toFixed(2),
    ]);

    // Add summary rows
    rows.push([]);
    rows.push([
      'Class Average',
      '',
      '',
      '',
      this.frequencyReport.classAveragePresence.toFixed(2),
      this.frequencyReport.classAverageAbsence.toFixed(2),
    ]);

    const csvRows = [headers, ...rows].map((row) => row.join(','));
    return csvRows.join('\n');
  }
}
