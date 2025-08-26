import { Preschool } from '@/types/preschool';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Users, Star } from 'lucide-react';

interface PreschoolCardProps {
  preschool: Preschool;
  onViewDetails?: (preschool: Preschool) => void;
  className?: string;
}

export const PreschoolCard = ({ preschool, onViewDetails, className }: PreschoolCardProps) => {
  const handleViewDetails = () => {
    onViewDetails?.(preschool);
  };

  return (
    <Card className={`bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">{preschool.name}</h3>
          <div className="flex items-center gap-1 bg-secondary-bright/10 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-secondary-bright text-secondary-bright" />
            <span className="text-sm font-medium text-secondary-foreground">{preschool.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm line-clamp-1">{preschool.address}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{preschool.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <span>{preschool.ageRange}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs">{preschool.openingHours}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {preschool.specialties.slice(0, 2).map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs bg-primary-soft text-primary">
              {specialty}
            </Badge>
          ))}
          {preschool.specialties.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{preschool.specialties.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {preschool.phone && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={`tel:${preschool.phone}`} className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Ring
              </a>
            </Button>
          )}
          
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={handleViewDetails}
          >
            Visa detaljer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};