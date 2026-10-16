import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "@/lib/firebase";

interface EditProfileFormData {
  displayName: string;
  bio: string;
  photoURL?: string;
}

export function EditProfileDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EditProfileFormData>({
    displayName: auth.currentUser?.displayName || "",
    bio: "",
    photoURL: auth.currentUser?.photoURL || undefined
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|png)/) || file.size > 2 * 1024 * 1024) {
      toast({
        title: "Invalid file",
        description: "Please select a PNG or JPG file under 2MB",
        variant: "destructive"
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check authentication
      if (!auth.currentUser) {
        throw new Error("You must be logged in to update your profile");
      }

      // Get fresh token first
      const token = await auth.currentUser.getIdToken(true);

      // Upload image if present
      let photoURL = formData.photoURL;
      if (imageFile) {
        const storage = getStorage();
        const imageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      // Make profile update request
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          bio: formData.bio,
          photoURL
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      // Success
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      setIsOpen(false);
      setImageFile(null);
      setImagePreview(null);

      // Reload the page to show updated profile
      window.location.reload();

    } catch (error) {
      console.error("Profile update failed:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              required
              disabled={isLoading}
              aria-describedby="displayName-description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={isLoading}
              rows={4}
              aria-describedby="bio-description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Profile Picture</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt="Current profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : null}
              <Input
                id="photo"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                disabled={isLoading}
                aria-describedby="photo-description"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}