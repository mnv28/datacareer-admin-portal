
import React, { useState, useEffect } from 'react';
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
import { useSearchParams } from 'react-router-dom';
import { getSettings, updateSettings, updateAdminAccountSettings, getAdminProfile } from '@/services/settingsService';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'features';

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingSettings, setFetchingSettings] = useState(true);

  // Feature flags - mapped to backend settings
  const [featureFlags, setFeatureFlags] = useState({
    enableRegistration: true,
    enableSubmissions: true,
  });

  // Admin account settings
  const [adminSettings, setAdminSettings] = useState({
    name: '',
    email: '',
    newPassword: '',
  });

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetchingSettings(true);
        const [settings, profile] = await Promise.all([
          getSettings(),
          getAdminProfile()
        ]);

        if (settings) {
          setFeatureFlags({
            enableRegistration: settings.allowUserRegistration ?? true,
            enableSubmissions: settings.allowQuestionSubmissions ?? true,
          });
        }

        if (profile) {
          setAdminSettings({
            name: profile.name || '',
            email: profile.email || '',
            newPassword: '',
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setFetchingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  const handleFeatureFlagChange = (key: keyof typeof featureFlags, checked: boolean) => {
    setFeatureFlags(prev => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleAdminSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminSettings({
      ...adminSettings,
      [name]: value,
    });
  };

  const saveSettings = async (section: string) => {
    if (section === 'Feature') {
      setLoading(true);
      try {
        await updateSettings({
          allowUserRegistration: featureFlags.enableRegistration,
          allowQuestionSubmissions: featureFlags.enableSubmissions,
        });
        toast({
          title: "Success",
          description: "Feature settings updated successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else if (section === 'Account') {
      setLoading(true);
      try {
        await updateAdminAccountSettings({
          name: adminSettings.name,
          email: adminSettings.email,
          ...(adminSettings.newPassword ? { newPassword: adminSettings.newPassword } : {}),
        });
        toast({
          title: "Success",
          description: "Admin account settings updated successfully",
        });
        // Clear password field after success
        setAdminSettings(prev => ({ ...prev, newPassword: '' }));
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update account settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Settings"
        description="Configure platform settings"
      />

      <Tabs
        value={currentTab}
        onValueChange={(value) => setSearchParams({ tab: value })}
      >
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="account">Admin Account</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <div className="data-card">
            <h2 className="text-lg font-semibold mb-6">Feature Configuration</h2>

            {fetchingSettings ? (
              <div className="text-gray-500">Loading settings...</div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">User Registration</h3>
                    <p className="text-sm text-gray-500">Allow new users to register</p>
                  </div>
                  <Switch
                    checked={featureFlags.enableRegistration}
                    onCheckedChange={(checked) => handleFeatureFlagChange('enableRegistration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Question Submissions</h3>
                    <p className="text-sm text-gray-500">Allow users to submit answers to questions</p>
                  </div>
                  <Switch
                    checked={featureFlags.enableSubmissions}
                    onCheckedChange={(checked) => handleFeatureFlagChange('enableSubmissions', checked)}
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
            )}
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
                <Label htmlFor="newPassword">Change Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={adminSettings.newPassword}
                  onChange={handleAdminSettingChange}
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
