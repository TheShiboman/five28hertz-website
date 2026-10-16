import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { insertVendorSchema, InsertVendor, Vendor } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ApprovalStatusBadge } from '@/components/ui/approval-status-badge';
import { 
  Building2, 
  Award,
  Upload, 
  FileText,
  CheckCircle2, 
  ClipboardList,
  AlertCircle 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define vendor service categories
const vendorCategories = [
  { id: 'cleaning', name: 'Cleaning Services' },
  { id: 'maintenance', name: 'Maintenance & Repairs' },
  { id: 'smart_home', name: 'Smart Home Installation' },
  { id: 'interior_design', name: 'Interior Design' },
  { id: 'property_management', name: 'Property Management' },
  { id: 'landscape', name: 'Landscaping & Gardening' },
  { id: 'security', name: 'Security Systems' },
  { id: 'plumbing', name: 'Plumbing Services' },
  { id: 'electrical', name: 'Electrical Services' },
  { id: 'photography', name: 'Property Photography' },
];

// Extended vendor form schema with additional fields for registration
const vendorRegistrationSchema = insertVendorSchema.extend({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL.",
  }).optional().or(z.literal('')),
  businessAddress: z.string().min(5, {
    message: "Please enter your business address.",
  }),
  yearsInBusiness: z.string().min(1, {
    message: "Please specify your experience.",
  }),
  licenses: z.string().optional(),
  certifications: z.string().optional(),
  insuranceInfo: z.string().optional(),
  serviceDescription: z.string().min(20, {
    message: "Please provide more details about your services.",
  }),
  serviceAreas: z.string().min(2, {
    message: "Please specify your service areas.",
  }),
});

// Remove fields that aren't stored in the database
const toVendorData = (formData: z.infer<typeof vendorRegistrationSchema>): InsertVendor => {
  return {
    userId: formData.userId,
    businessName: formData.businessName,
    category: formData.category,
    description: formData.description,
    // Other fields will be stored in the user profile or as JSON in the description field
  };
};

type VendorRegistrationValues = z.infer<typeof vendorRegistrationSchema>;

const VendorRegistrationPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Check if user already has a vendor profile
  const { 
    data: vendorProfile, 
    isLoading: isLoadingVendor 
  } = useQuery<Vendor>({
    queryKey: ['/api/vendors/profile'],
    enabled: !!user
  });

  // Form for vendor registration
  const form = useForm<VendorRegistrationValues>({
    resolver: zodResolver(vendorRegistrationSchema),
    defaultValues: {
      userId: user?.id,
      businessName: '',
      category: '',
      description: '',
      contactEmail: user?.email || '',
      phoneNumber: user?.phone || '',
      website: '',
      businessAddress: '',
      yearsInBusiness: '',
      licenses: '',
      certifications: '',
      insuranceInfo: '',
      serviceDescription: '',
      serviceAreas: '',
    },
  });

  // Mutation for submitting vendor application
  const submitVendorMutation = useMutation({
    mutationFn: async (data: InsertVendor) => {
      const res = await apiRequest('POST', '/api/vendors', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendors/profile'] });
      toast({
        title: "Application Submitted",
        description: "Your vendor application has been submitted successfully and is pending review.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: VendorRegistrationValues) => {
    if (currentStep < totalSteps) {
      // Move to next step if not on the last step
      setCurrentStep(currentStep + 1);
      return;
    }

    // On final step, submit the form
    const vendorData = toVendorData(values);
    submitVendorMutation.mutate(vendorData);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render different form sections based on current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-6">
              <Building2 className="mr-2 h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Business Information</h3>
            </div>

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input className="input-brand" placeholder="Your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendorCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearsInBusiness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years in Business</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of your business" 
                      className="min-h-[100px] input-brand"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-6">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Contact Information</h3>
            </div>

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="input-brand" placeholder="contact@yourbusiness.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Phone</FormLabel>
                  <FormControl>
                    <Input className="input-brand" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input className="input-brand" placeholder="https://yourbusiness.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Full business address" 
                      className="input-brand"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-6">
              <Award className="mr-2 h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Credentials & Certifications</h3>
            </div>

            <FormField
              control={form.control}
              name="licenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Licenses & Permits</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any relevant business licenses, permits, or registrations" 
                      className="min-h-[100px] input-brand"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include license numbers and expiration dates.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Certifications</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any relevant professional certifications or qualifications" 
                      className="min-h-[100px] input-brand"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your business insurance coverage (liability, workers' comp, etc.)" 
                      className="min-h-[100px] input-brand"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <div className="flex items-center mb-2">
                <Upload className="mr-2 h-5 w-5 text-blue-500" />
                <h4 className="font-medium">Upload Documents (Coming Soon)</h4>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Document upload functionality will be available soon. For now, please list your credentials above.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-6">
              <ClipboardList className="mr-2 h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Service Details</h3>
            </div>

            <FormField
              control={form.control}
              name="serviceDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed description of the services you provide" 
                      className="min-h-[150px] input-brand"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include information about your expertise, specialties, and what makes your services unique.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Areas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List the geographic areas where you provide services" 
                      className="min-h-[100px] input-brand"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include neighborhoods, cities, or regions you serve.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Final Review</AlertTitle>
              <AlertDescription>
                Please review all information before submitting. By submitting, you confirm that all information provided is accurate. Your application will be reviewed by our team.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  // Show registration status for existing vendors
  if (vendorProfile) {
    return (
      <SidebarLayout>
        <div className="container mx-auto py-8 max-w-4xl">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-2xl">Vendor Registration Status</CardTitle>
              <CardDescription>
                Your vendor application details and current status
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-medium">{vendorProfile.businessName}</h3>
                    <p className="text-gray-500 mt-1">
                      {vendorCategories.find(c => c.id === vendorProfile.category)?.name || vendorProfile.category}
                    </p>
                  </div>
                  <ApprovalStatusBadge status={vendorProfile.approvalStatus?.toLowerCase() || 'pending'} />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Application Status</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Application Progress</span>
                      <span className="font-medium">
                        {(vendorProfile.approvalStatus?.toLowerCase() === 'approved') 
                          ? '100%' 
                          : (vendorProfile.approvalStatus?.toLowerCase() === 'rejected')
                            ? 'Rejected' 
                            : 'Under Review'}
                      </span>
                    </div>
                    <Progress 
                      value={
                        (vendorProfile.approvalStatus?.toLowerCase() === 'approved')
                          ? 100 
                          : (vendorProfile.approvalStatus?.toLowerCase() === 'rejected')
                            ? 100
                            : 66
                      } 
                      className={`h-2 ${
                        (vendorProfile.approvalStatus?.toLowerCase() === 'approved')
                          ? 'bg-green-100' 
                          : (vendorProfile.approvalStatus?.toLowerCase() === 'rejected')
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                      }`}
                    />
                  </div>

                  {(vendorProfile.approvalStatus?.toLowerCase() === 'pending' || !vendorProfile.approvalStatus) && (
                    <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Application Under Review</AlertTitle>
                      <AlertDescription>
                        Your application is currently being reviewed by our team. This process typically takes 2-3 business days.
                      </AlertDescription>
                    </Alert>
                  )}

                  {vendorProfile.approvalStatus?.toLowerCase() === 'approved' && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Application Approved</AlertTitle>
                      <AlertDescription>
                        Congratulations! Your vendor application has been approved. You can now access the vendor dashboard and start receiving task assignments.
                      </AlertDescription>
                    </Alert>
                  )}

                  {vendorProfile.approvalStatus?.toLowerCase() === 'rejected' && (
                    <Alert className="bg-red-50 text-red-800 border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Application Not Approved</AlertTitle>
                      <AlertDescription>
                        Unfortunately, your application was not approved at this time. Please review the feedback below and consider reapplying.
                      </AlertDescription>
                    </Alert>
                  )}

                  {vendorProfile.adminNotes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">Feedback from Reviewer</h4>
                      <p className="text-gray-700">{vendorProfile.adminNotes}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Your Business Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">Business Name</h5>
                      <p>{vendorProfile.businessName}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">Category</h5>
                      <p>{vendorCategories.find(c => c.id === vendorProfile.category)?.name || vendorProfile.category}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h5 className="text-sm font-medium text-gray-500">Description</h5>
                      <p>{vendorProfile.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/dashboard'}
              >
                Return to Dashboard
              </Button>
              
              {vendorProfile.approvalStatus?.toLowerCase() === 'rejected' && (
                <Button 
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    // Would implement reapplication logic here
                    toast({
                      title: "Reapplication",
                      description: "Reapplication feature coming soon.",
                    });
                  }}
                >
                  Reapply
                </Button>
              )}
              
              {vendorProfile.approvalStatus?.toLowerCase() === 'approved' && (
                <Button 
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => window.location.href = '/marketplace'}
                >
                  Go to Marketplace
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-2xl">Vendor Registration</CardTitle>
            <CardDescription>
              Register your business as a vendor to offer services to property owners
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Registration Progress</span>
                <span className="text-sm font-medium">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
              
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</span>
                <span className="text-xs text-gray-500">
                  {currentStep === 1 ? 'Business Information' : 
                   currentStep === 2 ? 'Contact Details' : 
                   currentStep === 3 ? 'Credentials' : 
                   'Service Details'}
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderFormStep()}

                <div className="flex justify-between pt-4 mt-8">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousStep}
                    >
                      Previous
                    </Button>
                  ) : (
                    <div></div> 
                  )}
                  
                  <Button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={submitVendorMutation.isPending}
                  >
                    {submitVendorMutation.isPending ? 'Submitting...' : 
                     currentStep < totalSteps ? 'Next' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default VendorRegistrationPage;