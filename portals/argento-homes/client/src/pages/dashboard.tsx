import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import RoleSelector from '@/components/role-selector';
import KpiCard from '@/components/dashboard/kpi-card';
import PropertyCard from '@/components/dashboard/property-card';
import TaskCard from '@/components/dashboard/task-card';
import SustainabilityTracker from '@/components/dashboard/sustainability-tracker';
import MessageCard from '@/components/dashboard/message-card';
import VendorCard from '@/components/dashboard/vendor-card';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import RevenueChart from '@/components/dashboard/revenue-chart';
import { Property, SustainabilityMetric, Task, Message, Vendor, Booking } from '@shared/schema';
import { Home, CheckCircle, DollarSign, Sparkles, Wrench, Leaf, Calendar } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PropertyStatus } from './properties';
import { useToast } from '@/hooks/use-toast';

// Dummy data for the chart
const revenueData = [
  { name: 'Jan', value: 8400 },
  { name: 'Feb', value: 9200 },
  { name: 'Mar', value: 8900 },
  { name: 'Apr', value: 10400 },
  { name: 'May', value: 11200 },
  { name: 'Jun', value: 12890 },
];

// Recommended vendors data
const recommendedVendors = [
  {
    id: 1,
    name: 'CleanPro Services',
    category: 'cleaning',
    icon: <Sparkles size={24} />,
    rating: 5,
    reviewCount: 124,
    description: 'Professional cleaning services for vacation rentals with eco-friendly options.',
  },
  {
    id: 2,
    name: 'FixIt Maintenance',
    category: 'maintenance',
    icon: <Wrench size={24} />,
    rating: 4.5,
    reviewCount: 89,
    description: '24/7 maintenance and repair services for all property types.',
  },
  {
    id: 3,
    name: 'Smart Home Pro',
    category: 'smart_home',
    icon: <Home size={24} />,
    rating: 5,
    reviewCount: 142,
    description: 'Full smart home installations and ongoing support services.',
  },
  {
    id: 4,
    name: 'Modern Interiors',
    category: 'interior_design',
    icon: <Home size={24} />,
    rating: 4,
    reviewCount: 76,
    description: 'Interior design services specializing in vacation rental appeal.',
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const userPermissions = usePermissions();

  // Fetch properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  // Fetch recent messages
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
  });
  
  // Fetch bookings
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });

  // Property action handlers
  const handleAddProperty = () => {
    window.location.href = "/properties/add";
  };

  const handleViewProperty = (propertyId: number) => {
    window.location.href = `/properties/${propertyId}`;
  };

  // Vendor action handlers
  const handleContactVendor = (vendorId: number) => {
    toast({
      title: "Contact Vendor",
      description: `Contact form for vendor #${vendorId} will open soon.`,
    });
  };
  
  const handleAssignTaskToVendor = (vendorId: number) => {
    toast({
      title: "Assign Task",
      description: `Task assignment form for vendor #${vendorId} will open soon.`,
    });
  };

  // Task action handler
  const handleViewTask = (taskId: number) => {
    toast({
      title: "View Task",
      description: `Task details for task #${taskId} will be displayed soon.`,
    });
  };

  // Bookings action handler
  const handleViewBookings = () => {
    window.location.href = "/bookings";
  };

  // Sustainability action handler
  const handleImproveSustainability = () => {
    toast({
      title: "Sustainability Improvements",
      description: "Sustainability improvement suggestions will be provided soon.",
    });
  };

  // Calculate certified properties
  const certifiedProperties = properties.filter(p => p.isCertified).length;

  // Determine what to render based on user's role
  const renderDashboardContent = () => {
    // Admin Dashboard
    if (userPermissions.permissions.isAdmin) {
      return (
        <>
          {/* Admin KPI Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <KpiCard 
              icon={<Home size={24} />}
              title="Total Properties"
              value={properties.length}
              change={{
                value: "+1 this month",
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<CheckCircle size={24} />}
              title="Certified Units"
              value={certifiedProperties}
              change={{
                value: `${Math.round((certifiedProperties / (properties.length || 1)) * 100)}% certified`,
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<DollarSign size={24} />}
              title="Total Users"
              value={(Math.floor(Math.random() * 50) + 20).toString()}
              change={{
                value: "+3 this week",
                isPositive: true
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main admin content */}
            <div className="lg:col-span-2">
              {/* Platform Statistics */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 p-5">
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-700">Properties</h3>
                      <div className="flex justify-between mt-2">
                        <span>Total:</span>
                        <span className="font-semibold">{properties.length}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Certified:</span>
                        <span className="font-semibold">{certifiedProperties}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Pending:</span>
                        <span className="font-semibold">{properties.length - certifiedProperties}</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-green-700">Bookings</h3>
                      <div className="flex justify-between mt-2">
                        <span>Total:</span>
                        <span className="font-semibold">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Confirmed:</span>
                        <span className="font-semibold">{bookings.filter(b => b.status === 'confirmed').length}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Pending:</span>
                        <span className="font-semibold">{bookings.filter(b => b.status === 'pending').length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-medium mb-2">Recent Activity</h3>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-600">New property added by John D. (3 hours ago)</li>
                      <li className="text-sm text-gray-600">Maria S. submitted certification request (8 hours ago)</li>
                      <li className="text-sm text-gray-600">New vendor application from CleanPro Services (1 day ago)</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-5 py-3 text-center">
                  <Button 
                    variant="link" 
                    className="text-brand hover:text-brand-light w-full"
                    onClick={() => window.location.href = "/admin-panel"}
                  >
                    View Admin Panel
                  </Button>
                </CardFooter>
              </Card>

              {/* User Management Preview */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Property Owners</h3>
                        <p className="text-sm text-gray-500">12 active users</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    
                    <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Vendors</h3>
                        <p className="text-sm text-gray-500">8 approved, 3 pending</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    
                    <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Guests</h3>
                        <p className="text-sm text-gray-500">28 registered users</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin sidebar - Approvals & Actions */}
            <div className="lg:col-span-1">
              {/* Platform Revenue */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>Platform Revenue</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <RevenueChart 
                    data={revenueData}
                    currentMonth={{ value: 12890 }}
                    lastMonth={{ value: 11920 }}
                    growth="+8.2%"
                  />
                </CardContent>
              </Card>

              {/* Pending Approvals */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5 flex justify-between items-center">
                  <CardTitle>Pending Approvals</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin-panel"}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="p-3 bg-brand-warning/10 rounded-lg">
                      <h3 className="font-medium text-brand-warning">Property Certifications</h3>
                      <p className="text-sm text-brand-warning/80 mt-1">3 properties awaiting certification</p>
                      <Button className="mt-2 w-full bg-brand-warning hover:bg-brand-warning/90 text-white">
                        Review
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-brand/10 rounded-lg">
                      <h3 className="font-medium text-brand">Vendor Applications</h3>
                      <p className="text-sm text-brand/80 mt-1">2 vendors awaiting approval</p>
                      <Button className="mt-2 w-full bg-brand hover:bg-brand/90 text-white">
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-2">
                    <Button className="w-full bg-brand-success hover:bg-brand-success/90" onClick={() => window.location.href = "/admin-panel"}>
                      Admin Panel
                    </Button>
                    <Button className="w-full" onClick={() => window.location.href = "/guest"}>
                      Guest Portal View
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = "/payment-test"}>
                      Payment Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      );
    }
    
    // Property Owner Dashboard
    else if (userPermissions.permissions.isPropertyOwner) {
      return (
        <>
          {/* Welcome Banner */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <WelcomeBanner 
              onAddProperty={handleAddProperty}
              onViewProperties={() => window.location.href = "/properties"}
            />
          </div>
          
          {/* Property Owner KPI Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 px-4 sm:px-6 lg:px-8">
            <KpiCard 
              icon={<Home size={24} />}
              title="My Properties"
              value={properties.length}
              change={{
                value: "+1 this month",
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<CheckCircle size={24} />}
              title="Certified Units"
              value={certifiedProperties}
              change={{
                value: `${Math.round((certifiedProperties / (properties.length || 1)) * 100)}% certified`,
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<DollarSign size={24} />}
              title="Monthly Revenue"
              value="$12,890"
              change={{
                value: "+8.2% vs last month",
                isPositive: true
              }}
            />
          </div>

          {/* Property owner specific content can go here */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="lg:col-span-2">
              {/* Tasks Section */}
              <Card className="mb-6 overflow-hidden bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <CardHeader className="border-b border-[#C0C0C0] p-5">
                  <CardTitle className="text-[#2E2E2E]">Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <TaskCard
                    icon={<Sparkles size={20} />}
                    title="Cleaning Service"
                    location="Mountain Cabin"
                    date="May 28, 2025"
                    onViewDetails={() => handleViewTask(1)}
                  />
                  
                  <TaskCard
                    icon={<Wrench size={20} />}
                    title="Maintenance Check"
                    location="Luxury Beach Villa"
                    date="June 3, 2025"
                    onViewDetails={() => handleViewTask(2)}
                  />
                  
                  <TaskCard
                    icon={<Leaf size={20} />}
                    title="Sustainability Assessment"
                    location="Downtown Loft"
                    date="June 10, 2025"
                    onViewDetails={() => handleViewTask(3)}
                  />
                </CardContent>
                <CardFooter className="bg-[#FAFAFA] px-5 py-3 text-center">
                  <Button 
                    variant="link" 
                    className="text-[#2ECC71] hover:text-[#2ECC71]/80 w-full"
                    onClick={() => window.location.href = "/tasks"}
                  >
                    View All Tasks
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar area */}
            <div className="lg:col-span-1">
              {/* Recommended Vendors Section */}
              <Card className="mb-6 overflow-hidden bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <CardHeader className="border-b border-[#C0C0C0] p-5">
                  <CardTitle className="text-[#2E2E2E]">Recommended Vendors</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {recommendedVendors.slice(0, 2).map(vendor => (
                    <VendorCard
                      key={vendor.id}
                      icon={vendor.icon}
                      name={vendor.name}
                      rating={vendor.rating}
                      reviewCount={vendor.reviewCount}
                      description={vendor.description}
                      onContact={() => handleContactVendor(vendor.id)}
                      onAssignTask={() => handleAssignTaskToVendor(vendor.id)}
                      onViewProfile={() => window.location.href = `/marketplace/vendor/${vendor.id}`}
                    />
                  ))}
                </CardContent>
                <CardFooter className="bg-[#FAFAFA] px-5 py-3 text-center">
                  <Button 
                    variant="link" 
                    className="text-[#2ECC71] hover:text-[#2ECC71]/80 w-full"
                    onClick={() => window.location.href = "/marketplace"}
                  >
                    View All Vendors
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      );
    }
    
    // Guest Dashboard
    else if (userPermissions.permissions.isGuest) {
      return (
        <>
          {/* Guest KPI Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <KpiCard 
              icon={<Home size={24} />}
              title="Saved Properties"
              value="8"
              change={{
                value: "+2 this week",
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<Calendar size={24} />}
              title="Upcoming Stays"
              value="2"
              change={{
                value: "Next in 15 days",
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<DollarSign size={24} />}
              title="Total Spent"
              value="$3,450"
              change={{
                value: "This year",
                isPositive: true
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main guest content */}
            <div className="lg:col-span-2">
              {/* Upcoming Bookings Section */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>Upcoming Stays</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Luxury Beach Villa</h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Confirmed</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">June 15 - June 22, 2025 (7 nights)</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">$1,850 total</span>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Mountain Cabin Retreat</h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Confirmed</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">July 10 - July 17, 2025 (7 nights)</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">$1,600 total</span>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-5 py-3 text-center">
                  <Button 
                    variant="link" 
                    className="text-brand hover:text-brand-light w-full"
                    onClick={handleViewBookings}
                  >
                    View All Bookings
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Saved Properties */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5 flex justify-between items-center">
                  <CardTitle>Saved Properties</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.location.href = "/guest"}
                  >
                    Browse More
                  </Button>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-3">
                        <h3 className="font-medium mb-1">Downtown Loft</h3>
                        <p className="text-sm text-gray-500 mb-2">San Francisco, CA</p>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">$220/night</span>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-3">
                        <h3 className="font-medium mb-1">Beachfront Condo</h3>
                        <p className="text-sm text-gray-500 mb-2">Miami, FL</p>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">$180/night</span>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Guest sidebar */}
            <div className="lg:col-span-1">
              {/* Guest Profile */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-3">
                      <span className="text-white text-xl font-medium">
                        {user?.fullName?.[0] || user?.username?.[0] || 'G'}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg">{user?.fullName || user?.username || 'Guest User'}</h3>
                    <p className="text-gray-500 text-sm mb-3">{user?.email || 'guest@example.com'}</p>
                    <div className="w-full mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Guest Level:</span>
                        <span className="font-medium">Silver</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div className="bg-brand h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">300 more points until Gold</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <MessageCard
                    senderName="Luxury Beach Villa Host"
                    senderInitials="LH"
                    time="Yesterday"
                    content="Looking forward to your stay next month! Let me know if you have any questions."
                  />
                  
                  <MessageCard
                    senderName="Argento Homes"
                    senderInitials="AH"
                    time="3d ago"
                    content="Your booking for Mountain Cabin Retreat has been confirmed. Enjoy your stay!"
                  />
                </CardContent>
                <CardFooter className="bg-gray-50 px-5 py-3 text-center">
                  <Button 
                    variant="link" 
                    className="text-brand hover:text-brand-light w-full"
                    onClick={() => window.location.href = "/messages"}
                  >
                    View All Messages
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      );
    }
    
    // Vendor Dashboard
    else if (userPermissions.permissions.isVendor) {
      return (
        <>
          {/* Vendor KPI Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <KpiCard 
              icon={<Wrench size={24} />}
              title="Active Tasks"
              value="5"
              change={{
                value: "2 due this week",
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<CheckCircle size={24} />}
              title="Completed Tasks"
              value="12"
              change={{
                value: "+3 this month",
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<Sparkles size={24} />}
              title="Rating"
              value="4.8/5"
              change={{
                value: "+0.2 since last month",
                isPositive: true
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main vendor content */}
            <div className="lg:col-span-2">
              {/* Assigned Tasks Section */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>Assigned Tasks</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <TaskCard
                    icon={<Sparkles size={20} />}
                    title="Cleaning Service"
                    location="Mountain Cabin"
                    date="May 28, 2025"
                    onViewDetails={() => handleViewTask(1)}
                  />
                  
                  <TaskCard
                    icon={<Wrench size={20} />}
                    title="Maintenance Check"
                    location="Luxury Beach Villa"
                    date="June 3, 2025"
                    onViewDetails={() => handleViewTask(2)}
                  />
                  
                  <TaskCard
                    icon={<Leaf size={20} />}
                    title="Sustainability Assessment"
                    location="Downtown Loft"
                    date="June 10, 2025"
                    onViewDetails={() => handleViewTask(3)}
                  />
                </CardContent>
                <CardFooter className="bg-[#FAFAFA] px-5 py-3 text-center">
                  <Button 
                    variant="link" 
                    className="text-[#2ECC71] hover:text-[#2ECC71]/80 w-full"
                    onClick={() => window.location.href = "/tasks"}
                  >
                    View All Tasks
                  </Button>
                </CardFooter>
              </Card>

              {/* Service Areas */}
              <Card className="mb-6 overflow-hidden bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <CardHeader className="border-b border-[#C0C0C0] p-5">
                  <CardTitle className="text-[#2E2E2E]">Service Areas</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="p-4 bg-[#2ECC71]/5 rounded-lg">
                      <h3 className="font-medium text-[#2ECC71] mb-2">Active Coverage Zones</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded border border-[#2ECC71]/20">
                          <h4 className="font-medium text-[#2E2E2E]">Downtown</h4>
                          <p className="text-sm text-[#2E2E2E]/70">8 properties</p>
                        </div>
                        <div className="p-3 bg-white rounded border border-[#2ECC71]/20">
                          <h4 className="font-medium text-[#2E2E2E]">Beachfront</h4>
                          <p className="text-sm text-[#2E2E2E]/70">5 properties</p>
                        </div>
                        <div className="p-3 bg-white rounded border border-[#2ECC71]/20">
                          <h4 className="font-medium text-[#2E2E2E]">Suburbs</h4>
                          <p className="text-sm text-[#2E2E2E]/70">3 properties</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-[#C0C0C0] rounded-lg">
                      <h3 className="font-medium text-[#2E2E2E] mb-2">Expand Your Coverage</h3>
                      <p className="text-sm text-[#2E2E2E]/70 mb-3">
                        Add more service areas to increase your visibility to property owners.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full border-[#2ECC71] text-[#2ECC71] hover:bg-[#2ECC71]/5"
                      >
                        Add Service Area
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vendor sidebar */}
            <div className="lg:col-span-1">
              {/* Performance Stats */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>Performance Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Task Completion Rate</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-brand-success h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">On-Time Rate</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-brand h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Client Satisfaction</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-brand-warning h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5 flex justify-between items-center">
                  <CardTitle>Recent Messages</CardTitle>
                  <Button variant="ghost" className="text-brand hover:text-brand-light p-0">
                    <span className="text-xl font-medium">+</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-5">
                  <MessageCard
                    senderName="John Smith (Owner)"
                    senderInitials="JS"
                    time="Yesterday"
                    content="Thanks for the quick response. Can you provide a quote for monthly maintenance?"
                  />
                  
                  <MessageCard
                    senderName="Argento Homes"
                    senderInitials="AH"
                    time="2d ago"
                    content="Your vendor application has been approved. Welcome to our platform!"
                  />
                </CardContent>
                <CardFooter className="bg-gray-50 px-5 py-3 text-center">
                  <Button 
                    variant="link" 
                    className="text-brand hover:text-brand-light w-full"
                    onClick={() => window.location.href = "/messages"}
                  >
                    View All Messages
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Actions */}
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-gray-200 p-5">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-2">
                    <Button className="w-full bg-brand-success hover:bg-brand-success/90" onClick={() => window.location.href = "/tasks"}>
                      Manage Tasks
                    </Button>
                    <Button className="w-full" onClick={() => window.location.href = "/marketplace"}>
                      View Marketplace
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = "/messages"}>
                      Contact Property Owners
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      );
    }
    
    // Default Dashboard (Fallback)
    else {
      return (
        <>
          {/* Default KPI Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <KpiCard 
              icon={<Home size={24} />}
              title="Total Properties"
              value={properties.length}
              change={{
                value: "+1 this month",
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<CheckCircle size={24} />}
              title="Certified Units"
              value={certifiedProperties}
              change={{
                value: `${Math.round((certifiedProperties / (properties.length || 1)) * 100)}% certified`,
                isPositive: true
              }}
            />
            
            <KpiCard 
              icon={<DollarSign size={24} />}
              title="Monthly Revenue"
              value="$12,890"
              change={{
                value: "+8.2% vs last month",
                isPositive: true
              }}
            />
          </div>

          <div className="p-8 text-center bg-blue-50 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Argento Homes Digital Portal</h2>
            <p className="text-gray-700 mb-6">Please select your role to see a customized dashboard.</p>
            <div className="w-full max-w-md mx-auto">
              <RoleSelector />
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex justify-center mb-6 space-x-4">
            <a 
              href="/guest" 
              className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              View Guest Portal
            </a>
            <a 
              href="/payment-test" 
              className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
            >
              <DollarSign className="mr-1.5 h-4 w-4" />
              Test Payment
            </a>
          </div>
        </>
      );
    }
  };

  return (
    <SidebarLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Role Selector for all users */}
        <div className="bg-white shadow-sm mb-6 p-3 rounded-lg">
          <RoleSelector />
        </div>
        
        {/* Render dashboard content based on role */}
        {renderDashboardContent()}
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;