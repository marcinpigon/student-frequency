# Frequency Report Feature

## Overview

The Frequency Report feature allows teachers to track and analyze student attendance by calculating total hours present and absent for each student over a semester or full academic year.

## Features

### 1. Report Generation

- **Period Selection**: Choose between semester-based or year-based reports
- **Class Selection**: Select any active class to generate reports for
- **Semester Filter**: When selecting semester mode, choose from Fall, Spring, or Summer

### 2. Report Display

The generated report shows:

- **Class Summary**:

  - Total class hours scheduled
  - Class average presence percentage
  - Class average absence percentage
  - Total number of students

- **Individual Student Data**:
  - Student name
  - Total hours present
  - Total hours absent
  - Total hours scheduled
  - Presence percentage (color-coded: green ≥75%, red <75%)
  - Absence percentage (color-coded: orange >25%)

### 3. Data Management

- **Add Sample Data**: Quickly populate the system with sample attendance records for testing
- **Export to CSV**: Download the report as a CSV file for further analysis in Excel or other tools
- **Clear Report**: Reset the form and clear the displayed report

## Data Model

### AttendanceRecord

Represents a single attendance entry:

```typescript
{
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  hoursPresent: number;
  hoursAbsent: number;
  totalHours: number;
  notes?: string;
}
```

### FrequencyReport

Represents a complete frequency report:

```typescript
{
  classId: string;
  className: string;
  period: 'semester' | 'year';
  academicYear: string;
  semester?: string;
  totalClassHours: number;
  studentReports: StudentFrequencyReport[];
  classAveragePresence: number;
  classAverageAbsence: number;
  generatedAt: Date;
}
```

### StudentFrequencyReport

Represents individual student statistics:

```typescript
{
  studentId: string;
  studentName: string;
  totalHoursPresent: number;
  totalHoursAbsent: number;
  totalHours: number;
  presencePercentage: number;
  absencePercentage: number;
}
```

## Usage

### Accessing the Feature

1. Navigate to "Raport Częstotliwości" (Frequency Report) from the sidebar menu
2. The frequency report page will open

### Generating a Report

#### Step 1: Select a Class

- Choose a class from the dropdown menu
- Only active classes are displayed

#### Step 2: Choose Report Period

- **Semester Mode**: Select this to generate a report for a specific semester
  - You must also select which semester (Fall, Spring, or Summer)
- **Year Mode**: Select this to generate a report for the entire academic year

#### Step 3: Generate Report

- Click "Generate Report" button
- The report will be displayed in a table below the form

### Adding Sample Data

If you want to test the feature with sample data:

1. Select a class
2. Click "Add Sample Data"
3. The system will generate 10 random attendance records for each student in the class
4. These records will span across several months (September-November)

### Exporting Reports

1. Generate a report first
2. Click "Export as CSV" button
3. A CSV file will be downloaded with the filename format: `frequency-report-[ClassName]-[Timestamp].csv`

## Calculations

### Student-Level Calculations

For each student:

- **Total Hours Present** = Sum of all `hoursPresent` from attendance records
- **Total Hours Absent** = Sum of all `hoursAbsent` from attendance records
- **Total Hours** = Sum of all `totalHours` from attendance records
- **Presence Percentage** = (Total Hours Present / Total Hours) × 100
- **Absence Percentage** = (Total Hours Absent / Total Hours) × 100

### Class-Level Calculations

- **Total Class Hours** = Average of all students' total hours
- **Class Average Presence** = Average of all students' presence percentages
- **Class Average Absence** = Average of all students' absence percentages

## Color Coding

The report uses visual indicators to highlight important metrics:

- **Green** (High Presence): Presence percentage ≥ 75%
- **Red** (Low Presence): Presence percentage < 75%
- **Orange** (High Absence): Absence percentage > 25%

## Technical Implementation

### Service Methods

The `StudentService` provides the following methods for frequency calculations:

```typescript
// Get all attendance records
getAttendanceRecords(): AttendanceRecord[]

// Get attendance records for a specific class
getAttendanceByClass(classId: string): AttendanceRecord[]

// Get attendance records for a specific student
getAttendanceByStudent(studentId: string): AttendanceRecord[]

// Add a new attendance record
addAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord

// Generate a frequency report
generateFrequencyReport(
  classId: string,
  period: 'semester' | 'year',
  semester?: string
): FrequencyReport | null
```

### Data Storage

- Attendance records are stored in browser localStorage under the key `'attendance'`
- Data persists across browser sessions
- Data is automatically loaded when the service initializes

## Future Enhancements

Potential improvements for the frequency feature:

1. **Custom Date Ranges**: Allow teachers to select custom start and end dates
2. **Detailed Attendance Entry**: Create a UI for entering attendance records day by day
3. **PDF Export**: Add PDF generation alongside CSV export
4. **Charts and Visualizations**: Add graphs showing attendance trends over time
5. **Email Reports**: Send frequency reports via email
6. **Attendance Alerts**: Notify teachers when students fall below attendance thresholds
7. **Excused Absences**: Add support for excused vs unexcused absences
8. **Late Arrivals**: Track and report on tardiness
9. **Comparison Views**: Compare attendance across different semesters or years
10. **Student Dashboard**: Allow students to view their own attendance statistics

## Screenshots & Navigation

The feature is accessible from:

- **Sidebar Menu**: "Raport Częstotliwości" (with bar_chart icon)
- **Route**: `/frequency`

## Best Practices

1. **Regular Data Entry**: Enter attendance records regularly for accurate reports
2. **Backup Data**: Use the export feature to backup attendance data regularly
3. **Review Thresholds**: Periodically review students with low attendance
4. **Academic Year Setup**: Ensure classes have correct academic year and semester information
5. **Clear Old Data**: Archive or clear data from previous academic years to maintain performance

## Troubleshooting

### Report Shows No Data

- Ensure attendance records have been entered for the selected class
- Check that the class has active students enrolled
- Verify the correct semester is selected in semester mode

### Export Doesn't Work

- Ensure a report has been generated first
- Check browser pop-up blocker settings
- Verify JavaScript is enabled in the browser

### Incorrect Calculations

- Verify attendance records have been entered correctly
- Check that totalHours = hoursPresent + hoursAbsent for each record
- Ensure dates fall within the selected period

## Support

For questions or issues with the frequency feature, please refer to the main project documentation or open an issue in the repository.
