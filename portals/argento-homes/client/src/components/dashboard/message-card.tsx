import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageCardProps {
  senderName: string;
  senderInitials: string;
  time: string;
  content: string;
}

const MessageCard = ({ senderName, senderInitials, time, content }: MessageCardProps) => {
  return (
    <div className="mb-4 pb-4 border-b border-gray-100">
      <div className="flex items-start">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-gray-300 text-gray-700">{senderInitials}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <div className="flex items-center">
            <h4 className="font-medium text-charcoal">{senderName}</h4>
            <span className="text-xs text-gray-500 ml-2">{time}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
