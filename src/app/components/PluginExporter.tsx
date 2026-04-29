import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, FileArchive, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { useState, useEffect } from 'react';

interface PluginExporterProps {
  jsCode: string;
  cssCode: string;
  packageJson: string;
  readme: string;
  onExportZip: () => void;
}

export const PluginExporter = ({
  jsCode,
  cssCode,
  packageJson,
  readme,
  onExportZip,
}: PluginExporterProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const exportAsZip = async () => {
    try {
      const zip = new JSZip();

      zip.file('ChatWidget.jsx', jsCode);
      zip.file('ChatWidget.css', cssCode);
      zip.file('package.json', packageJson);
      zip.file('README.md', readme);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat-widget-plugin.zip';
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Plugin exported as ZIP!');
      onExportZip();
    } catch (error) {
      toast.error('Failed to export ZIP file');
      console.error(error);
    }
  };

  const copyInstallCode = async () => {
    const installCode = `// 1. Copy all files from the ZIP to your React project
// 2. Import the widget in your component:

import ChatWidget from './ChatWidget';
import './ChatWidget.css';

function App() {
  return (
    <div className="App">
      <ChatWidget />
    </div>
  );
}`;

    try {
      await navigator.clipboard.writeText(installCode);
      setCopied(true);
      toast.success('Installation code copied!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileArchive className="size-5" />
          Export Plugin
        </CardTitle>
        <CardDescription>
          Download all files as a ZIP or copy installation instructions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Button onClick={exportAsZip} className="w-full">
            <Download className="size-4 mr-2" />
            Download Complete Plugin (ZIP)
          </Button>

          <Button variant="outline" onClick={copyInstallCode} className="w-full">
            {copied ? (
              <>
                <Check className="size-4 mr-2" />
                Installation Code Copied!
              </>
            ) : (
              <>
                <Copy className="size-4 mr-2" />
                Copy Installation Code
              </>
            )}
          </Button>
        </div>

        <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
          <p className="font-medium">What's included:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>ChatWidget.jsx - Main component</li>
            <li>ChatWidget.css - Styling</li>
            <li>package.json - Dependencies</li>
            <li>README.md - Documentation</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Quick Start:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
            <li>Download the ZIP file</li>
            <li>Extract to your React project</li>
            <li>Import ChatWidget component</li>
            <li>Customize as needed!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
