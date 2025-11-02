# Student Frequency Calculator

A comprehensive Angular application for tracking and analyzing student attendance. This project helps teachers efficiently manage student attendance records and generate detailed frequency reports.

## Features

### 📊 Frequency Report (NEW!)

- Generate attendance frequency reports by semester or full academic year
- Calculate total hours present/absent for each student
- View class-wide averages and individual student statistics
- Export reports to CSV format
- Visual indicators for attendance thresholds
- See [FREQUENCY_FEATURE.md](./FREQUENCY_FEATURE.md) for detailed documentation

### 👨‍🎓 Student Management

- Add, edit, and delete students
- Organize students by class
- Track student enrollment dates and status

### 📚 Class Management

- Create and manage multiple classes
- Track academic year and semester information
- Assign students to classes

### 📈 Dashboard

- Overview of total students and classes
- Quick access to key metrics
- Sample data generation for testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd student-frequency
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
ng serve
```

4. Navigate to `http://localhost:4200/` in your browser

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
