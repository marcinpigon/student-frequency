import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';

import { StudentService } from '../services/student.service';
import { Student, StudentClass } from '../models/student.model';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent implements OnInit, OnDestroy {
  studentForm!: FormGroup;
  classForm!: FormGroup;
  students: Student[] = [];
  classes: StudentClass[] = [];
  displayedColumns: string[] = [
    'studentNumber',
    'firstName',
    'lastName',
    'email',
    'class',
    'enrollmentDate',
    'actions',
  ];
  classDisplayedColumns: string[] = [
    'name',
    'academicYear',
    'semester',
    'studentCount',
    'actions',
  ];

  editingStudent: Student | null = null;
  editingClass: StudentClass | null = null;

  @ViewChild('studentFormCard', { read: ElementRef })
  studentFormCard!: ElementRef;
  @ViewChild('classFormCard', { read: ElementRef }) classFormCard!: ElementRef;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms(): void {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      studentNumber: [''],
      classId: ['', Validators.required],
    });

    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      academicYear: ['', Validators.required],
      semester: ['', Validators.required],
    });
  }

  private loadData(): void {
    this.studentService.students$
      .pipe(takeUntil(this.destroy$))
      .subscribe((students) => {
        this.students = students;
      });

    this.studentService.classes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((classes) => {
        this.classes = classes;
      });
  }

  // Student Operations
  onSubmitStudent(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;

      if (this.editingStudent) {
        // Update existing student
        const success = this.studentService.updateStudent(
          this.editingStudent.id,
          {
            ...formValue,
          }
        );
        if (success) {
          this.snackBar.open('Uczeń został zaktualizowany!', 'Zamknij', {
            duration: 3000,
          });
          this.resetStudentForm();
        }
      } else {
        // Add new student
        const student = this.studentService.addStudent({
          ...formValue,
          enrollmentDate: new Date(),
          isActive: true,
        });
        this.snackBar.open(
          `Uczeń ${student.firstName} ${student.lastName} został dodany!`,
          'Zamknij',
          { duration: 3000 }
        );
        this.resetStudentForm();
      }
    } else {
      this.snackBar.open('Proszę wypełnić wszystkie wymagane pola', 'Zamknij', {
        duration: 3000,
      });
    }
  }

  editStudent(student: Student): void {
    this.editingStudent = student;
    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      studentNumber: student.studentNumber,
      classId: student.classId,
    });
    this.scrollToForm('student');
  }

  deleteStudent(student: Student): void {
    if (
      confirm(
        `Czy na pewno chcesz usunąć ${student.firstName} ${student.lastName}?`
      )
    ) {
      const success = this.studentService.deleteStudent(student.id);
      if (success) {
        this.snackBar.open('Uczeń został usunięty!', 'Zamknij', {
          duration: 3000,
        });
      }
    }
  }

  resetStudentForm(): void {
    this.editingStudent = null;
    this.studentForm.reset();
  }

  // Class Operations
  onSubmitClass(): void {
    if (this.classForm.valid) {
      const formValue = this.classForm.value;

      if (this.editingClass) {
        // Update existing class
        const success = this.studentService.updateClass(this.editingClass.id, {
          ...formValue,
        });
        if (success) {
          this.snackBar.open('Klasa została zaktualizowana!', 'Zamknij', {
            duration: 3000,
          });
          this.resetClassForm();
        }
      } else {
        // Add new class
        const newClass = this.studentService.addClass({
          ...formValue,
          createdAt: new Date(),
          isActive: true,
        });
        this.snackBar.open(
          `Klasa ${newClass.name} została utworzona!`,
          'Zamknij',
          {
            duration: 3000,
          }
        );
        this.resetClassForm();
      }
    } else {
      this.snackBar.open('Proszę wypełnić wszystkie wymagane pola', 'Zamknij', {
        duration: 3000,
      });
    }
  }

  editClass(classData: StudentClass): void {
    this.editingClass = classData;
    this.classForm.patchValue({
      name: classData.name,
      description: classData.description,
      academicYear: classData.academicYear,
      semester: classData.semester,
    });
    this.scrollToForm('class');
  }

  deleteClass(classData: StudentClass): void {
    const studentCount = this.getStudentCountForClass(classData.id);
    if (studentCount > 0) {
      this.snackBar.open(
        'Nie można usunąć klasy z uczniami. Najpierw przenieś lub usuń uczniów.',
        'Zamknij',
        { duration: 5000 }
      );
      return;
    }

    if (confirm(`Czy na pewno chcesz usunąć ${classData.name}?`)) {
      const success = this.studentService.deleteClass(classData.id);
      if (success) {
        this.snackBar.open('Klasa została usunięta!', 'Zamknij', {
          duration: 3000,
        });
      }
    }
  }

  resetClassForm(): void {
    this.editingClass = null;
    this.classForm.reset();
  }

  // Helper Methods
  getClassName(classId: string): string {
    const classData = this.classes.find((c) => c.id === classId);
    return classData ? classData.name : 'Nieznana';
  }

  getStudentCountForClass(classId: string): number {
    return this.students.filter((s) => s.classId === classId).length;
  }

  private scrollToForm(formType: 'student' | 'class'): void {
    // First, switch to the correct tab
    const targetTabIndex = formType === 'student' ? 0 : 1;
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = targetTabIndex;
    }

    // Wait for tab animation and DOM update
    setTimeout(() => {
      const element =
        formType === 'student'
          ? this.studentFormCard?.nativeElement
          : this.classFormCard?.nativeElement;

      if (element) {
        // Scroll the element into view
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });

        // Add highlight effect
        element.classList.add('highlight-form');
        setTimeout(() => {
          element.classList.remove('highlight-form');
        }, 2000);
      } else {
        // Fallback: scroll to top of page
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, 300);
  }
}
