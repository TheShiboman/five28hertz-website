import React, { useState } from 'react';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, UserCheck, Shield, BarChart, Briefcase, CheckSquare, Home,
  AlertTriangle, LineChart, Activity, DollarSign, Loader2,
  Clock, CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ApprovalStatusBadge } from '@/components/ui/approval-status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Vendor, Property, User, ApprovalStatus } from '@shared/schema';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Define extended vendor type to include user details
interface VendorWithDetails extends Omit<Vendor, 'businessName'> {
  fullName?: string;
  email?: string;
  businessName?: string;
}

// Define extended property type to include user details
interface PropertyWithDetails extends Property {
  ownerName?: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // State for approval/rejection notes
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<VendorWithDetails | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithDetails | null>(null);
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [entityType, setEntityType] = useState<'vendor' | 'property'>('vendor');
  
  // Query for getting pending vendors
  const { data: pendingVendors, isLoading: isLoadingPendingVendors } = useQuery<VendorWithDetails[]>({
    queryKey: ['/api/admin/vendors/pending'],
    enabled: user?.role === 'developer' || user?.role === 'admin',
  });
  
  // Query for getting all vendors
  const { data: allVendors, isLoading: isLoadingAllVendors } = useQuery<VendorWithDetails[]>({
    queryKey: ['/api/vendors'],
    enabled: user?.role === 'developer' || user?.role === 'admin',
  });
  
  // Query for getting pending properties
  const { data: pendingProperties, isLoading: isLoadingPendingProperties } = useQuery<PropertyWithDetails[]>({
    queryKey: ['/api/admin/properties/pending'],
    enabled: user?.role === 'developer' || user?.role === 'admin',
  });
  
  // Query for getting all properties
  const { data: allProperties, isLoading: isLoadingAllProperties } = useQuery<PropertyWithDetails[]>({
    queryKey: ['/api/properties'],
    enabled: user?.role === 'developer' || user?.role === 'admin',
  });
  
  // Query for getting all users
  const { data: allUsers, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: user?.role === 'developer' || user?.role === 'admin',
  });
  
  // Platform stats - could come from an API call in the future
  const { data: platformStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: user?.role === 'developer' || user?.role === 'admin',
    placeholderData: {
      totalUsers: allUsers?.length || 0,
      totalProperties: 0, // This would be calculated from actual data
      totalVendors: 0, // This would be calculated from actual data
      totalBookings: 0,
      activeBookings: 0,
      monthlyRevenue: 28750,
      growthRate: 12.5
    }
  });
  
  // Mutation for approving vendors
  const approveVendorMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const res = await apiRequest('PUT', `/api/admin/vendors/${id}/approve`, { adminNotes: notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vendors/pending'] });
      toast({
        title: "Vendor Approved",
        description: `Vendor has been approved successfully.`,
      });
      setIsVendorDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for rejecting vendors
  const rejectVendorMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const res = await apiRequest('PUT', `/api/admin/vendors/${id}/reject`, { adminNotes: notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vendors/pending'] });
      toast({
        title: "Vendor Rejected",
        description: `Vendor has been rejected.`,
      });
      setIsVendorDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for approving properties
  const approvePropertyMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const res = await apiRequest('PUT', `/api/admin/properties/${id}/approve`, { adminNotes: notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties/pending'] });
      toast({
        title: "Property Approved",
        description: `Property has been approved successfully.`,
      });
      setIsPropertyDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for rejecting properties
  const rejectPropertyMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const res = await apiRequest('PUT', `/api/admin/properties/${id}/reject`, { adminNotes: notes });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties/pending'] });
      toast({
        title: "Property Rejected",
        description: `Property has been rejected.`,
      });
      setIsPropertyDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Helper function to open the vendor approval dialog
  const openVendorApprovalDialog = (vendor: VendorWithDetails, action: 'approve' | 'reject') => {
    setSelectedVendor(vendor);
    setApprovalAction(action);
    setEntityType('vendor');
    setAdminNotes('');
    setIsVendorDialogOpen(true);
  };
  
  // Helper function to open the property approval dialog
  const openPropertyApprovalDialog = (property: PropertyWithDetails, action: 'approve' | 'reject') => {
    setSelectedProperty(property);
    setApprovalAction(action);
    setEntityType('property');
    setAdminNotes('');
    setIsPropertyDialogOpen(true);
  };
  
  // Submit approval/rejection
  const handleSubmitApproval = () => {
    if (entityType === 'vendor' && selectedVendor) {
      if (approvalAction === 'approve') {
        approveVendorMutation.mutate({ id: selectedVendor.id, notes: adminNotes });
      } else {
        rejectVendorMutation.mutate({ id: selectedVendor.id, notes: adminNotes });
      }
    } else if (entityType === 'property' && selectedProperty) {
      if (approvalAction === 'approve') {
        approvePropertyMutation.mutate({ id: selectedProperty.id, notes: adminNotes });
      } else {
        rejectPropertyMutation.mutate({ id: selectedProperty.id, notes: adminNotes });
      }
    }
  };
  
  const handleSuspendUser = (id: number) => {
    toast({
      title: "User Suspended",
      description: `User #${id} has been suspended.`,
    });
  };
  
  // Calculate platform stats from the data
  const calculatedStats = {
    totalUsers: allUsers?.length || 0,
    totalProperties: pendingProperties?.length || 0,
    totalVendors: pendingVendors?.length || 0,
    totalBookings: 0,
    activeBookings: 0,
    monthlyRevenue: 28750,
    growthRate: 12.5
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, vendors, and monitor platform performance.
            </p>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Vendors</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              <span>Statistics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View and manage all registered users on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingUsers ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : allUsers && allUsers.length > 0 ? (
                      allUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.fullName || user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.role.toLowerCase() === "vendor" ? "outline" : "default"}
                              className={user.role.toLowerCase() === "vendor" 
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200" 
                                : user.role.toLowerCase() === "developer" 
                                  ? "bg-violet-100 text-violet-800 hover:bg-violet-200"
                                  : ""}
                            >
                              {user.role.toLowerCase() === "property_owner" 
                                ? "Property Owner" 
                                : user.role.toLowerCase() === "vendor" 
                                  ? "Vendor" 
                                  : user.role.toLowerCase() === "developer"
                                    ? "Admin"
                                    : user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 hover:bg-green-200"
                            >
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSuspendUser(user.id)}
                              >
                                Suspend
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <p className="text-muted-foreground">No users found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Total registered users: {calculatedStats.totalUsers}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Vendor Management
                </CardTitle>
                <CardDescription>
                  Review, approve, and manage vendor applications on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="mt-2">
                  <TabsList className="mb-4 w-full grid grid-cols-3">
                    <TabsTrigger value="pending" className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Pending ({pendingVendors?.length || 0})</span>
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Approved</span>
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>All Vendors</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Pending Vendors Tab */}
                  <TabsContent value="pending">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Vendor Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingPendingVendors ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : pendingVendors && pendingVendors.length > 0 ? (
                          pendingVendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                              <TableCell>{vendor.id}</TableCell>
                              <TableCell>{vendor.businessName || "Unnamed Vendor"}</TableCell>
                              <TableCell>{vendor.category}</TableCell>
                              <TableCell>
                                <ApprovalStatusBadge status={vendor.approvalStatus || ApprovalStatus.PENDING} />
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-green-50 hover:bg-green-100 text-green-700"
                                    onClick={() => openVendorApprovalDialog(vendor, 'approve')}
                                  >
                                    <CheckSquare className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-red-50 hover:bg-red-100 text-red-700"
                                    onClick={() => openVendorApprovalDialog(vendor, 'reject')}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              <p className="text-muted-foreground">No vendors pending approval</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  {/* Approved Vendors Tab */}
                  <TabsContent value="approved">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Vendor Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingAllVendors ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : (
                          allVendors?.filter(v => v.approvalStatus === "APPROVED").map((vendor) => (
                            <TableRow key={vendor.id}>
                              <TableCell>{vendor.id}</TableCell>
                              <TableCell>{vendor.businessName || "Unnamed Vendor"}</TableCell>
                              <TableCell>{vendor.category}</TableCell>
                              <TableCell>
                                <ApprovalStatusBadge status={vendor.approvalStatus || ApprovalStatus.APPROVED} />
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setLocation(`/vendor-profile/${vendor.id}`)}
                                  >
                                    View Profile
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-red-50 hover:bg-red-100 text-red-700"
                                    onClick={() => openVendorApprovalDialog(vendor, 'reject')}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                        {!isLoadingAllVendors && 
                          (!allVendors || allVendors.filter(v => v.approvalStatus === "APPROVED").length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              <p className="text-muted-foreground">No approved vendors found</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  {/* All Vendors Tab */}
                  <TabsContent value="all">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-muted-foreground">
                        Total vendors: {allVendors?.length || 0}
                      </p>
                      <Button variant="outline" onClick={() => setLocation('/marketplace')}>
                        View Marketplace
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Vendor Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingAllVendors ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : allVendors && allVendors.length > 0 ? (
                          allVendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                              <TableCell>{vendor.id}</TableCell>
                              <TableCell>{vendor.businessName || "Unnamed Vendor"}</TableCell>
                              <TableCell>{vendor.category}</TableCell>
                              <TableCell>
                                <ApprovalStatusBadge status={vendor.approvalStatus || ApprovalStatus.PENDING} />
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  {vendor.approvalStatus === "PENDING" ? (
                                    <>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="bg-green-50 hover:bg-green-100 text-green-700"
                                        onClick={() => openVendorApprovalDialog(vendor, 'approve')}
                                      >
                                        <CheckSquare className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="bg-red-50 hover:bg-red-100 text-red-700"
                                        onClick={() => openVendorApprovalDialog(vendor, 'reject')}
                                      >
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setLocation(`/vendor-profile/${vendor.id}`)}
                                    >
                                      View Profile
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              <p className="text-muted-foreground">No vendors found</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  Property Management
                </CardTitle>
                <CardDescription>
                  Review, approve, and manage property listings on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="mt-2">
                  <TabsList className="mb-4 w-full grid grid-cols-3">
                    <TabsTrigger value="pending" className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Pending ({pendingProperties?.length || 0})</span>
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Approved</span>
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      <span>All Properties</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Pending Properties Tab */}
                  <TabsContent value="pending">
                    {isLoadingPendingProperties ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : pendingProperties && pendingProperties.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Property Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingProperties.map((property) => (
                            <TableRow key={property.id}>
                              <TableCell>{property.id}</TableCell>
                              <TableCell>{property.name}</TableCell>
                              <TableCell>{property.location}</TableCell>
                              <TableCell>{property.ownerName || `User #${property.userId}`}</TableCell>
                              <TableCell>
                                <ApprovalStatusBadge status={property.approvalStatus || ApprovalStatus.PENDING} />
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-green-50 hover:bg-green-100 text-green-700"
                                    onClick={() => openPropertyApprovalDialog(property, 'approve')}
                                  >
                                    <CheckSquare className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-red-50 hover:bg-red-100 text-red-700"
                                    onClick={() => openPropertyApprovalDialog(property, 'reject')}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <Home className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No properties pending approval</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Approved Properties Tab */}
                  <TabsContent value="approved">
                    {isLoadingAllProperties ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Property Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allProperties?.filter(p => p.approvalStatus === "APPROVED").map((property) => (
                            <TableRow key={property.id}>
                              <TableCell>{property.id}</TableCell>
                              <TableCell>{property.name}</TableCell>
                              <TableCell>{property.location}</TableCell>
                              <TableCell>{property.ownerName || `User #${property.userId}`}</TableCell>
                              <TableCell>
                                <ApprovalStatusBadge status={property.approvalStatus || ApprovalStatus.APPROVED} />
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setLocation(`/property-details/${property.id}`)}
                                  >
                                    View Details
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-red-50 hover:bg-red-100 text-red-700"
                                    onClick={() => openPropertyApprovalDialog(property, 'reject')}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {!isLoadingAllProperties && 
                            (!allProperties || allProperties.filter(p => p.approvalStatus === "APPROVED").length === 0) && (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                <p className="text-muted-foreground">No approved properties found</p>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                  
                  {/* All Properties Tab */}
                  <TabsContent value="all">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-muted-foreground">
                        Total properties: {allProperties?.length || 0}
                      </p>
                      <Button variant="outline" onClick={() => setLocation('/properties')}>
                        View All Properties
                      </Button>
                    </div>
                    {isLoadingAllProperties ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : allProperties && allProperties.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Property Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allProperties.map((property) => (
                            <TableRow key={property.id}>
                              <TableCell>{property.id}</TableCell>
                              <TableCell>{property.name}</TableCell>
                              <TableCell>{property.location}</TableCell>
                              <TableCell>{property.ownerName || `User #${property.userId}`}</TableCell>
                              <TableCell>
                                <ApprovalStatusBadge status={property.approvalStatus || ApprovalStatus.PENDING} />
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  {property.approvalStatus === "PENDING" ? (
                                    <>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="bg-green-50 hover:bg-green-100 text-green-700"
                                        onClick={() => openPropertyApprovalDialog(property, 'approve')}
                                      >
                                        <CheckSquare className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="bg-red-50 hover:bg-red-100 text-red-700"
                                        onClick={() => openPropertyApprovalDialog(property, 'reject')}
                                      >
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setLocation(`/property-details/${property.id}`)}
                                    >
                                      View Details
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <Home className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No properties found</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Platform Overview
                  </CardTitle>
                  <CardDescription>
                    Key metrics and statistics for the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{calculatedStats.totalUsers}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                      <p className="text-2xl font-bold">{calculatedStats.totalProperties}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
                      <p className="text-2xl font-bold">{calculatedStats.totalVendors}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{calculatedStats.totalBookings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Platform Activity
                  </CardTitle>
                  <CardDescription>
                    Current active usage statistics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                      <p className="text-2xl font-bold">{calculatedStats.activeBookings}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                      <p className="text-2xl font-bold text-green-600">+{calculatedStats.growthRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Revenue Overview
                  </CardTitle>
                  <CardDescription>
                    Financial performance metrics for the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-6">
                    <div className="text-center">
                      <p className="text-lg text-muted-foreground mb-2">Monthly Revenue</p>
                      <p className="text-4xl font-bold text-green-600">${calculatedStats.monthlyRevenue.toLocaleString()}</p>
                      <div className="flex items-center justify-center mt-4">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <LineChart className="h-3 w-3 mr-1" />
                          +{calculatedStats.growthRate}% from last month
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Vendor Approval Dialog */}
      <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve Vendor' : 'Reject Vendor'} 
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve' 
                ? 'Add any notes or comments for this vendor before approving their application.' 
                : 'Please provide a reason for rejecting this vendor application.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Vendor</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedVendor?.businessName || selectedVendor?.fullName || "Unnamed Vendor"} ({selectedVendor?.category})
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  {approvalAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
                </label>
                <Textarea
                  id="notes"
                  placeholder={approvalAction === 'approve' 
                    ? "Add any notes for the vendor..." 
                    : "Please explain why this vendor is being rejected..."}
                  className="min-h-[100px]"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVendorDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApproval}
              className={approvalAction === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'}
              disabled={approveVendorMutation.isPending || rejectVendorMutation.isPending}
            >
              {(approveVendorMutation.isPending || rejectVendorMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {approvalAction === 'approve' ? 'Approve Vendor' : 'Reject Vendor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Property Approval Dialog */}
      <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve Property' : 'Reject Property'} 
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve' 
                ? 'Add any notes or comments for this property before approving it.' 
                : 'Please provide a reason for rejecting this property.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Property</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProperty?.name} at {selectedProperty?.location}
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  {approvalAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
                </label>
                <Textarea
                  id="notes"
                  placeholder={approvalAction === 'approve' 
                    ? "Add any notes for the property owner..." 
                    : "Please explain why this property is being rejected..."}
                  className="min-h-[100px]"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPropertyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApproval}
              className={approvalAction === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'}
              disabled={approvePropertyMutation.isPending || rejectPropertyMutation.isPending}
            >
              {(approvePropertyMutation.isPending || rejectPropertyMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {approvalAction === 'approve' ? 'Approve Property' : 'Reject Property'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
};

export default AdminPanel;