import { TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import { Student, StudentClass } from '../models/student.model';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Student Operations', () => {
    it('should add a new student', () => {
      const studentData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        classId: 'class-1',
        enrollmentDate: new Date(),
        isActive: true,
      };

      const student = service.addStudent(studentData);
      expect(student.id).toBeDefined();
      expect(student.firstName).toBe('John');
    });

    it('should get all students', () => {
      const studentData = {
        firstName: 'Jane',
        lastName: 'Smith',
        classId: 'class-1',
        enrollmentDate: new Date(),
        isActive: true,
      };

      service.addStudent(studentData);
      const students = service.getStudents();
      expect(students.length).toBe(1);
    });

    it('should update a student', () => {
      const student = service.addStudent({
        firstName: 'John',
        lastName: 'Doe',
        classId: 'class-1',
        enrollmentDate: new Date(),
        isActive: true,
      });

      const updated = service.updateStudent(student.id, { firstName: 'Jane' });
      expect(updated).toBe(true);

      const updatedStudent = service.getStudentById(student.id);
      expect(updatedStudent?.firstName).toBe('Jane');
    });

    it('should delete a student', () => {
      const student = service.addStudent({
        firstName: 'John',
        lastName: 'Doe',
        classId: 'class-1',
        enrollmentDate: new Date(),
        isActive: true,
      });

      const deleted = service.deleteStudent(student.id);
      expect(deleted).toBe(true);
      expect(service.getStudents().length).toBe(0);
    });
  });

  describe('Class Operations', () => {
    it('should add a new class', () => {
      const classData = {
        name: 'Math 101',
        academicYear: '2024-2025',
        semester: 'Fall',
        createdAt: new Date(),
        isActive: true,
      };

      const newClass = service.addClass(classData);
      expect(newClass.id).toBeDefined();
      expect(newClass.name).toBe('Math 101');
    });

    it('should not delete class with students', () => {
      const classData = service.addClass({
        name: 'Math 101',
        academicYear: '2024-2025',
        semester: 'Fall',
        createdAt: new Date(),
        isActive: true,
      });

      service.addStudent({
        firstName: 'John',
        lastName: 'Doe',
        classId: classData.id,
        enrollmentDate: new Date(),
        isActive: true,
      });

      const deleted = service.deleteClass(classData.id);
      expect(deleted).toBe(false);
    });
  });
});
