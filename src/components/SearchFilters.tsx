import { useState } from 'react';
import { SearchFilters as SearchFiltersType } from '@/types/preschool';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, MapPin } from 'lucide-react';
import { municipalities } from '@/data/preschools';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultsCount: number;
}

export const SearchFilters = ({ 
  filters, 
  onFiltersChange, 
  searchQuery, 
  onSearchChange, 
  resultsCount 
}: SearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const specialties = [
    'Naturpedagogik', 'Reggio Emilia', 'Montessori', 'Waldorf', 
    'Utomhuspedagogik', 'Mångkultur', 'Teknik', 'Musik', 'Språkutveckling'
  ];

  const languages = [
    'Svenska', 'Engelska', 'Spanska', 'Arabiska', 'Danska', 'Franska'
  ];

  const updateFilter = (key: keyof SearchFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Sök förskolor, områden eller kommuner..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card shadow-card border-0"
        />
      </div>

      {/* Filter Toggle & Results */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filter
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {Object.values(filters).filter(v => v).length}
            </Badge>
          )}
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{resultsCount} förskolor</span>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-card p-4 rounded-lg shadow-card space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Municipality Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kommun</label>
              <Select
                value={filters.municipality || ''}
                onValueChange={(value) => updateFilter('municipality', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj kommun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alla kommuner</SelectItem>
                  {municipalities.map((municipality) => (
                    <SelectItem key={municipality.id} value={municipality.name}>
                      {municipality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialitet</label>
              <Select
                value={filters.specialty || ''}
                onValueChange={(value) => updateFilter('specialty', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj specialitet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alla specialiteter</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Språk</label>
              <Select
                value={filters.language || ''}
                onValueChange={(value) => updateFilter('language', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj språk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alla språk</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Minsta betyg</label>
              <Select
                value={filters.minRating?.toString() || ''}
                onValueChange={(value) => updateFilter('minRating', value ? parseFloat(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj betyg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alla betyg</SelectItem>
                  <SelectItem value="4.5">4.5+ stjärnor</SelectItem>
                  <SelectItem value="4.0">4.0+ stjärnor</SelectItem>
                  <SelectItem value="3.5">3.5+ stjärnor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => 
                  value && (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="flex items-center gap-1 bg-primary-soft text-primary"
                    >
                      {value}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => updateFilter(key as keyof SearchFiltersType, undefined)}
                      />
                    </Badge>
                  )
                )}
              </div>
              
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Rensa alla
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};