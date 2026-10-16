import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/user-avatar';
import { Stars } from '@/components/ui/stars';

export function SuccessStory() {
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5">
      <CardContent className="p-0">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Success Story</h3>
        <div className="relative">
          <img 
            className="h-40 w-full object-cover rounded-lg" 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" 
            alt="People collaborating" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60 rounded-lg"></div>
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h4 className="text-sm font-semibold">How Jack learned traditional pottery in Japan</h4>
            <p className="text-xs mt-1">A life-changing experience through skill exchange</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <UserAvatar
              name="Jack Reynolds"
              src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              size="sm"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">Jack Reynolds</p>
              <Stars rating={5} size="sm" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600 line-clamp-3">
              "I never thought I'd get to learn from a master potter in Japan! Thanks to ExchangeSphere, I exchanged web design skills for this amazing opportunity."
            </p>
            <button className="mt-2 text-primary hover:text-green-700 text-sm font-medium">
              Read full story
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
