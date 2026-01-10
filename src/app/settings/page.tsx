"use client";

import { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '@/components/app-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, KeyRound, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AppData } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { getAppData, importData, geminiApiKey, setGeminiApiKey } = useContext(AppContext);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApiKey] = useState(geminiApiKey || '');

  useEffect(() => {
    setApiKey(geminiApiKey || '');
  }, [geminiApiKey]);

  const handleExport = () => {
    const data = getAppData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `fluent-progress-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export Successful',
      description: 'Your data has been downloaded.',
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const imported = JSON.parse(text) as AppData;
          // Simple validation
          if (imported.topics && imported.sessions) {
            importData(imported);
            toast({
              title: 'Import Successful',
              description: 'Your data has been restored.',
            });
          } else {
            throw new Error('Invalid file format.');
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: (error as Error).message || 'Please check the file and try again.',
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApiKeySave = () => {
    setGeminiApiKey(apiKey);
    toast({
      title: 'API Key Saved',
      description: 'Your Gemini API key has been updated.',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage your application data and settings.
        </p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Gemini API Key</CardTitle>
          <CardDescription>
            Provide your Gemini API key to enable AI features like text-to-speech. Your key is stored securely in your browser's local storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Label htmlFor="api-key">Your API Key</Label>
            <div className="flex gap-2">
                <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                />
                 <Button onClick={handleApiKeySave} disabled={apiKey === geminiApiKey}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </div>
        </CardContent>
        <CardFooter>
            <p className="text-sm text-muted-foreground">
                You can get a free API key from <a href="https://aistudio.google.com/keys" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>.
            </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export your data for backup, or import a previous backup to restore your progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExport} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Import Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will overwrite all your current data. This action cannot be undone. Are you sure you want to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleImportClick}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/json"
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
}
