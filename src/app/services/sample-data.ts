import { StudentClass, Student } from '../models/student.model';

export const sampleClasses: Omit<StudentClass, 'id'>[] = [
  {
    name: 'Mathematics 101',
    description: 'Introduction to Calculus and Algebra',
    academicYear: '2024-2025',
    semester: 'Fall',
    createdAt: new Date('2024-09-01'),
    isActive: true,
  },
  {
    name: 'Physics 201',
    description: 'Classical Mechanics',
    academicYear: '2024-2025',
    semester: 'Fall',
    createdAt: new Date('2024-09-01'),
    isActive: true,
  },
  {
    name: 'Computer Science 301',
    description: 'Data Structures and Algorithms',
    academicYear: '2024-2025',
    semester: 'Fall',
    createdAt: new Date('2024-09-01'),
    isActive: true,
  },
  {
    name: 'English Literature 101',
    description: 'Introduction to Classic Literature',
    academicYear: '2024-2025',
    semester: 'Spring',
    createdAt: new Date('2024-09-01'),
    isActive: true,
  },
];

export const sampleStudents: (classId: string) => Omit<Student, 'id'>[] = (
  classId: string
) => [
  {
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@school.edu',
    studentNumber: 'STU001',
    classId: classId,
    enrollmentDate: new Date('2024-09-01'),
    isActive: true,
  },
  {
    firstName: 'Liam',
    lastName: 'Williams',
    email: 'liam.williams@school.edu',
    studentNumber: 'STU002',
    classId: classId,
    enrollmentDate: new Date('2024-09-01'),
    isActive: true,
  },
  {
    firstName: 'Olivia',
    lastName: 'Brown',
    email: 'olivia.brown@school.edu',
    studentNumber: 'STU003',
    classId: classId,
    enrollmentDate: new Date('2024-09-01'),
    isActive: true,
  },
  {
    firstName: 'Noah',
    lastName: 'Davis',
    email: 'noah.davis@school.edu',
    studentNumber: 'STU004',
    classId: classId,
    enrollmentDate: new Date('2024-09-02'),
    isActive: true,
  },
  {
    firstName: 'Ava',
    lastName: 'Miller',
    email: 'ava.miller@school.edu',
    studentNumber: 'STU005',
    classId: classId,
    enrollmentDate: new Date('2024-09-02'),
    isActive: true,
  },
];

/**
 * Seeds sample data into the StudentService
 * Usage in component:
 *
 * import { seedSampleData } from './services/sample-data';
 *
 * seedSampleData(this.studentService);
 */
export function seedSampleData(studentService: any): void {
  // First, clear existing data
  console.log('Clearing existing data...');
  studentService.clearAllData();

  // Add sample classes
  console.log('Adding sample classes...');
  const createdClasses = sampleClasses.map((classData) =>
    studentService.addClass(classData)
  );

  // Add sample students to each class
  console.log('Adding sample students...');
  createdClasses.forEach((classData, index) => {
    const students = sampleStudents(classData.id);
    students.forEach((student, studentIndex) => {
      studentService.addStudent({
        ...student,
        studentNumber: `STU${String(index * 10 + studentIndex + 1).padStart(
          3,
          '0'
        )}`,
      });
    });
  });

  console.log('Sample data seeded successfully!');
  console.log(`- ${createdClasses.length} classes created`);
  console.log(`- ${createdClasses.length * 5} students added`);
}
