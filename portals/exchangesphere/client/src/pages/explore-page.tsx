import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from '@/components/user-avatar';
import { SkillBadge } from '@/components/skill-badge';
import { Stars } from '@/components/ui/stars';
import { AchievementBadges } from '@/components/achievement-badges';
import { AchievementType } from '@/components/achievement-badge';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { CheckCircle, Filter, Search, Map, Globe, Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { format } from 'date-fns';

// Filter state interface
interface FilterState {
  skillTypes: string[];
  location: {
    city: string;
    radius: number;
    useCurrentLocation: boolean;
  };
  availability: {
    dates: Date[];
    timeOfDay: string[]; // morning, afternoon, evening
  };
  languages: string[];
  searchQuery: string;
}

// Available skill categories
const skillCategories = [
  { id: 'photography', label: 'Photography' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'yoga', label: 'Yoga & Fitness' },
  { id: 'design', label: 'Design' },
  { id: 'language', label: 'Languages' },
  { id: 'drone', label: 'Drone Flying' },
  { id: 'editing', label: 'Video Editing' },
  { id: 'baking', label: 'Baking' },
  { id: 'music', label: 'Music' },
  { id: 'coding', label: 'Programming' },
];

// Available languages
const availableLanguages = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
  { id: 'de', label: 'German' },
  { id: 'zh', label: 'Chinese' },
  { id: 'ja', label: 'Japanese' },
  { id: 'ko', label: 'Korean' },
  { id: 'pt', label: 'Portuguese' },
  { id: 'ar', label: 'Arabic' },
  { id: 'hi', label: 'Hindi' },
];

// Time periods
const timePeriods = [
  { id: 'morning', label: 'Morning (6AM-12PM)' },
  { id: 'afternoon', label: 'Afternoon (12PM-5PM)' },
  { id: 'evening', label: 'Evening (5PM-10PM)' },
];

export default function ExplorePage() {
  const { user } = useAuth();
  // State to track if filters panel is open
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  
  // Filter state with persistence via localStorage
  const [filters, setFilters] = useState<FilterState>(() => {
    const savedFilters = localStorage.getItem('exchangesphere-filters');
    if (savedFilters) {
      try {
        // We need to convert date strings back to Date objects
        const parsedFilters = JSON.parse(savedFilters);
        return {
          ...parsedFilters,
          availability: {
            ...parsedFilters.availability,
            dates: parsedFilters.availability.dates.map((date: string) => new Date(date)),
          },
        };
      } catch (e) {
        console.error('Failed to parse saved filters', e);
      }
    }
    
    // Default filter state
    return {
      skillTypes: [],
      location: {
        city: '',
        radius: 50,
        useCurrentLocation: false,
      },
      availability: {
        dates: [],
        timeOfDay: [],
      },
      languages: [],
      searchQuery: '',
    };
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('exchangesphere-filters', JSON.stringify(filters));
    } catch (e) {
      console.error('Failed to save filters', e);
    }
  }, [filters]);

  // Function to reset all filters
  const resetFilters = () => {
    setFilters({
      skillTypes: [],
      location: {
        city: '',
        radius: 50,
        useCurrentLocation: false,
      },
      availability: {
        dates: [],
        timeOfDay: [],
      },
      languages: [],
      searchQuery: '',
    });
  };

  // Function to remove a single filter
  const removeFilter = (type: keyof FilterState, value: string) => {
    if (type === 'skillTypes') {
      setFilters(prev => ({
        ...prev,
        skillTypes: prev.skillTypes.filter(skill => skill !== value),
      }));
    } else if (type === 'languages') {
      setFilters(prev => ({
        ...prev,
        languages: prev.languages.filter(lang => lang !== value),
      }));
    } else if (type === 'availability') {
      setFilters(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          timeOfDay: prev.availability.timeOfDay.filter(time => time !== value),
        },
      }));
    } else if (type === 'location') {
      setFilters(prev => ({
        ...prev,
        location: {
          ...prev.location,
          city: '',
        },
      }));
    } else if (type === 'searchQuery') {
      setFilters(prev => ({
        ...prev,
        searchQuery: '',
      }));
    }
  };

  // Toggle skill filter
  const toggleSkillFilter = (skillId: string) => {
    setFilters(prev => {
      if (prev.skillTypes.includes(skillId)) {
        return {
          ...prev,
          skillTypes: prev.skillTypes.filter(id => id !== skillId),
        };
      } else {
        return {
          ...prev,
          skillTypes: [...prev.skillTypes, skillId],
        };
      }
    });
  };

  // Toggle language filter
  const toggleLanguageFilter = (langId: string) => {
    setFilters(prev => {
      if (prev.languages.includes(langId)) {
        return {
          ...prev,
          languages: prev.languages.filter(id => id !== langId),
        };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, langId],
        };
      }
    });
  };

  // Toggle time of day filter
  const toggleTimeOfDayFilter = (timeId: string) => {
    setFilters(prev => {
      if (prev.availability.timeOfDay.includes(timeId)) {
        return {
          ...prev,
          availability: {
            ...prev.availability,
            timeOfDay: prev.availability.timeOfDay.filter(id => id !== timeId),
          },
        };
      } else {
        return {
          ...prev,
          availability: {
            ...prev.availability,
            timeOfDay: [...prev.availability.timeOfDay, timeId],
          },
        };
      }
    });
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setFilters(prev => {
      const currentDates = prev.availability.dates;
      const dateExists = currentDates.some(d => 
        d.getFullYear() === date.getFullYear() && 
        d.getMonth() === date.getMonth() && 
        d.getDate() === date.getDate()
      );

      if (dateExists) {
        return {
          ...prev,
          availability: {
            ...prev.availability,
            dates: currentDates.filter(d => 
              d.getFullYear() !== date.getFullYear() || 
              d.getMonth() !== date.getMonth() || 
              d.getDate() !== date.getDate()
            ),
          },
        };
      } else {
        return {
          ...prev,
          availability: {
            ...prev.availability,
            dates: [...currentDates, date],
          },
        };
      }
    });
  };

  // Function to update geolocation
  const updateCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would reverse geocode to get city name
          // For now we just indicate that geolocation is active
          setFilters(prev => ({
            ...prev,
            location: {
              ...prev.location,
              useCurrentLocation: true,
              city: 'Current Location',
            },
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Fetch users that match filters
  const { data: matches, isLoading } = useQuery<User[]>({
    queryKey: ['/api/matches', filters],
    enabled: !!user,
  });

  // Enhanced match data with additional info needed for display
  const enhancedMatches = React.useMemo(() => {
    if (!matches) return [];
    
    return matches.map(user => ({
      ...user,
      // Example skills that would come from API
      skills: [
        { id: 1, name: user.id === 2 ? 'Drone Photography' : 'Cooking', category: user.id === 2 ? 'photography' : 'cooking' },
        { id: 2, name: user.id === 2 ? 'Video Editing' : 'Baking', category: user.id === 2 ? 'editing' : 'baking' }
      ],
      // Example match score that would come from AI matching
      matchScore: user.id === 2 ? 93 : 87,
      // Example rating that would come from reviews
      rating: user.id === 2 ? 4.8 : 4.7,
      // Example bio summary
      bio: user.id === 2 
        ? 'David is an expert drone pilot who can help with aerial photography and is looking to learn cooking skills.'
        : 'Sarah is a professional chef who offers cooking lessons and is interested in learning photography skills.',
      // Example available times that would come from the API
      availableTimes: ['morning', 'evening'],
      // Example languages that would come from the API
      spokenLanguages: user.id === 2 ? ['en', 'es'] : ['en', 'fr'],
      // Example achievement badges based on milestone criteria
      achievements: user.id === 2 
        ? ['mentor', 'trusted', 'time'] as AchievementType[]  // David has multiple achievements
        : ['cultural'] as AchievementType[],                  // Sarah has the cultural achievement
    }));
  }, [matches]);

  // Generate active filter badges
  const activeFilterBadges = () => {
    const badges = [];

    // Skill types
    filters.skillTypes.forEach(skillId => {
      const skill = skillCategories.find(s => s.id === skillId);
      if (skill) {
        badges.push(
          <Badge 
            key={`skill-${skillId}`} 
            variant="outline" 
            className="mr-2 mb-2 flex items-center gap-1"
          >
            {skill.label}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => removeFilter('skillTypes', skillId)} 
            />
          </Badge>
        );
      }
    });

    // Location
    if (filters.location.city) {
      badges.push(
        <Badge 
          key="location" 
          variant="outline" 
          className="mr-2 mb-2 flex items-center gap-1"
        >
          <Map className="h-3 w-3 mr-1" />
          {filters.location.city} ({filters.location.radius} km)
          <X 
            className="h-3 w-3 ml-1 cursor-pointer" 
            onClick={() => removeFilter('location', 'city')} 
          />
        </Badge>
      );
    }

    // Availability dates
    filters.availability.dates.forEach((date, idx) => {
      badges.push(
        <Badge 
          key={`date-${idx}`} 
          variant="outline" 
          className="mr-2 mb-2 flex items-center gap-1"
        >
          <CalendarIcon className="h-3 w-3 mr-1" />
          {format(date, 'MMM d, yyyy')}
          <X 
            className="h-3 w-3 ml-1 cursor-pointer" 
            onClick={() => setFilters(prev => ({
              ...prev,
              availability: {
                ...prev.availability,
                dates: prev.availability.dates.filter((_, i) => i !== idx),
              },
            }))} 
          />
        </Badge>
      );
    });

    // Time of day
    filters.availability.timeOfDay.forEach(timeId => {
      const time = timePeriods.find(t => t.id === timeId);
      if (time) {
        badges.push(
          <Badge 
            key={`time-${timeId}`} 
            variant="outline" 
            className="mr-2 mb-2 flex items-center gap-1"
          >
            <Clock className="h-3 w-3 mr-1" />
            {time.label}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => removeFilter('availability', timeId)} 
            />
          </Badge>
        );
      }
    });

    // Languages
    filters.languages.forEach(langId => {
      const language = availableLanguages.find(l => l.id === langId);
      if (language) {
        badges.push(
          <Badge 
            key={`lang-${langId}`} 
            variant="outline" 
            className="mr-2 mb-2 flex items-center gap-1"
          >
            <Globe className="h-3 w-3 mr-1" />
            {language.label}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => removeFilter('languages', langId)} 
            />
          </Badge>
        );
      }
    });

    // Search query
    if (filters.searchQuery) {
      badges.push(
        <Badge 
          key="search" 
          variant="outline" 
          className="mr-2 mb-2 flex items-center gap-1"
        >
          <Search className="h-3 w-3 mr-1" />
          "{filters.searchQuery}"
          <X 
            className="h-3 w-3 ml-1 cursor-pointer" 
            onClick={() => removeFilter('searchQuery', '')} 
          />
        </Badge>
      );
    }

    return badges;
  };
  
  // This needs to handle filtering logic
  // In a full implementation, we would pass the filters to the backend
  // For now, we do some client-side filtering as a demo
  const filteredMatches = React.useMemo(() => {
    if (!enhancedMatches) return [];
    
    return enhancedMatches.filter(match => {
      // Filter by skills
      if (filters.skillTypes.length > 0) {
        const matchSkillCategories = match.skills.map(s => s.category);
        if (!filters.skillTypes.some(skillType => matchSkillCategories.includes(skillType as any))) {
          return false;
        }
      }
      
      // Filter by languages
      if (filters.languages.length > 0) {
        if (!filters.languages.some(lang => match.spokenLanguages.includes(lang))) {
          return false;
        }
      }
      
      // Filter by availability
      if (filters.availability.timeOfDay.length > 0) {
        if (!filters.availability.timeOfDay.some(time => match.availableTimes.includes(time))) {
          return false;
        }
      }
      
      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = match.fullName.toLowerCase();
        const matchBio = match.bio.toLowerCase();
        const matchSkills = match.skills.map(s => s.name.toLowerCase());
        
        if (!matchName.includes(query) && 
            !matchBio.includes(query) && 
            !matchSkills.some(skill => skill.includes(query))) {
          return false;
        }
      }
      
      return true;
    });
  }, [enhancedMatches, filters]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Explore Skill Exchanges</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find people with skills you want to learn, or share your own expertise
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              <h2 className="text-xl font-semibold">Filters</h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-sm"
              >
                Reset All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="text-sm"
              >
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap mb-4">
            {activeFilterBadges().length > 0 ? (
              activeFilterBadges()
            ) : (
              <p className="text-sm text-muted-foreground">No active filters. All exchanges are shown.</p>
            )}
          </div>

          {/* Collapsible Filter Panel */}
          {isFilterOpen && (
            <div className="bg-card border rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Field */}
                <div>
                  <Label className="mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills, names..."
                      className="pl-8"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        searchQuery: e.target.value
                      }))}
                    />
                  </div>
                </div>

                {/* Skill Type Filter */}
                <div>
                  <Label className="mb-2 block">Skill Type</Label>
                  <Accordion type="single" collapsible className="w-full" defaultValue="skills">
                    <AccordionItem value="skills" className="border-0">
                      <AccordionTrigger className="py-2 px-3 text-sm bg-muted rounded-md">
                        Select Skills
                      </AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          {skillCategories.map((skill) => (
                            <div key={skill.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`skill-${skill.id}`} 
                                checked={filters.skillTypes.includes(skill.id)}
                                onCheckedChange={() => toggleSkillFilter(skill.id)}
                              />
                              <label 
                                htmlFor={`skill-${skill.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {skill.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Location Filter */}
                <div>
                  <Label className="mb-2 block">Location</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="City or region"
                        value={filters.location.city}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            city: e.target.value,
                            useCurrentLocation: false,
                          }
                        }))}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={updateCurrentLocation}
                        title="Use current location"
                      >
                        <Map className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {(filters.location.city || filters.location.useCurrentLocation) && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs">Distance: {filters.location.radius} km</Label>
                        </div>
                        <Slider
                          value={[filters.location.radius]}
                          min={5}
                          max={100}
                          step={5}
                          onValueChange={(value) => setFilters(prev => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              radius: value[0],
                            }
                          }))}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <Label className="mb-2 block">Availability</Label>
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.availability.dates.length === 0 
                            ? <span>Pick dates</span>
                            : <span>{filters.availability.dates.length} date(s) selected</span>
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          onSelect={handleDateSelect}
                          selected={undefined} // We don't highlight a single date
                          modifiers={{
                            selected: filters.availability.dates,
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Accordion type="single" collapsible className="w-full" defaultValue="time">
                      <AccordionItem value="time" className="border-0">
                        <AccordionTrigger className="py-2 px-3 text-sm bg-muted rounded-md">
                          Time of Day
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                          <div className="space-y-2">
                            {timePeriods.map((time) => (
                              <div key={time.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`time-${time.id}`} 
                                  checked={filters.availability.timeOfDay.includes(time.id)}
                                  onCheckedChange={() => toggleTimeOfDayFilter(time.id)}
                                />
                                <label 
                                  htmlFor={`time-${time.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {time.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* Language Filter */}
                <div className="md:col-span-2 lg:col-span-4">
                  <Label className="mb-2 block">Languages</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((language) => (
                      <Badge 
                        key={language.id}
                        variant={filters.languages.includes(language.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleLanguageFilter(language.id)}
                      >
                        {language.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="text-sm text-muted-foreground">
              {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''} found
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Finding matches...</p>
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((match) => (
                <Card key={match.id} className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex items-start">
                        <UserAvatar
                          src={match.avatarUrl || undefined}
                          name={match.fullName}
                          size="lg"
                          showStatus
                          status="online"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium">{match.fullName}</h3>
                            <div className="flex items-center">
                              <Stars rating={match.rating} size="xs" />
                              <span className="ml-1 text-xs text-muted-foreground">{match.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{match.location}</p>
                          {match.achievements && match.achievements.length > 0 && (
                            <div className="mt-2">
                              <AchievementBadges 
                                achievements={match.achievements} 
                                size="sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm line-clamp-3">{match.bio}</p>
                      
                      <Separator className="my-3" />
                      
                      {/* Skills */}
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.skills.map((skill, idx) => (
                            <SkillBadge
                              key={idx}
                              skill={skill.name}
                              category={skill.category as any}
                              size="sm"
                            />
                          ))}
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      {/* Languages */}
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Languages</h4>
                        <div className="flex gap-2">
                          {match.spokenLanguages.map((lang) => {
                            const language = availableLanguages.find(l => l.id === lang);
                            return (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {language?.label || lang}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Availability */}
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Available</h4>
                        <div className="flex gap-2">
                          {match.availableTimes.map((time) => {
                            const period = timePeriods.find(t => t.id === time);
                            return (
                              <Badge key={time} variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {period?.label.split(' ')[0] || time}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-green-600 font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {match.matchScore}% Match
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="text-xs"
                          >
                            Connect
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-card">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to find more matches</p>
              <Button onClick={resetFilters}>Reset All Filters</Button>
            </div>
          )}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}