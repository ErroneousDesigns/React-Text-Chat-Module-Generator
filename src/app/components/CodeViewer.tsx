import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Download, Check, Code2 } from 'lucide-react';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';

interface CodeViewerProps {
  jsCode: string;
  cssCode: string;
  packageJson: string;
  readme: string;
  onJsCodeChange?: (code: string) => void;
  onCssCodeChange?: (code: string) => void;
}

export const CodeViewer = ({
  jsCode,
  cssCode,
  packageJson,
  readme,
  onJsCodeChange,
  onCssCodeChange,
}: CodeViewerProps) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('jsx');

  useEffect(() => {
    if (copiedFile) {
      const timer = setTimeout(() => setCopiedFile(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedFile]);

  const copyToClipboard = async (code: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedFile(fileName);
      toast.success(`${fileName} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded!`);
  };

  const files = [
    { name: 'ChatWidget.jsx', code: jsCode, language: 'javascript', tab: 'jsx', editable: true },
    { name: 'ChatWidget.css', code: cssCode, language: 'css', tab: 'css', editable: true },
    { name: 'package.json', code: packageJson, language: 'json', tab: 'package' },
    { name: 'README.md', code: readme, language: 'markdown', tab: 'readme' },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="size-5 text-primary" />
            <CardTitle>Generated Plugin Code</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="jsx">ChatWidget.jsx</TabsTrigger>
            <TabsTrigger value="css">ChatWidget.css</TabsTrigger>
            <TabsTrigger value="package">package.json</TabsTrigger>
            <TabsTrigger value="readme">README.md</TabsTrigger>
          </TabsList>

          {files.map((file) => (
            <TabsContent
              key={file.tab}
              value={file.tab}
              className="flex-1 flex flex-col min-h-0 mt-0"
            >
              <div className="flex gap-2 mb-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(file.code, file.name)}
                >
                  {copiedFile === file.name ? (
                    <>
                      <Check className="size-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-4 mr-2" />
                      Copy {file.name}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadFile(file.code, file.name)}
                >
                  <Download className="size-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex-1 border rounded-lg overflow-hidden bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={file.language}
                  value={file.code}
                  theme="vs-dark"
                  onChange={(value) => {
                    if (file.editable && value !== undefined) {
                      if (file.tab === 'jsx' && onJsCodeChange) {
                        onJsCodeChange(value);
                      } else if (file.tab === 'css' && onCssCodeChange) {
                        onCssCodeChange(value);
                      }
                    }
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: !file.editable,
                    wordWrap: 'on',
                  }}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
