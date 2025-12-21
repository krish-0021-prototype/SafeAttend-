import { getMockStudents, getFilterOptions } from '@/lib/mock-data';
import { StudentTable } from '@/components/dashboard/StudentTable';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { StudentFilters } from '@/components/dashboard/StudentFilters';
import type { Branch, Division, Year, Student } from '@/lib/types';
import { Logo } from '@/components/dashboard/Logo';
import { AutomationPanel } from '@/components/dashboard/AutomationPanel';


export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const allStudents = await getMockStudents();
  const filterOptions = await getFilterOptions();

  const selectedYear = searchParams.year ? parseInt(searchParams.year as string) as Year : undefined;
  const selectedBranch = searchParams.branch as Branch | undefined;
  const selectedDivision = searchParams.division as Division | undefined;
  const searchQuery = (searchParams.search as string) || '';

  const filteredStudents = allStudents.filter(student => {
    const searchMatch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const yearMatch = !selectedYear || student.year === selectedYear;
    const branchMatch = !selectedBranch || student.branch === selectedBranch;
    const divisionMatch = !selectedDivision || student.division === selectedDivision;
    
    return searchMatch && yearMatch && branchMatch && divisionMatch;
  });

  const studentsToNotify = allStudents.filter(s => s.riskLevel === 'Critical' || s.riskLevel === 'Warning');

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <Logo />
        </header>
        
        <section className="mb-8">
          <AutomationPanel studentsToNotify={studentsToNotify} />
        </section>

        <section className="mb-8">
            <StudentFilters 
                options={filterOptions}
                currentFilters={{ 
                    year: selectedYear, 
                    branch: selectedBranch, 
                    division: selectedDivision,
                    search: searchQuery
                }}
            />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Student Overview</h2>
            <Suspense fallback={<StudentTableSkeleton />}>
              <StudentTable students={filteredStudents} />
            </Suspense>
        </section>
      </main>
    </div>
  );
}


function StudentTableSkeleton() {
  return (
    <Card>
        <div className="space-y-2 p-4">
            <Skeleton className="h-12 w-full" />
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    </Card>
  )
}
