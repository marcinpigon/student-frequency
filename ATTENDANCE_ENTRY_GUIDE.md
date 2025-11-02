# Attendance Entry Guide

## Overview

The **Attendance Entry** page is where you input the actual hours data for students. This is the foundation for generating frequency reports.

## How to Access

1. Click **"Frekwencja"** (Attendance) in the sidebar menu
2. You'll see the attendance entry page with a form

## Step-by-Step: Recording Attendance

### Step 1: Select a Class

- Choose a class from the **"Select Class"** dropdown
- The dropdown shows: Class Name - Academic Year (Semester)
- Example: "Mathematics 101 - 2024-2025 (Fall)"

### Step 2: Choose Date

- Click the date picker to select the date for this attendance record
- Default is today's date
- You can record attendance for past dates if needed

### Step 3: Set Total Hours

- Enter the **total scheduled hours** for the day
- Default is 8 hours (typical school day)
- This can be adjusted based on your schedule (e.g., 6 hours, 4 hours, etc.)

### Step 4: Enter Student Attendance

Once you select a class, a table appears with all students:

For each student:

1. **Hours Present**: Enter how many hours the student attended

   - Can use decimal values (e.g., 7.5, 4.5)
   - Use arrows or type directly
   - Shows a percentage indicator (Green ≥75%, Orange <75%)

2. **Hours Absent**: Auto-calculated

   - Automatically updates as you type hours present
   - Hours Absent = Total Hours - Hours Present

3. **Notes** (Optional): Add any special circumstances
   - Examples: "sick", "excused", "late arrival", "doctor appointment"

### Step 5: Quick Actions (Optional)

Use these buttons to speed up data entry:

- **Mark All Present**: Sets all students to full hours present (0 absent)

  - Use this when most/all students attended
  - Then manually adjust students who were absent

- **Mark All Absent**: Sets all students to 0 hours present (all absent)
  - Use this when most students were absent (e.g., holiday, class cancelled)
  - Then manually adjust students who attended

### Step 6: Save

- Click **"Save Attendance"** button
- A confirmation message appears
- Form resets but keeps the class and date selected
- You can continue entering attendance for the next day

## Example Workflow

### Scenario 1: Normal School Day

```
Class: Mathematics 101 - 2024-2025 (Fall)
Date: November 2, 2025
Total Hours: 8

Students:
- Emma Johnson: 8 hours present (100%)
- Liam Williams: 8 hours present (100%)
- Olivia Brown: 6 hours present (75%) - Note: "Left early - sick"
- Noah Davis: 0 hours present (0%) - Note: "Absent - sick"
- Ava Miller: 8 hours present (100%)

Click "Save Attendance"
```

### Scenario 2: Half Day

```
Class: Physics 201 - 2024-2025 (Fall)
Date: November 1, 2025
Total Hours: 4 (half day schedule)

Click "Mark All Present" (sets everyone to 4 hours)
Adjust: Noah Davis to 0 hours - Note: "Absent"

Click "Save Attendance"
```

### Scenario 3: Using Quick Actions

```
1. Select class and date
2. Click "Mark All Present" (everyone gets 8 hours)
3. Manually change just the absent students:
   - Student A: Change to 0 hours
   - Student B: Change to 4 hours - Note: "Half day"
4. Click "Save Attendance"
```

## Visual Indicators

### Percentage Colors

- 🟢 **Green (75-100%)**: Good attendance
- 🟠 **Orange (<75%)**: Below recommended threshold

These percentages are just for the current day to help you see at a glance who's attending.

## Tips for Efficient Data Entry

1. **Daily Routine**: Enter attendance daily while fresh in your memory
2. **Use Quick Actions**: Start with "Mark All Present" then adjust
3. **Tab Navigation**: Use Tab key to move between fields quickly
4. **Copy Pattern**: If attendance is similar day-to-day, use the same pattern
5. **Notes Field**: Use abbreviations like "S" for sick, "E" for excused, "L" for late

## Understanding the Data Flow

```
Attendance Entry Page → Student Service → Local Storage
                                              ↓
                                    Frequency Report Page
                                              ↓
                                    Generated Reports
```

1. **You enter data** on the Attendance page
2. **Data is saved** to browser localStorage
3. **Frequency Report** reads this data
4. **Reports show** totals and averages over time

## Where the Semester/Year Data Comes From

The semester and year information comes from the **class settings**:

- When you create a class, you set its Academic Year and Semester
- Example: "2024-2025" and "Fall"
- This is stored with the class information

When generating frequency reports:

- **Semester Mode**: Filters attendance records by the class's semester
- **Year Mode**: Includes all records for that class regardless of semester

## Checking Your Data

After entering attendance, you can verify it:

1. Go to **"Raport Częstotliwości"** (Frequency Report)
2. Select the same class
3. Choose period (Semester/Year)
4. Generate report
5. You'll see the cumulative totals from all your attendance entries

## Common Questions

### Q: Can I edit past attendance records?

A: Currently, you can only add new records. To fix errors, you would need to:

- Add a correcting entry, or
- Clear data and re-enter (use with caution!)

### Q: What if I forget to enter attendance for a day?

A: You can go back and enter it later by selecting the past date in the date picker.

### Q: Can students have partial hours?

A: Yes! Use decimal values like 7.5, 6.5, 4.5, etc.

### Q: What happens if Hours Present + Hours Absent ≠ Total Hours?

A: The system auto-calculates Hours Absent based on Hours Present, so they will always add up correctly.

### Q: How many records should I create?

A: One record per student per day. If you have 20 students and meet 5 days a week, you'll create 100 records per week.

### Q: Where is the data stored?

A: In your browser's localStorage. It persists between sessions but is specific to your browser.

### Q: Can I bulk import attendance?

A: Not currently, but it's a potential future feature. For now, use the quick action buttons to speed up entry.

## Troubleshooting

### Problem: No students appear after selecting class

**Solution**:

- Ensure the class has enrolled students
- Go to Students page and add students to the class

### Problem: Can't save attendance

**Solution**:

- Check that all required fields are filled
- Ensure Hours Present is not negative or greater than Total Hours
- Make sure a class and date are selected

### Problem: Percentage shows wrong color

**Solution**: This is just a visual indicator for the current day. The full frequency report will show accurate cumulative percentages.

## Next Steps

After entering attendance regularly:

1. **Generate Reports**: Use Frequency Report page to see trends
2. **Export Data**: Download CSV files for backup
3. **Review Patterns**: Identify students with low attendance
4. **Take Action**: Follow up with students showing concerning patterns

## Best Practices

✅ **Enter attendance daily** - Don't let it pile up
✅ **Add notes** for absences - Helps with documentation
✅ **Use quick actions** - Saves time
✅ **Double-check** before saving - Hard to edit later
✅ **Generate weekly reports** - Monitor trends
✅ **Export regularly** - Backup your data

---

**Happy Tracking! 📝✅**
