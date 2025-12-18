'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Branch, Division, Year } from '@/lib/types';

interface StudentFiltersProps {
  options: {
    years: Year[];
    branches: Branch[];
    divisions: Division[];
  };
  currentFilters: {
    year?: Year;
    branch?: Branch;
    division?: Division;
  };
}

export function StudentFilters({ options, currentFilters }: StudentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (filterName: 'year' | 'branch' | 'division', value: string) => {
    router.push(pathname + '?' + createQueryString(filterName, value));
  };
  
  const handleReset = () => {
    router.push(pathname);
  };

  const hasActiveFilters = !!(currentFilters.year || currentFilters.branch || currentFilters.division);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Select onValueChange={(value) => handleFilterChange('year', value)} value={currentFilters.year?.toString() ?? 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {options.years.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange('branch', value)} value={currentFilters.branch ?? 'all'}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {options.branches.map(branch => (
              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange('division', value)} value={currentFilters.division ?? 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Divisions</SelectItem>
            {options.divisions.map(division => (
              <SelectItem key={division} value={division}>{division}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {hasActiveFilters && (
            <Button variant="ghost" onClick={handleReset}>Reset Filters</Button>
        )}
      </div>
    </Card>
  );
}
