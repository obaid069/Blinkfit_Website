import React from 'react';
import { 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Target, 
  Lightbulb, 
  Shield, 
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock 
} from 'lucide-react';

const IconTest = () => {
  const testIcons = [
    { icon: Eye, name: 'Eye' },
    { icon: Heart, name: 'Heart' },
    { icon: Users, name: 'Users' },
    { icon: Award, name: 'Award' },
    { icon: Target, name: 'Target' },
    { icon: Lightbulb, name: 'Lightbulb' },
    { icon: Shield, name: 'Shield' },
    { icon: Globe, name: 'Globe' },
    { icon: Mail, name: 'Mail' },
    { icon: Phone, name: 'Phone' },
    { icon: MapPin, name: 'MapPin' },
    { icon: Clock, name: 'Clock' }
  ];

  return (
    <div className="p-8 bg-[#121212] min-h-screen">
      <h1 className="text-white text-2xl mb-8">Icon Test</h1>
      
      <div className="grid grid-cols-4 gap-8">
        {testIcons.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.name} className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ backgroundColor: '#49a74f' }}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <p className="text-white text-sm">{item.name}</p>
            </div>
          );
        })}
      </div>

      {/* Simple direct test */}
      <div className="mt-8">
        <h2 className="text-white text-xl mb-4">Direct Icon Test:</h2>
        <div className="flex gap-4">
          <Eye className="w-8 h-8 text-green-500" />
          <Heart className="w-8 h-8 text-red-500" />
          <Users className="w-8 h-8 text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default IconTest;
