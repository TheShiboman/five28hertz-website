import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Property, InsertTask } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AssignTaskDialogProps {
  vendorId: number;
  vendorName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Task types available for assignment
const taskTypes = [
  { id: 'Cleaning', name: 'Cleaning' },
  { id: 'Maintenance', name: 'Maintenance' },
  { id: 'Repair', name: 'Repair' },
  { id: 'Inspection', name: 'Inspection' },
  { id: 'Installation', name: 'Installation' },
  { id: 'Photography', name: 'Photography' },
  { id: 'Decoration', name: 'Decoration' },
  { id: 'Other', name: 'Other' }
];

const AssignTaskDialog = ({ 
  vendorId, 
  vendorName, 
  isOpen, 
  onClose 
}: AssignTaskDialogProps) => {
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedTaskType, setSelectedTaskType] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the user's properties for the dropdown
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      const res = await apiRequest('POST', '/api/tasks', data);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate both tasks and property-specific tasks queries
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      if (selectedProperty) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/properties', parseInt(selectedProperty), 'tasks'] 
        });
      }
      
      toast({
        title: "Task assigned successfully",
        description: `A new task has been assigned to ${vendorName}`,
      });
      
      // Reset form and close dialog
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to assign task",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  const resetForm = () => {
    setSelectedProperty("");
    setSelectedTaskType("");
    setTaskTitle("");
    setTaskDescription("");
    setSelectedDate(new Date());
    setIsSubmitting(false);
  };

  const validateForm = (): boolean => {
    if (!selectedProperty) {
      toast({
        title: "Missing property",
        description: "Please select a property for this task",
        variant: "destructive",
      });
      return false;
    }

    if (!taskTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for this task",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedTaskType) {
      toast({
        title: "Missing task type",
        description: "Please select a task type",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedDate) {
      toast({
        title: "Missing due date",
        description: "Please select a due date for this task",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const taskData: InsertTask = {
      propertyId: parseInt(selectedProperty),
      title: `${selectedTaskType} - ${taskTitle}`,
      description: taskDescription || null,
      type: selectedTaskType,
      status: "Pending",
      dueDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null
    };
    
    createTaskMutation.mutate(taskData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Task to {vendorName}</DialogTitle>
          <DialogDescription>
            Fill out the details below to assign a task to this vendor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="property">Select Property</Label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger id="property">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={String(property.id)}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              placeholder="Enter a title for this task..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="task-type">Task Type</Label>
            <Select value={selectedTaskType} onValueChange={setSelectedTaskType}>
              <SelectTrigger id="task-type">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((taskType) => (
                  <SelectItem key={taskType.id} value={taskType.id}>
                    {taskType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task details..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="resize-none min-h-[100px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="due-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            {isSubmitting ? 'Assigning...' : 'Assign Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskDialog;