'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
    search?: string;
  };
}

export function StudentFilters({ options, currentFilters }: StudentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentFilters.search ?? '');

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

  const handleFilterChange = (filterName: 'year' | 'branch' | 'division' | 'search', value: string) => {
    router.push(pathname + '?' + createQueryString(filterName, value));
  };
  
  const handleReset = () => {
    setSearchValue('');
    router.push(pathname);
  };
  
  useEffect(() => {
    const handler = setTimeout(() => {
        if(searchValue !== (currentFilters.search ?? '')) {
            handleFilterChange('search', searchValue)
        }
    }, 500); // Debounce search input
    return () => clearTimeout(handler);
  }, [searchValue])

  const hasActiveFilters = !!(currentFilters.year || currentFilters.branch || currentFilters.division || currentFilters.search);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search by name..."
                className="pl-10 w-[240px]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
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
