import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Award, CheckCircle, Info, ShieldCheck, Home, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, useRoute, Link } from "wouter";
import { Property } from "@shared/schema";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CertificationStep = 'basicInfo' | 'safety' | 'amenities' | 'finalInspection';

interface CertificationForm {
  // Basic Info
  hasAccurateAddressInfo: boolean;
  hasAccuratePropertyType: boolean;
  hasAccurateOwnershipDocs: boolean;
  
  // Safety Standards
  hasSmokeDetectors: boolean;
  hasFireExtinguisher: boolean;
  hasEmergencyExits: boolean;
  hasFirstAidKit: boolean;
  
  // Amenities Verification
  hasVerifiedBedrooms: boolean;
  hasVerifiedBathrooms: boolean;
  hasVerifiedKitchenAppliances: boolean;
  hasVerifiedInternetAccess: boolean;
  
  // Final Inspection
  hasPassedOnSiteInspection: boolean;
  hasCompletedAllRequirements: boolean;
}

const defaultCertificationForm: CertificationForm = {
  // Basic Info
  hasAccurateAddressInfo: false,
  hasAccuratePropertyType: false,
  hasAccurateOwnershipDocs: false,
  
  // Safety Standards
  hasSmokeDetectors: false,
  hasFireExtinguisher: false,
  hasEmergencyExits: false,
  hasFirstAidKit: false,
  
  // Amenities Verification
  hasVerifiedBedrooms: false,
  hasVerifiedBathrooms: false,
  hasVerifiedKitchenAppliances: false,
  hasVerifiedInternetAccess: false,
  
  // Final Inspection
  hasPassedOnSiteInspection: false,
  hasCompletedAllRequirements: false,
};

export default function PropertyCertificationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<CertificationStep>('basicInfo');
  const [certificationForm, setCertificationForm] = useState<CertificationForm>(defaultCertificationForm);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  
  // Get all properties
  const { data: properties, isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: !!user,
  });
  
  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Property> }) => {
      const res = await apiRequest('PUT', `/api/properties/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Certification update saved!",
        description: "Your property certification progress has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update certification",
        description: error.message || "An error occurred while updating the certification.",
        variant: "destructive",
      });
    },
  });
  
  // Calculate certification progress based on form
  const calculateProgressPercentage = (form: CertificationForm): number => {
    const totalCheckboxes = Object.values(form).length;
    const checkedCount = Object.values(form).filter(value => value === true).length;
    return Math.round((checkedCount / totalCheckboxes) * 100);
  };
  
  // Get step progress (25%, 50%, 75%, 100%)
  const getStepProgress = (step: CertificationStep): number => {
    switch (step) {
      case 'basicInfo':
        return 25;
      case 'safety':
        return 50;
      case 'amenities':
        return 75;
      case 'finalInspection':
        return 100;
      default:
        return 0;
    }
  };
  
  // Get selected property
  const selectedProperty = properties?.find(p => p.id === selectedPropertyId);
  
  // Continue to next step
  const handleNextStep = () => {
    if (activeStep === 'basicInfo') {
      setActiveStep('safety');
    } else if (activeStep === 'safety') {
      setActiveStep('amenities');
    } else if (activeStep === 'amenities') {
      setActiveStep('finalInspection');
    } else {
      // Certification complete
      setIsFormDialogOpen(false);
      
      // Update property certification status
      if (selectedPropertyId) {
        const progress = calculateProgressPercentage(certificationForm);
        updatePropertyMutation.mutate({
          id: selectedPropertyId,
          data: {
            certificationProgress: progress,
            isCertified: progress === 100,
          }
        });
      }
    }
  };
  
  // Go back to previous step
  const handlePreviousStep = () => {
    if (activeStep === 'finalInspection') {
      setActiveStep('amenities');
    } else if (activeStep === 'amenities') {
      setActiveStep('safety');
    } else if (activeStep === 'safety') {
      setActiveStep('basicInfo');
    }
  };
  
  // Open certification form dialog for a property
  const startCertification = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setActiveStep('basicInfo');
    setCertificationForm(defaultCertificationForm);
    setIsFormDialogOpen(true);
  };
  
  // Handle form change
  const handleFormChange = (field: keyof CertificationForm, value: boolean) => {
    setCertificationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Get properties grouped by certification status
  const certifiedProperties = properties?.filter(p => p.isCertified) || [];
  const inProgressProperties = properties?.filter(p => !p.isCertified && (p.certificationProgress || 0) > 0) || [];
  const notStartedProperties = properties?.filter(p => !p.isCertified && (!p.certificationProgress || p.certificationProgress === 0)) || [];
  
  if (isLoadingProperties) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-primary">Loading properties...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] bg-gradient-to-b from-[#FAFAFA] to-[#EAEAEA]">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center mb-2 text-[#2E2E2E]">
            <Award className="mr-2 h-8 w-8 text-[#2ECC71]" />
            Property Certification
          </h1>
          <p className="text-[#7F8C8D]">
            Track and update certification status for your properties. Complete all steps to achieve certified status.
          </p>
        </div>
        
        <Tabs defaultValue="inProgress" className="w-full">
          <TabsList className="mb-6 bg-[#FFFFFF] p-1 rounded-lg">
            <TabsTrigger 
              value="inProgress" 
              className="flex items-center data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white data-[state=inactive]:text-[#2E2E2E]"
            >
              <Info className="mr-2 h-4 w-4" />
              In Progress ({inProgressProperties.length})
            </TabsTrigger>
            <TabsTrigger 
              value="certified" 
              className="flex items-center data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white data-[state=inactive]:text-[#2E2E2E]"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Certified ({certifiedProperties.length})
            </TabsTrigger>
            <TabsTrigger 
              value="notStarted" 
              className="flex items-center data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white data-[state=inactive]:text-[#2E2E2E]"
            >
              <Home className="mr-2 h-4 w-4" />
              Not Started ({notStartedProperties.length})
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="inProgress" className="space-y-4">
            {inProgressProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden rounded-xl shadow-sm bg-white border-[#EAEAEA] hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[#2E2E2E] font-bold">{property.name}</CardTitle>
                      <CardDescription className="text-[#7F8C8D]">{property.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[#2E2E2E]">Certification Progress</span>
                          <span className="text-sm font-medium text-[#2E2E2E]">{property.certificationProgress || 0}%</span>
                        </div>
                        <div className="w-full bg-[#EAEAEA] rounded-full h-2">
                          <div 
                            className="bg-[#2ECC71] h-2 rounded-full" 
                            style={{ width: `${property.certificationProgress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(property.certificationProgress || 0) >= 25 ? 'bg-[#2ECC71]/20' : 'bg-[#EAEAEA]'}`}>
                            <CheckCircle className={`h-3 w-3 ${(property.certificationProgress || 0) >= 25 ? 'text-[#2ECC71]' : 'text-[#C0C0C0]'}`} />
                          </div>
                          <div className="ml-3">
                            <span className={`text-sm ${(property.certificationProgress || 0) >= 25 ? 'text-[#2E2E2E] font-medium' : 'text-[#7F8C8D]'}`}>Basic Info</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(property.certificationProgress || 0) >= 50 ? 'bg-[#2ECC71]/20' : 'bg-[#EAEAEA]'}`}>
                            <CheckCircle className={`h-3 w-3 ${(property.certificationProgress || 0) >= 50 ? 'text-[#2ECC71]' : 'text-[#C0C0C0]'}`} />
                          </div>
                          <div className="ml-3">
                            <span className={`text-sm ${(property.certificationProgress || 0) >= 50 ? 'text-[#2E2E2E] font-medium' : 'text-[#7F8C8D]'}`}>Safety Standards</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(property.certificationProgress || 0) >= 75 ? 'bg-[#2ECC71]/20' : 'bg-[#EAEAEA]'}`}>
                            <CheckCircle className={`h-3 w-3 ${(property.certificationProgress || 0) >= 75 ? 'text-[#2ECC71]' : 'text-[#C0C0C0]'}`} />
                          </div>
                          <div className="ml-3">
                            <span className={`text-sm ${(property.certificationProgress || 0) >= 75 ? 'text-[#2E2E2E] font-medium' : 'text-[#7F8C8D]'}`}>Amenities Verification</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(property.certificationProgress || 0) >= 100 ? 'bg-[#2ECC71]/20' : 'bg-[#EAEAEA]'}`}>
                            <CheckCircle className={`h-3 w-3 ${(property.certificationProgress || 0) >= 100 ? 'text-[#2ECC71]' : 'text-[#C0C0C0]'}`} />
                          </div>
                          <div className="ml-3">
                            <span className={`text-sm ${(property.certificationProgress || 0) >= 100 ? 'text-[#2E2E2E] font-medium' : 'text-[#7F8C8D]'}`}>Final Inspection</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => startCertification(property.id)}
                        className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium rounded-md"
                      >
                        Continue Certification
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-10 bg-[#FFFFFF] rounded-xl shadow-sm">
                <Info className="h-12 w-12 mx-auto text-[#C0C0C0] mb-2" />
                <p className="text-[#7F8C8D] mb-4">No properties are currently in the certification process.</p>
                <Button variant="outline" asChild className="text-[#2E2E2E] border-[#EAEAEA]">
                  <Link href="#notStarted">View properties to start certification</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="certified" className="space-y-4">
            {certifiedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifiedProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden rounded-xl shadow-sm bg-white border-[#EAEAEA] hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-[#2E2E2E] font-bold">{property.name}</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-[#2ECC71]/20 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-[#2ECC71]" />
                        </div>
                      </div>
                      <CardDescription className="text-[#7F8C8D]">{property.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="p-4 bg-[#2ECC71]/10 rounded-lg mb-4">
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-[#2ECC71] mr-2" />
                          <span className="font-medium text-[#2E2E2E]">Fully Certified</span>
                        </div>
                        <p className="text-sm text-[#7F8C8D] mt-1">
                          This property meets all certification requirements and standards.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline"
                        asChild
                        className="w-full text-[#2E2E2E] border-[#EAEAEA]"
                      >
                        <Link href={`/property-details/${property.id}`}>
                          View Property Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-10 bg-[#FFFFFF] rounded-xl shadow-sm">
                <Award className="h-12 w-12 mx-auto text-[#C0C0C0] mb-2" />
                <p className="text-[#7F8C8D] mb-4">No properties have been certified yet.</p>
                <p className="text-sm text-[#7F8C8D]">
                  Complete the certification process for your properties to achieve certified status.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="notStarted" className="space-y-4" id="notStarted">
            {notStartedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notStartedProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden rounded-xl shadow-sm bg-white border-[#EAEAEA] hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[#2E2E2E] font-bold">{property.name}</CardTitle>
                      <CardDescription className="text-[#7F8C8D]">{property.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="p-4 bg-[#FFF9C4] rounded-lg mb-4">
                        <div className="flex items-center">
                          <Info className="h-5 w-5 text-[#2E2E2E] mr-2" />
                          <span className="font-medium text-[#2E2E2E]">Not Certified</span>
                        </div>
                        <p className="text-sm text-[#7F8C8D] mt-1">
                          Start the certification process to enhance your property's credibility and value.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => startCertification(property.id)}
                        className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium rounded-md"
                      >
                        Start Certification
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-10 bg-[#FFFFFF] rounded-xl shadow-sm">
                <Home className="h-12 w-12 mx-auto text-[#C0C0C0] mb-2" />
                <p className="text-[#7F8C8D] mb-4">You don't have any uncertified properties.</p>
                <Button variant="outline" asChild className="text-[#2E2E2E] border-[#EAEAEA]">
                  <Link href="/add-property">Add a New Property</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Certification Form Dialog */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FAFAFA]">
            <DialogHeader>
              <DialogTitle className="flex items-center text-[#2E2E2E]">
                <Award className="mr-2 h-5 w-5 text-[#2ECC71]" />
                {selectedProperty?.name} - Certification Process
              </DialogTitle>
              <DialogDescription className="text-[#7F8C8D]">
                Complete all required checks in each section to certify this property.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#2E2E2E]">Overall Progress</span>
                <span className="text-sm font-medium text-[#2E2E2E]">{calculateProgressPercentage(certificationForm)}%</span>
              </div>
              <div className="w-full bg-[#EAEAEA] rounded-full h-2">
                <div 
                  className="bg-[#2ECC71] h-2 rounded-full" 
                  style={{ width: `${calculateProgressPercentage(certificationForm)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className={`flex items-center ${activeStep === 'basicInfo' ? 'text-[#2ECC71]' : 'text-[#7F8C8D]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    activeStep === 'basicInfo' ? 'bg-[#2ECC71] text-white' : 
                    getStepProgress('basicInfo') <= calculateProgressPercentage(certificationForm) ? 'bg-[#2ECC71]/20 text-[#2ECC71]' : 'bg-[#EAEAEA] text-[#C0C0C0]'
                  }`}>
                    {getStepProgress('basicInfo') <= calculateProgressPercentage(certificationForm) ? <Check className="h-4 w-4" /> : "1"}
                  </div>
                  <span className="text-sm">Basic Info</span>
                </div>
                <div className={`flex items-center ${activeStep === 'safety' ? 'text-[#2ECC71]' : 'text-[#7F8C8D]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    activeStep === 'safety' ? 'bg-[#2ECC71] text-white' : 
                    getStepProgress('safety') <= calculateProgressPercentage(certificationForm) ? 'bg-[#2ECC71]/20 text-[#2ECC71]' : 'bg-[#EAEAEA] text-[#C0C0C0]'
                  }`}>
                    {getStepProgress('safety') <= calculateProgressPercentage(certificationForm) ? <Check className="h-4 w-4" /> : "2"}
                  </div>
                  <span className="text-sm">Safety</span>
                </div>
                <div className={`flex items-center ${activeStep === 'amenities' ? 'text-[#2ECC71]' : 'text-[#7F8C8D]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    activeStep === 'amenities' ? 'bg-[#2ECC71] text-white' : 
                    getStepProgress('amenities') <= calculateProgressPercentage(certificationForm) ? 'bg-[#2ECC71]/20 text-[#2ECC71]' : 'bg-[#EAEAEA] text-[#C0C0C0]'
                  }`}>
                    {getStepProgress('amenities') <= calculateProgressPercentage(certificationForm) ? <Check className="h-4 w-4" /> : "3"}
                  </div>
                  <span className="text-sm">Amenities</span>
                </div>
                <div className={`flex items-center ${activeStep === 'finalInspection' ? 'text-[#2ECC71]' : 'text-[#7F8C8D]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    activeStep === 'finalInspection' ? 'bg-[#2ECC71] text-white' : 
                    getStepProgress('finalInspection') <= calculateProgressPercentage(certificationForm) ? 'bg-[#2ECC71]/20 text-[#2ECC71]' : 'bg-[#EAEAEA] text-[#C0C0C0]'
                  }`}>
                    {getStepProgress('finalInspection') <= calculateProgressPercentage(certificationForm) ? <Check className="h-4 w-4" /> : "4"}
                  </div>
                  <span className="text-sm">Final</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Basic Info Step */}
            {activeStep === 'basicInfo' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center text-[#2E2E2E]">
                  <Info className="h-5 w-5 mr-2 text-[#2ECC71]" />
                  Basic Information Verification
                </h3>
                <p className="text-sm text-[#7F8C8D] mb-4">
                  Confirm that all basic property information is accurate and complete.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasAccurateAddressInfo" 
                      checked={certificationForm.hasAccurateAddressInfo}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasAccurateAddressInfo', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasAccurateAddressInfo" className="font-medium text-[#2E2E2E]">
                        Accurate Address Information
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Full address including unit number and postal code is verified and correct
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasAccuratePropertyType" 
                      checked={certificationForm.hasAccuratePropertyType}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasAccuratePropertyType', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasAccuratePropertyType" className="font-medium text-[#2E2E2E]">
                        Correct Property Type
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Property is correctly categorized (apartment, house, condo, villa, etc.)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasAccurateOwnershipDocs" 
                      checked={certificationForm.hasAccurateOwnershipDocs}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasAccurateOwnershipDocs', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasAccurateOwnershipDocs" className="font-medium text-[#2E2E2E]">
                        Ownership Documentation
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Proper ownership or rental agreement documentation has been provided
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Safety Standards Step */}
            {activeStep === 'safety' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center text-[#2E2E2E]">
                  <ShieldCheck className="h-5 w-5 mr-2 text-[#2ECC71]" />
                  Safety Standards
                </h3>
                <p className="text-sm text-[#7F8C8D] mb-4">
                  Verify that the property meets all safety requirements and regulations.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasSmokeDetectors" 
                      checked={certificationForm.hasSmokeDetectors}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasSmokeDetectors', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasSmokeDetectors" className="font-medium text-[#2E2E2E]">
                        Smoke Detectors
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Working smoke detectors installed in all required areas
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasFireExtinguisher" 
                      checked={certificationForm.hasFireExtinguisher}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasFireExtinguisher', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasFireExtinguisher" className="font-medium text-[#2E2E2E]">
                        Fire Extinguisher
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Accessible and properly maintained fire extinguisher available
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasEmergencyExits" 
                      checked={certificationForm.hasEmergencyExits}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasEmergencyExits', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasEmergencyExits" className="font-medium text-[#2E2E2E]">
                        Emergency Exits
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Clear and unobstructed emergency exits identified
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasFirstAidKit" 
                      checked={certificationForm.hasFirstAidKit}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasFirstAidKit', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasFirstAidKit" className="font-medium text-[#2E2E2E]">
                        First Aid Kit
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Stocked first aid kit available for guest emergencies
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Amenities Verification Step */}
            {activeStep === 'amenities' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center text-[#2E2E2E]">
                  <Home className="h-5 w-5 mr-2 text-[#2ECC71]" />
                  Amenities Verification
                </h3>
                <p className="text-sm text-[#7F8C8D] mb-4">
                  Confirm that all listed amenities are present and in good working condition.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasVerifiedBedrooms" 
                      checked={certificationForm.hasVerifiedBedrooms}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasVerifiedBedrooms', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasVerifiedBedrooms" className="font-medium text-[#2E2E2E]">
                        Bedrooms Verified
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Bedroom count and bed sizes are accurate in listing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasVerifiedBathrooms" 
                      checked={certificationForm.hasVerifiedBathrooms}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasVerifiedBathrooms', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasVerifiedBathrooms" className="font-medium text-[#2E2E2E]">
                        Bathrooms Verified
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Bathroom count and facilities are accurately described
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasVerifiedKitchenAppliances" 
                      checked={certificationForm.hasVerifiedKitchenAppliances}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasVerifiedKitchenAppliances', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasVerifiedKitchenAppliances" className="font-medium text-[#2E2E2E]">
                        Kitchen Appliances
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        All kitchen appliances are present and in working order
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasVerifiedInternetAccess" 
                      checked={certificationForm.hasVerifiedInternetAccess}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasVerifiedInternetAccess', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasVerifiedInternetAccess" className="font-medium text-[#2E2E2E]">
                        Internet Access
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Internet connectivity is available and speed is as advertised
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Final Inspection Step */}
            {activeStep === 'finalInspection' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center text-[#2E2E2E]">
                  <Award className="h-5 w-5 mr-2 text-[#2ECC71]" />
                  Final Inspection & Approval
                </h3>
                <p className="text-sm text-[#7F8C8D] mb-4">
                  Complete the final verification and approval process for certification.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasPassedOnSiteInspection" 
                      checked={certificationForm.hasPassedOnSiteInspection}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasPassedOnSiteInspection', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasPassedOnSiteInspection" className="font-medium text-[#2E2E2E]">
                        On-Site Inspection
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        Property has been physically inspected by Argento Homes representative
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="hasCompletedAllRequirements" 
                      checked={certificationForm.hasCompletedAllRequirements}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleFormChange('hasCompletedAllRequirements', checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="hasCompletedAllRequirements" className="font-medium text-[#2E2E2E]">
                        All Requirements Completed
                      </Label>
                      <p className="text-sm text-[#7F8C8D]">
                        All required certification steps have been completed and verified
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#2ECC71]/10 rounded-lg">
                    <p className="text-sm text-[#2E2E2E] font-medium">
                      By completing this final step, your property will be marked as fully certified. 
                      Certified properties gain increased visibility and trust from potential guests.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter className="flex items-center justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={activeStep === 'basicInfo'}
                className="text-[#2E2E2E] border-[#EAEAEA]"
              >
                Back
              </Button>
              
              <Button 
                onClick={handleNextStep}
                disabled={updatePropertyMutation.isPending}
                className="bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium rounded-md"
              >
                {activeStep === 'finalInspection' ? 'Complete Certification' : 'Next Step'}
                {updatePropertyMutation.isPending && (
                  <span className="ml-2 animate-spin">⟳</span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}