import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatAssistant } from '@/components/ui/chat-assistant';

export default function TestChat() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Chat Assistant Test Page</h1>
        
        <div className="mb-8">
          <ChatAssistant 
            assistantType="general"
            title="Test Assistant"
            gradientFrom="amber-500"
            gradientTo="orange-500" 
            iconColor="orange-600"
            initialMessage="Hello! This is a test assistant. Please try typing a message to me."
          />
        </div>
        
        <div className="text-center">
          <Button asChild variant="outline">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}