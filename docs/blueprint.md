# **App Name**: AttendSafe AI

## Core Features:

- Student Dashboard: Display student names, attendance progress bars, AI insights, and "Missable Lectures" count, with risk highlighting.
- Risk Calculation: Calculate the attendance risk level (Safe, Warning, Critical) and the number of lectures a student can miss based on their attendance record.
- AI-Powered Academic Advice: Provide personalized attendance advice to students. The tool should encourage better attendance and offer safe-to-miss lecture counts, enhancing student success.
- Mock Data Initialization: Initialize the Firestore database with a set of five mock students including a mix of 'Safe', 'Warning', and 'Critical' risk profiles.
- Data Persistence: Store and retrieve student attendance data, risk levels, and AI advice using Firestore.

## Style Guidelines:

- Primary color: Dark Indigo (#3F51B5) to create a calm and professional tone.
- Background color: Very light grey (#F5F5F5) for a clean and uncluttered interface.
- Accent color: Teal (#009688) to highlight key data points and interactive elements.
- Body and headline font: 'Inter', sans-serif, for a clean and readable interface.
- Use Lucide-React icons to provide a consistent and modern visual language.
- Dashboard layout should use a grid system to provide a clear overview. Summary cards are positioned above the main table for key metrics.
- Use subtle transition animations when data loads or updates to provide a smoother user experience.