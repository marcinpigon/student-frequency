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
    MatSnackBarModule,
  ],
  templateUrl: './frequency.component.html',
  styleUrl: './frequency.component.css',
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
    this.reportForm = this.fb.group({
      classId: ['', Validators.required],
      period: ['semester', Validators.required],
      semester: ['', Validators.required],
    });

    // Watch for period changes to toggle semester requirement
    this.reportForm.get('period')?.valueChanges.subscribe((period) => {
      const semesterControl = this.reportForm.get('semester');
      if (period === 'semester') {
        semesterControl?.setValidators([Validators.required]);
      } else {
        semesterControl?.clearValidators();
        semesterControl?.setValue('');
      }
      semesterControl?.updateValueAndValidity();
    });

    // Watch for class changes
    this.reportForm.get('classId')?.valueChanges.subscribe((classId) => {
      if (classId) {
        this.onClassChange(classId);
      }
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
      this.snackBar.open('Proszę wypełnić wszystkie wymagane pola', 'Zamknij', {
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
      this.snackBar.open('Raport wygenerowany pomyślnie', 'Zamknij', {
        duration: 3000,
      });
    } else {
      this.snackBar.open('Nie udało się wygenerować raportu', 'Zamknij', {
        duration: 3000,
      });
    }
  }

  addSampleAttendance(): void {
    if (!this.selectedClass) {
      this.snackBar.open('Proszę najpierw wybrać klasę', 'Zamknij', {
        duration: 3000,
      });
      return;
    }

    const students = this.studentService.getStudentsByClass(
      this.selectedClass.id
    );

    if (students.length === 0) {
      this.snackBar.open('Brak uczniów w tej klasie', 'Zamknij', {
        duration: 3000,
      });
      return;
    }

    const formValue = this.reportForm.value;
    const period = formValue.period || 'semester';
    const semester = formValue.semester;

    // Generate sample attendance records for each student
    students.forEach((student) => {
      const totalHours = 120; // Total hours for the period
      const hoursPresent = Math.floor(Math.random() * (totalHours + 1)); // 0 to totalHours
      const hoursAbsent = totalHours - hoursPresent;

      const record: Omit<AttendanceRecord, 'id'> = {
        studentId: student.id,
        classId: this.selectedClass!.id,
        date: new Date(),
        period: period,
        semester: period === 'semester' ? semester : undefined,
        academicYear: this.selectedClass!.academicYear,
        hoursPresent,
        hoursAbsent,
        totalHours,
        notes: `Przykładowe dane frekwencji ${
          period === 'semester' ? 'semestralne' : 'roczne'
        }`,
      };

      this.studentService.addAttendanceRecord(record);
    });

    this.snackBar.open(
      `Dodano przykładową frekwencję dla ${students.length} uczniów`,
      'Zamknij',
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
