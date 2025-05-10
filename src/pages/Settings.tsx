
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Feature flags
  const [featureFlags, setFeatureFlags] = useState({
    enableRegistration: true,
    enableSubmissions: true,
    enableComments: false,
    enableAnalytics: true,
    enableNotifications: true,
  });
  
  // Theme settings
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#3D518C',
    accentColor: '#E9724C',
    cardRadius: '0.5rem',
    darkMode: false,
  });
  
  // Admin account settings
  const [adminSettings, setAdminSettings] = useState({
    name: 'Admin User',
    email: 'admin@datacareer.app',
    password: '********',
  });
  
  const handleFeatureFlagChange = (key: keyof typeof featureFlags) => {
    setFeatureFlags({
      ...featureFlags,
      [key]: !featureFlags[key],
    });
  };
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThemeSettings({
      ...themeSettings,
      [name]: value,
    });
  };
  
  const handleThemeSwitchChange = (key: keyof typeof themeSettings) => {
    setThemeSettings({
      ...themeSettings,
      [key]: !themeSettings[key],
    });
  };
  
  const handleAdminSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminSettings({
      ...adminSettings,
      [name]: value,
    });
  };
  
  const saveSettings = (section: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success",
        description: `${section} settings updated successfully`,
      });
    }, 800);
  };
  
  return (
    <AdminLayout>
      <PageHeader
        title="Settings"
        description="Configure platform settings"
      />
      
      <Tabs defaultValue="features">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="theme">Theme Settings</TabsTrigger>
          <TabsTrigger value="account">Admin Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features">
          <div className="data-card">
            <h2 className="text-lg font-semibold mb-6">Feature Configuration</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">User Registration</h3>
                  <p className="text-sm text-gray-500">Allow new users to register</p>
                </div>
                <Switch 
                  checked={featureFlags.enableRegistration}
                  onCheckedChange={() => handleFeatureFlagChange('enableRegistration')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Question Submissions</h3>
                  <p className="text-sm text-gray-500">Allow users to submit answers to questions</p>
                </div>
                <Switch 
                  checked={featureFlags.enableSubmissions}
                  onCheckedChange={() => handleFeatureFlagChange('enableSubmissions')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Comments & Discussions</h3>
                  <p className="text-sm text-gray-500">Enable comment sections for questions</p>
                </div>
                <Switch 
                  checked={featureFlags.enableComments}
                  onCheckedChange={() => handleFeatureFlagChange('enableComments')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Analytics</h3>
                  <p className="text-sm text-gray-500">Collect and display usage analytics</p>
                </div>
                <Switch 
                  checked={featureFlags.enableAnalytics}
                  onCheckedChange={() => handleFeatureFlagChange('enableAnalytics')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-gray-500">Send email notifications to users</p>
                </div>
                <Switch 
                  checked={featureFlags.enableNotifications}
                  onCheckedChange={() => handleFeatureFlagChange('enableNotifications')}
                />
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <Button 
                  onClick={() => saveSettings('Feature')} 
                  disabled={loading}
                  className="bg-primary-light hover:bg-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="theme">
          <div className="data-card">
            <h2 className="text-lg font-semibold mb-6">Theme Configuration</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex mt-1">
                    <Input
                      type="text"
                      id="primaryColor"
                      name="primaryColor"
                      value={themeSettings.primaryColor}
                      onChange={handleThemeChange}
                      className="rounded-r-none"
                    />
                    <div 
                      className="w-10 h-10 rounded-r-md border-y border-r border-gray-200"
                      style={{ backgroundColor: themeSettings.primaryColor }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex mt-1">
                    <Input
                      type="text"
                      id="accentColor"
                      name="accentColor"
                      value={themeSettings.accentColor}
                      onChange={handleThemeChange}
                      className="rounded-r-none"
                    />
                    <div 
                      className="w-10 h-10 rounded-r-md border-y border-r border-gray-200"
                      style={{ backgroundColor: themeSettings.accentColor }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardRadius">Card Border Radius</Label>
                <Input
                  type="text"
                  id="cardRadius"
                  name="cardRadius"
                  value={themeSettings.cardRadius}
                  onChange={handleThemeChange}
                  className="mt-1 max-w-xs"
                />
              </div>
              
              <div className="flex items-center justify-between max-w-xs">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Enable dark theme</p>
                </div>
                <Switch 
                  checked={themeSettings.darkMode}
                  onCheckedChange={() => handleThemeSwitchChange('darkMode')}
                />
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <Button 
                  onClick={() => saveSettings('Theme')} 
                  disabled={loading}
                  className="bg-primary-light hover:bg-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <div className="data-card">
            <h2 className="text-lg font-semibold mb-6">Admin Account Settings</h2>
            
            <div className="space-y-6 max-w-md">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={adminSettings.name}
                  onChange={handleAdminSettingChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={adminSettings.email}
                  onChange={handleAdminSettingChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Change Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  className="mt-1"
                />
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <Button 
                  onClick={() => saveSettings('Account')} 
                  disabled={loading}
                  className="bg-primary-light hover:bg-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Settings;
