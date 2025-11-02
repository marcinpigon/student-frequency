import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../services/student.service';
import { seedSampleData } from '../services/sample-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalStudents = 0;
  totalClasses = 0;
  activeStudents = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStats(): void {
    this.studentService.students$
      .pipe(takeUntil(this.destroy$))
      .subscribe((students) => {
        this.totalStudents = students.length;
        this.activeStudents = students.filter((s) => s.isActive).length;
      });

    this.studentService.classes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((classes) => {
        this.totalClasses = classes.filter((c) => c.isActive).length;
      });
  }

  seedSampleData(): void {
    if (
      confirm(
        'To spowoduje usunięcie wszystkich istniejących danych i dodanie przykładowych uczniów oraz klas. Kontynuować?'
      )
    ) {
      seedSampleData(this.studentService);
      this.snackBar.open(
        'Przykładowe dane zostały załadowane! Sprawdź stronę Uczniowie.',
        'Zamknij',
        { duration: 5000 }
      );
    }
  }
}
