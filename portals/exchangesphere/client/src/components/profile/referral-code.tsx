import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ReferralCode } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, CheckCircle, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralCodeProps {
  userId: number;
}

export function ReferralCodeSection({ userId }: ReferralCodeProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const { data: referralCode, isLoading } = useQuery<ReferralCode>({
    queryKey: ['/api/referral/my-code'],
    enabled: !!userId,
  });
  
  const referralMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/referral/my-code");
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/referral/my-code'], data);
      toast({
        title: "Referral code regenerated",
        description: "Your new referral code is ready to share!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to regenerate code",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const copyToClipboard = () => {
    if (!referralCode) return;
    
    // Generate full URL with referral code
    const referralUrl = `${window.location.origin}/auth?ref=${referralCode.code}`;
    
    navigator.clipboard.writeText(referralUrl)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Referral link copied successfully",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "Please copy the code manually",
          variant: "destructive",
        });
      });
  };
  
  const shareReferral = () => {
    if (!referralCode) return;
    
    const referralUrl = `${window.location.origin}/auth?ref=${referralCode.code}`;
    const text = "Join me on ExchangeSphere to share skills and learn from others! Use my referral link:";
    
    if (navigator.share) {
      navigator.share({
        title: 'Join ExchangeSphere',
        text,
        url: referralUrl,
      })
      .catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Loading your referral information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Code</CardTitle>
        <CardDescription>
          Share this code with friends to invite them to ExchangeSphere.
          You'll both receive rewards when they join and complete their first exchange!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {referralCode && (
            <div className="flex items-center gap-2">
              <Input
                value={referralCode.code}
                readOnly
                className="font-mono"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Status:</span> Active
            </div>
            {referralCode && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Used:</span> {referralCode.currentUsage} / {referralCode.usageLimit || "Unlimited"}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={shareReferral}
          className="flex-1"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={() => referralMutation.mutate()}
          disabled={referralMutation.isPending}
          className="flex-1"
        >
          {referralMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Generate New Code
        </Button>
      </CardFooter>
    </Card>
  );
}