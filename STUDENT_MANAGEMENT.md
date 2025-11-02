# Student Management Feature

## Overview

This feature allows teachers to manage students and classes with persistent storage using browser's localStorage.

## Components Created

### 1. Models (`src/app/models/student.model.ts`)

- **Student Interface**: Defines student data structure

  - id, firstName, lastName, email, classId, enrollmentDate, isActive, studentNumber

- **StudentClass Interface**: Defines class data structure
  - id, name, description, academicYear, semester, createdAt, isActive

### 2. Service (`src/app/services/student.service.ts`)

Provides complete CRUD operations with localStorage persistence:

#### Student Operations

- `getStudents()`: Get all students
- `getStudentById(id)`: Get student by ID
- `getStudentsByClass(classId)`: Get all students in a class
- `addStudent(student)`: Add new student
- `updateStudent(id, updates)`: Update existing student
- `deleteStudent(id)`: Delete student

#### Class Operations

- `getClasses()`: Get all classes
- `getClassById(id)`: Get class by ID
- `addClass(classData)`: Add new class
- `updateClass(id, updates)`: Update existing class
- `deleteClass(id)`: Delete class (only if no students assigned)

#### Utility Methods

- `clearAllData()`: Clear all data from localStorage
- `exportData()`: Export all students and classes
- `importData(data)`: Import students and classes

### 3. Students Component (`src/app/students/`)

A full-featured UI with two tabs:

#### Students Tab

- Form to add/edit students
- Required fields: First Name, Last Name, Class
- Optional fields: Email, Student Number
- Real-time validation
- Student list table with:
  - Student number, name, email, class, enrollment date
  - Edit and delete actions
  - Responsive design

#### Classes Tab

- Form to create/edit classes
- Required fields: Class Name, Academic Year, Semester
- Optional field: Description
- Classes list table with:
  - Class name, academic year, semester, student count
  - Edit and delete actions
  - Cannot delete classes with students

## Data Persistence

### LocalStorage Keys

- `students`: Stores all student records
- `classes`: Stores all class records

### Data Format

Data is stored as JSON strings and automatically parsed on load. Date objects are serialized and deserialized correctly.

## Features

### ✅ Add Students

1. Navigate to Students page
2. Fill in student details
3. Select a class (must create classes first)
4. Click "Add Student"

### ✅ Create Classes

1. Go to "Classes" tab
2. Enter class name, academic year, and semester
3. Optionally add description
4. Click "Create Class"

### ✅ Edit Records

- Click edit icon on any student or class
- Form populates with current data
- Make changes and save

### ✅ Delete Records

- Click delete icon
- Confirm deletion
- Classes with students cannot be deleted

### ✅ Data Persistence

- All data automatically saved to localStorage
- Data persists across browser sessions
- No server required

## Usage Example

```typescript
// In any component, inject the service
constructor(private studentService: StudentService) {}

// Add a new class
const newClass = this.studentService.addClass({
  name: 'Mathematics 101',
  academicYear: '2024-2025',
  semester: 'Fall',
  createdAt: new Date(),
  isActive: true
});

// Add a student to the class
const student = this.studentService.addStudent({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  classId: newClass.id,
  enrollmentDate: new Date(),
  isActive: true
});

// Get all students in a class
const classStudents = this.studentService.getStudentsByClass(newClass.id);
```

## Testing

Unit tests are included for:

- StudentService (CRUD operations)
- StudentsComponent (component creation)

Run tests with:

```bash
ng test
```

## Future Enhancements

- CSV import for bulk student addition
- Search and filter functionality
- Sorting by columns
- Pagination for large datasets
- Export to Excel/PDF
- Student profile pictures
- Advanced filtering options
