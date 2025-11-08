import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <AppLayout>
      <div className="space-y-8 pb-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 rounded-2xl" />
          <div className="relative p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <SettingsIcon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Manage your account and application preferences
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-accent/10 border-0">
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card className="border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <SettingsIcon className="h-6 w-6 text-accent" />
                </div>
                <p className="text-muted-foreground">Profile settings interface coming soon...</p>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-accent/70 rounded-full animate-pulse delay-75" />
                  <div className="w-1 h-1 bg-accent/50 rounded-full animate-pulse delay-150" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card className="border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <SettingsIcon className="h-6 w-6 text-accent" />
                </div>
                <p className="text-muted-foreground">Security settings interface coming soon...</p>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-accent/70 rounded-full animate-pulse delay-75" />
                  <div className="w-1 h-1 bg-accent/50 rounded-full animate-pulse delay-150" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card className="border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <SettingsIcon className="h-6 w-6 text-accent" />
                </div>
                <p className="text-muted-foreground">Notification settings interface coming soon...</p>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-accent/70 rounded-full animate-pulse delay-75" />
                  <div className="w-1 h-1 bg-accent/50 rounded-full animate-pulse delay-150" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
