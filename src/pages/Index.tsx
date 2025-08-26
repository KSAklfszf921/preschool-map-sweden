import { useState, useMemo } from 'react';
import { MapContainer } from '@/components/MapContainer';
import { PreschoolCard } from '@/components/PreschoolCard';
import { SearchFilters } from '@/components/SearchFilters';
import { samplePreschools } from '@/data/preschools';
import { Preschool, SearchFilters as SearchFiltersType } from '@/types/preschool';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, Clock, Users, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const [selectedPreschool, setSelectedPreschool] = useState<Preschool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Filter preschools based on search and filters
  const filteredPreschools = useMemo(() => {
    return samplePreschools.filter((preschool) => {
      // Text search
      const matchesSearch = !searchQuery || 
        preschool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preschool.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preschool.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preschool.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Municipality filter
      const matchesMunicipality = !filters.municipality || 
        preschool.municipality === filters.municipality;

      // Specialty filter
      const matchesSpecialty = !filters.specialty ||
        preschool.specialties.includes(filters.specialty);

      // Language filter
      const matchesLanguage = !filters.language ||
        preschool.languages.includes(filters.language);

      // Rating filter
      const matchesRating = !filters.minRating ||
        preschool.rating >= filters.minRating;

      return matchesSearch && matchesMunicipality && matchesSpecialty && matchesLanguage && matchesRating;
    });
  }, [searchQuery, filters]);

  const handlePreschoolSelect = (preschool: Preschool) => {
    setSelectedPreschool(preschool);
  };

  const closeDetails = () => {
    setSelectedPreschool(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative h-80 bg-gradient-hero overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Svenska Förskolor
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl animate-slide-up">
            Hitta den perfekta förskolan för ditt barn. Utforska hundratals förskolor över hela Sverige.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
          {/* Search & Filter Panel */}
          <div className="lg:col-span-1 space-y-4 max-h-full overflow-y-auto">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultsCount={filteredPreschools.length}
            />

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex-1"
              >
                Karta
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex-1"
              >
                Lista
              </Button>
            </div>

            {/* Preschool List (when in list mode or sidebar) */}
            {(viewMode === 'list' || viewMode === 'map') && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPreschools.map((preschool) => (
                  <PreschoolCard
                    key={preschool.id}
                    preschool={preschool}
                    onViewDetails={handlePreschoolSelect}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPreschool?.id === preschool.id ? 'ring-2 ring-primary shadow-glow' : ''
                    }`}
                  />
                ))}
                
                {filteredPreschools.length === 0 && (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Inga förskolor hittades med dina sökkriterier.
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Map or List View */}
          <div className="lg:col-span-2 relative">
            {viewMode === 'map' ? (
              <MapContainer
                preschools={filteredPreschools}
                selectedPreschool={selectedPreschool}
                onPreschoolSelect={handlePreschoolSelect}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-full overflow-y-auto p-4 bg-muted/30 rounded-lg">
                {filteredPreschools.map((preschool) => (
                  <PreschoolCard
                    key={preschool.id}
                    preschool={preschool}
                    onViewDetails={handlePreschoolSelect}
                    className="cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Preschool Details Modal/Sidebar */}
        {selectedPreschool && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-elegant">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedPreschool.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{selectedPreschool.address}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeDetails}>
                    ×
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-secondary-bright/10 text-secondary-bright">
                    ⭐ {selectedPreschool.rating}
                  </Badge>
                  <Badge variant="outline">{selectedPreschool.municipality}</Badge>
                </div>

                <p className="text-muted-foreground">{selectedPreschool.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">Åldersgrupp</p>
                        <p className="text-sm text-muted-foreground">{selectedPreschool.ageRange}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">Kapacitet</p>
                        <p className="text-sm text-muted-foreground">{selectedPreschool.capacity} barn</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">Öppettider</p>
                        <p className="text-sm text-muted-foreground">{selectedPreschool.openingHours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedPreschool.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-accent" />
                        <div>
                          <p className="font-medium">Telefon</p>
                          <a 
                            href={`tel:${selectedPreschool.phone}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {selectedPreschool.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedPreschool.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-accent" />
                        <div>
                          <p className="font-medium">E-post</p>
                          <a 
                            href={`mailto:${selectedPreschool.email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {selectedPreschool.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedPreschool.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-accent" />
                        <div>
                          <p className="font-medium">Hemsida</p>
                          <a 
                            href={selectedPreschool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Besök hemsida
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Specialiteter</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPreschool.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="bg-primary-soft text-primary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Språk</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPreschool.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;