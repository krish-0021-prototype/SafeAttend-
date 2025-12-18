import { Shield, Users, AlertTriangle } from 'lucide-react';
import { getMockStudents, getFilterOptions } from '@/lib/mock-data';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { StudentTable } from '@/components/dashboard/StudentTable';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { StudentFilters } from '@/components/dashboard/StudentFilters';
import type { Branch, Division, Year } from '@/lib/types';


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

  const filteredStudents = allStudents.filter(student => {
    return (
      (!selectedYear || student.year === selectedYear) &&
      (!selectedBranch || student.branch === selectedBranch) &&
      (!selectedDivision || student.division === selectedDivision)
    );
  });

  const totalStudents = filteredStudents.length;
  const criticalRisks = filteredStudents.filter(s => s.riskLevel === 'Critical').length;

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">AttendSafe AI</h1>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 mb-8">
          <SummaryCard title="Total Students" value={totalStudents} icon={Users} />
          <SummaryCard 
            title="Critical Risks" 
            value={criticalRisks} 
            icon={AlertTriangle} 
            className={criticalRisks > 0 ? "[&_svg]:text-destructive text-destructive" : ""}
          />
        </section>

        <section className="mb-8">
            <StudentFilters 
                options={filterOptions}
                currentFilters={{ year: selectedYear, branch: selectedBranch, division: selectedDivision }}
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
