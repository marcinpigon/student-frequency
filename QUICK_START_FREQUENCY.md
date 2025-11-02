# Quick Start Guide - Frequency Report Feature

## Step-by-Step Tutorial

### 1. Access the Application

- Open your browser and navigate to `http://localhost:4200`
- The application will load with the dashboard

### 2. Set Up Sample Data (First Time Users)

#### Add Classes

1. Click on "Uczniowie" (Students) in the sidebar
2. If you don't have any data, click "Załaduj przykładowe dane" (Load Sample Data)
3. This will create sample classes and students

### 3. Navigate to Frequency Report

1. Click on "Raport Częstotliwości" (Frequency Report) in the sidebar
2. You'll see the frequency report page

### 4. Generate Sample Attendance Data

Since you're starting fresh, you need attendance records:

1. Select a class from the "Select Class" dropdown (e.g., "Mathematics 101")
2. Click the "Add Sample Data" button
3. This will generate random attendance records for all students in the class
4. You'll see a confirmation message

### 5. Generate Your First Report

#### For Semester Report:

1. Keep the "Semester" radio button selected
2. Select a class (e.g., "Mathematics 101 - 2024-2025")
3. Choose a semester from the dropdown (e.g., "Fall")
4. Click "Generate Report"

#### For Year Report:

1. Select the "Year" radio button
2. Select a class
3. Click "Generate Report"

### 6. Understanding the Report

The report displays:

**Summary Section (at the top):**

- Total Class Hours: Average hours scheduled for the class
- Class Average Presence: Average attendance percentage across all students
- Class Average Absence: Average absence percentage across all students
- Total Students: Number of students in the class

**Student Table:**
Each row shows:

- Student Name
- Hours Present (colored green if good attendance)
- Hours Absent
- Total Hours
- Presence % (green if ≥75%, red if <75%)
- Absence % (orange if >25%)

### 7. Export the Report

1. After generating a report, scroll to the bottom
2. Click "Export as CSV"
3. A CSV file will download to your computer
4. Open it in Excel or Google Sheets for further analysis

### 8. Generate Another Report

1. Click "Clear" to reset the form
2. Select different class or period
3. Generate a new report

## Tips

### Understanding the Sample Data

- Sample data generates 10 attendance records per student
- Each record represents a day with 8 total hours
- Hours present are randomized (0-8) to simulate real attendance patterns
- Dates span across September-November

### Best Practices

1. **Regular Data Entry**: In production, enter attendance daily
2. **Review Low Attendance**: Pay attention to students in red (below 75%)
3. **Compare Periods**: Generate reports for different semesters to track trends
4. **Export Regularly**: Download CSV files for record-keeping

### Color Coding Guide

- 🟢 **Green** (Presence ≥75%): Good attendance
- 🔴 **Red** (Presence <75%): Below acceptable threshold
- 🟠 **Orange** (Absence >25%): High absence rate

## Example Workflow

### Scenario: End of Semester Report

1. **Navigate to Frequency Report**

   - Click "Raport Częstotliwości" in sidebar

2. **Select Your Class**

   - Choose "Mathematics 101 - 2024-2025" from dropdown

3. **Configure Period**

   - Keep "Semester" selected
   - Choose "Fall" from semester dropdown

4. **Generate Report**

   - Click "Generate Report" button
   - Review the statistics displayed

5. **Analyze Results**

   - Check class average (should ideally be >75%)
   - Identify students with low attendance (red percentages)
   - Note students with high absence rates (orange percentages)

6. **Export for Records**

   - Click "Export as CSV"
   - Save file with descriptive name
   - Share with administration if needed

7. **Take Action**
   - Follow up with students showing low attendance
   - Document patterns for parent-teacher conferences
   - Use data for academic intervention planning

## Troubleshooting

### No Data Appears

**Problem**: Report shows no students
**Solution**:

- Ensure you've selected a class with students
- Make sure attendance records exist for that class
- Try clicking "Add Sample Data" to generate test data

### Wrong Calculations

**Problem**: Numbers don't seem right
**Solution**:

- Verify you selected the correct semester
- Check that attendance records are for the correct date range
- Regenerate sample data if needed

### Can't Export

**Problem**: CSV download doesn't start
**Solution**:

- Ensure a report is generated first
- Check browser pop-up blocker settings
- Try a different browser

### Empty Class List

**Problem**: No classes appear in dropdown
**Solution**:

- Go to Students page
- Click "Załaduj przykładowe dane" (Load Sample Data)
- Return to Frequency Report page

## Next Steps

Once you're comfortable with the feature:

1. **Delete Sample Data**: Clear sample data and start entering real data
2. **Create Real Classes**: Set up your actual classes with correct academic years
3. **Enter Real Attendance**: Build a system for daily attendance entry
4. **Regular Reports**: Generate reports weekly/monthly to track progress
5. **Share Reports**: Use CSV exports to share with administrators

## Advanced Usage

### Custom Attendance Entry

Currently, you can add attendance records programmatically. Future updates will include:

- Daily attendance UI
- Bulk import from CSV
- Mobile attendance entry
- Integration with school systems

### Data Management

- Attendance records are stored in browser localStorage
- Data persists between sessions
- Clear browser data will erase records
- Export regularly as backup

## Support

For more detailed information:

- See [FREQUENCY_FEATURE.md](./FREQUENCY_FEATURE.md) for technical details
- Check [business_requirements.txt](./business_requirements.txt) for feature specifications
- Review [technical_requirements.txt](./technical_requirements.txt) for architecture details

---

**Happy Tracking! 📊📚**
