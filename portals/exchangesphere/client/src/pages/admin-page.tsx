import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DisputedExchange, BadgeApproval, Exchange, User } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { formatDate } from "@/lib/utils";
import { AchievementBadge } from "@/components/achievement-badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, CheckCircle2, HelpCircle, Shield, User as UserIcon, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImpactAnalytics } from "@/components/admin/impact-analytics";

// Form schemas
const disputeResolveSchema = z.object({
  status: z.enum(["pending", "resolved"]),
  adminNotes: z.string().min(1, "Admin notes are required"),
});

const badgeApprovalSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  adminNotes: z.string().min(1, "Admin notes are required"),
});

type DisputeResolveValues = z.infer<typeof disputeResolveSchema>;
type BadgeApprovalValues = z.infer<typeof badgeApprovalSchema>;

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(null);
  const [selectedBadgeApprovalId, setSelectedBadgeApprovalId] = useState<number | null>(null);
  
  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    setLocation('/');
    return null;
  }
  
  // Fetch disputed exchanges
  const { 
    data: disputes,
    isLoading: isLoadingDisputes,
    error: disputesError 
  } = useQuery<DisputedExchange[]>({
    queryKey: ['/api/admin/disputed-exchanges'],
    enabled: !!user && user.role === 'admin',
  });
  
  // Fetch badge approvals
  const { 
    data: badgeApprovals,
    isLoading: isLoadingBadgeApprovals,
    error: badgeApprovalsError 
  } = useQuery<BadgeApproval[]>({
    queryKey: ['/api/admin/badge-approvals'],
    enabled: !!user && user.role === 'admin',
  });
  
  // Fetch users (for badge approvals)
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    },
    enabled: !!user && user.role === 'admin',
  });
  
  // Fetch exchanges (for disputed exchanges)
  const { data: exchanges, isLoading: isLoadingExchanges } = useQuery<Exchange[]>({
    queryKey: ['/api/exchanges/all'],
    enabled: !!user && user.role === 'admin',
  });
  
  // Get a specific disputed exchange
  const selectedDispute = disputes?.find(d => d.id === selectedDisputeId) || null;
  const disputeExchange = selectedDispute 
    ? exchanges?.find(e => e.id === selectedDispute.exchangeId) 
    : null;
  
  // Get a specific badge approval
  const selectedBadgeApproval = badgeApprovals?.find(a => a.id === selectedBadgeApprovalId) || null;
  const badgeApprovalUser = selectedBadgeApproval 
    ? users?.find(u => u.id === selectedBadgeApproval.userId)
    : null;
  
  // Update disputed exchange mutation
  const { 
    mutate: resolveDispute,
    isPending: isResolvingDispute 
  } = useMutation({
    mutationFn: async (data: { id: number, updates: Partial<DisputedExchange> }) => {
      const res = await apiRequest('PATCH', `/api/admin/disputed-exchanges/${data.id}`, data.updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/disputed-exchanges'] });
      toast({
        title: "Dispute updated",
        description: "The dispute status has been updated successfully",
      });
      setSelectedDisputeId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update dispute",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update badge approval mutation
  const { 
    mutate: updateBadgeApproval,
    isPending: isUpdatingBadgeApproval 
  } = useMutation({
    mutationFn: async (data: { id: number, updates: Partial<BadgeApproval> }) => {
      const res = await apiRequest('PATCH', `/api/admin/badge-approvals/${data.id}`, data.updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/badge-approvals'] });
      toast({
        title: "Badge approval updated",
        description: "The badge approval status has been updated successfully",
      });
      setSelectedBadgeApprovalId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update badge approval",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Dispute resolution form
  const disputeForm = useForm<DisputeResolveValues>({
    resolver: zodResolver(disputeResolveSchema),
    defaultValues: {
      status: (selectedDispute?.status as "pending" | "resolved") || "pending",
      adminNotes: selectedDispute?.adminNotes || "",
    },
  });
  
  // Badge approval form
  const badgeApprovalForm = useForm<BadgeApprovalValues>({
    resolver: zodResolver(badgeApprovalSchema),
    defaultValues: {
      status: (selectedBadgeApproval?.status as "pending" | "approved" | "rejected") || "pending",
      adminNotes: selectedBadgeApproval?.adminNotes || "",
    },
  });
  
  // Handle dispute resolution form submission
  const onDisputeSubmit = (data: DisputeResolveValues) => {
    if (!selectedDisputeId) return;
    resolveDispute({
      id: selectedDisputeId,
      updates: data,
    });
  };
  
  // Handle badge approval form submission
  const onBadgeApprovalSubmit = (data: BadgeApprovalValues) => {
    if (!selectedBadgeApprovalId) return;
    updateBadgeApproval({
      id: selectedBadgeApprovalId,
      updates: data,
    });
  };
  
  // Reset form when dispute changes
  React.useEffect(() => {
    if (selectedDispute) {
      disputeForm.reset({
        status: selectedDispute.status as "pending" | "resolved",
        adminNotes: selectedDispute.adminNotes || "",
      });
    }
  }, [selectedDispute, disputeForm]);
  
  // Reset form when badge approval changes
  React.useEffect(() => {
    if (selectedBadgeApproval) {
      badgeApprovalForm.reset({
        status: selectedBadgeApproval.status as "pending" | "approved" | "rejected",
        adminNotes: selectedBadgeApproval.adminNotes || "",
      });
    }
  }, [selectedBadgeApproval, badgeApprovalForm]);
  
  const isLoading = isLoadingDisputes || isLoadingBadgeApprovals || isLoadingUsers || isLoadingExchanges;
  
  if (!user) return null;
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs defaultValue="disputes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="disputes" className="text-lg py-3">
            <AlertCircle className="h-5 w-5 mr-2" />
            Dispute Resolution
          </TabsTrigger>
          <TabsTrigger value="badges" className="text-lg py-3">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Badge Approvals
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-lg py-3">
            <HelpCircle className="h-5 w-5 mr-2" />
            Impact Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="disputes" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                  Disputed Exchanges
                </CardTitle>
                <CardDescription>
                  Review and resolve user reported disputes for exchanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingDisputes ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : disputesError ? (
                  <div className="text-center p-8 text-destructive">
                    Error loading disputes. Please try again.
                  </div>
                ) : disputes?.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No disputed exchanges found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {disputes?.map(dispute => {
                      const exchange = exchanges?.find(e => e.id === dispute.exchangeId);
                      const reporter = users?.find(u => u.id === dispute.reporterId);
                      
                      return (
                        <Card key={dispute.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Badge 
                                  variant={dispute.status === 'pending' ? 'destructive' : 'outline'}
                                  className="mr-2"
                                >
                                  {dispute.status === 'pending' ? 'Pending' : 'Resolved'}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Reported on {formatDate(new Date(dispute.createdAt))}
                                </span>
                              </div>
                              <h3 className="font-medium mb-1">
                                {exchange?.title || 'Exchange Title Unavailable'}
                              </h3>
                              <div className="text-sm text-muted-foreground mb-2 flex items-center">
                                <UserIcon className="h-4 w-4 mr-1" />
                                Reported by: {reporter?.fullName || 'Unknown User'}
                              </div>
                              <p className="text-sm mb-2">
                                <span className="font-medium">Reason:</span> {dispute.reason}
                              </p>
                            </div>
                            <Dialog open={selectedDisputeId === dispute.id} onOpenChange={(open) => {
                              if (!open) setSelectedDisputeId(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedDisputeId(dispute.id)}
                                >
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Review Disputed Exchange</DialogTitle>
                                  <DialogDescription>
                                    Review the details and resolve this disputed exchange
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">
                                      {exchange?.title || 'Exchange Title Unavailable'}
                                    </h3>
                                    
                                    <Badge 
                                      variant={dispute.status === 'pending' ? 'destructive' : 'outline'}
                                      className="mb-2"
                                    >
                                      {dispute.status === 'pending' ? 'Pending' : 'Resolved'}
                                    </Badge>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Reported by</p>
                                        <div className="flex items-center mt-1">
                                          <UserAvatar 
                                            name={reporter?.fullName || 'Unknown'} 
                                            src={reporter?.avatarUrl || undefined}
                                            size="sm"
                                          />
                                          <span className="ml-2 font-medium">
                                            {reporter?.fullName || 'Unknown User'}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Reported on</p>
                                        <p className="font-medium">
                                          {formatDate(new Date(dispute.createdAt))}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <Separator className="my-4" />
                                    
                                    <div>
                                      <p className="font-medium mb-1">Reason for Dispute</p>
                                      <p>{dispute.reason}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="font-medium mb-1">Details</p>
                                      <p className="text-sm">{dispute.details}</p>
                                    </div>
                                    
                                    {exchange && (
                                      <>
                                        <Separator className="my-4" />
                                        
                                        <div>
                                          <p className="font-medium mb-1">Exchange Details</p>
                                          <p className="text-sm mb-2">{exchange.description}</p>
                                          
                                          <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                              <p className="text-xs text-muted-foreground">Scheduled Date</p>
                                              <p className="font-medium">
                                                {exchange.scheduledDate 
                                                  ? formatDate(new Date(exchange.scheduledDate)) 
                                                  : 'Not scheduled'}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-muted-foreground">Status</p>
                                              <Badge variant="outline">
                                                {exchange.status}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  
                                  <Separator className="my-4" />
                                  
                                  <Form {...disputeForm}>
                                    <form onSubmit={disputeForm.handleSubmit(onDisputeSubmit)} className="space-y-4">
                                      <FormField
                                        control={disputeForm.control}
                                        name="status"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                              <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                {...field}
                                              >
                                                <option value="pending">Pending</option>
                                                <option value="resolved">Resolved</option>
                                              </select>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={disputeForm.control}
                                        name="adminNotes"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Admin Notes</FormLabel>
                                            <FormControl>
                                              <Textarea {...field} placeholder="Enter your notes about this dispute" rows={4} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <DialogFooter>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          onClick={() => setSelectedDisputeId(null)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          type="submit" 
                                          disabled={isResolvingDispute}
                                          className="ml-2"
                                        >
                                          {isResolvingDispute && (
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                          )}
                                          Save Changes
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </Form>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="badges" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                  Badge Approvals
                </CardTitle>
                <CardDescription>
                  Review and approve badge requests from users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingBadgeApprovals ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : badgeApprovalsError ? (
                  <div className="text-center p-8 text-destructive">
                    Error loading badge approvals. Please try again.
                  </div>
                ) : badgeApprovals?.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No badge approvals found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {badgeApprovals?.map(approval => {
                      const user = users?.find(u => u.id === approval.userId);
                      
                      return (
                        <Card key={approval.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                            <div className="flex items-center mr-4">
                              <AchievementBadge type={approval.badgeType as any} size="lg" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Badge 
                                  variant={
                                    approval.status === 'pending' 
                                      ? 'secondary' 
                                      : approval.status === 'approved' 
                                        ? 'default' 
                                        : 'destructive'
                                  }
                                  className="mr-2"
                                >
                                  {approval.status === 'pending' 
                                    ? 'Pending' 
                                    : approval.status === 'approved' 
                                      ? 'Approved' 
                                      : 'Rejected'}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Requested on {formatDate(new Date(approval.createdAt))}
                                </span>
                              </div>
                              <h3 className="font-medium mb-1">
                                {approval.badgeType.charAt(0).toUpperCase() + approval.badgeType.slice(1)} Badge
                              </h3>
                              <div className="text-sm text-muted-foreground mb-2 flex items-center">
                                <UserIcon className="h-4 w-4 mr-1" />
                                Requested by: {user?.fullName || 'Unknown User'}
                              </div>
                              <p className="text-sm mb-2">
                                <span className="font-medium">Criteria:</span> {approval.triggeredCriteria}
                              </p>
                            </div>
                            <Dialog open={selectedBadgeApprovalId === approval.id} onOpenChange={(open) => {
                              if (!open) setSelectedBadgeApprovalId(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedBadgeApprovalId(approval.id)}
                                >
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Review Badge Request</DialogTitle>
                                  <DialogDescription>
                                    Review and approve or reject this badge request
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4 py-4">
                                  <div className="flex justify-center mb-6">
                                    <AchievementBadge type={approval.badgeType as any} size="lg" />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg text-center">
                                      {approval.badgeType.charAt(0).toUpperCase() + approval.badgeType.slice(1)} Badge
                                    </h3>
                                    
                                    <Badge 
                                      variant={
                                        approval.status === 'pending' 
                                          ? 'secondary' 
                                          : approval.status === 'approved' 
                                            ? 'default' 
                                            : 'destructive'
                                      }
                                      className="mx-auto block w-fit mb-4"
                                    >
                                      {approval.status === 'pending' 
                                        ? 'Pending' 
                                        : approval.status === 'approved' 
                                          ? 'Approved' 
                                          : 'Rejected'}
                                    </Badge>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Requested by</p>
                                        <div className="flex items-center mt-1">
                                          <UserAvatar 
                                            name={user?.fullName || 'Unknown'} 
                                            src={user?.avatarUrl || undefined}
                                            size="sm"
                                          />
                                          <span className="ml-2 font-medium">
                                            {user?.fullName || 'Unknown User'}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Requested on</p>
                                        <p className="font-medium">
                                          {formatDate(new Date(approval.createdAt))}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <Separator className="my-4" />
                                    
                                    <div>
                                      <p className="font-medium mb-1">Badge Criteria</p>
                                      <p>{approval.triggeredCriteria}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-md">
                                      <HelpCircle className="h-5 w-5 text-muted-foreground" />
                                      <p className="text-sm text-muted-foreground">
                                        Please verify that the user meets the criteria for this badge before approving.
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <Separator className="my-4" />
                                  
                                  <Form {...badgeApprovalForm}>
                                    <form onSubmit={badgeApprovalForm.handleSubmit(onBadgeApprovalSubmit)} className="space-y-4">
                                      <FormField
                                        control={badgeApprovalForm.control}
                                        name="status"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                              <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                {...field}
                                              >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                              </select>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={badgeApprovalForm.control}
                                        name="adminNotes"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Admin Notes</FormLabel>
                                            <FormControl>
                                              <Textarea 
                                                {...field} 
                                                placeholder="Enter your notes about this badge approval" 
                                                rows={4} 
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <DialogFooter>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          onClick={() => setSelectedBadgeApprovalId(null)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          type="submit" 
                                          disabled={isUpdatingBadgeApproval}
                                          className="ml-2"
                                        >
                                          {isUpdatingBadgeApproval && (
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                          )}
                                          Save Changes
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </Form>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="p-0">
                <ImpactAnalytics />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}