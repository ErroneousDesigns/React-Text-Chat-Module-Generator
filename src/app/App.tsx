import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { RoomSettings } from "./components/RoomSettings";
import { ModerationPanel } from "./components/ModerationPanel";
import { TranslationSettings } from "./components/TranslationSettings";
import { FontCustomization } from "./components/FontCustomization";
import { EmojiGifSettings } from "./components/EmojiGifSettings";
import { CodeViewer } from "./components/CodeViewer";
import { LivePreview } from "./components/LivePreview";
import { PluginExporter } from "./components/PluginExporter";
import { generateWidgetCode, generateCSSCode, generatePackageJson, generateReadme } from "./components/CodeGenerator";
import { Settings, Code, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function App() {
  const [roomSettings, setRoomSettings] = useState({
    roomName: "Chat Room",
    roomDescription: "Welcome to community chat",
    maxUsers: 100,
    isPrivate: false,
    requireApproval: false,
    slowMode: 0,
    allowGuests: true,
    roomCategory: "general",
  });

  const [moderationSettings, setModerationSettings] = useState({
    enableIPLogging: true,
    enableProfanityFilter: true,
    enableSpamFilter: true,
    maxMessageLength: 500,
    bannedWords: ["spam", "scam", "phishing"],
  });

  const [translationSettings, setTranslationSettings] = useState({
    enableClickToTranslate: true,
    autoDetectLanguage: true,
    defaultLanguage: "en",
    enabledLanguages: ["en", "es", "fr", "de", "ja", "zh"],
  });

  const [fontSettings, setFontSettings] = useState({
    enableCustomFonts: true,
    enableCustomUsernameFonts: true,
    globalFont: "inter",
    globalFontSize: 14,
    usernameFont: "inter",
    usernameFontSize: 14,
    messageColor: "#000000",
    usernameColor: "#6366f1",
    customUserFonts: [
      { username: "admin", font: "impact", color: "#dc2626" },
      { username: "moderator", font: "verdana", color: "#059669" },
    ],
  });

  const [emojiGifSettings, setEmojiGifSettings] = useState({
    enableEmojis: true,
    enableGifs: true,
    enableCustomEmojis: true,
    emojiSize: 24,
    gifSize: 200,
    gifOverlayPosition: "bottom-right",
    gifOverlayOpacity: 30,
    maxGifsPerMessage: 3,
    enableEmojiReactions: true,
  });

  const updateRoomSetting = (key: string, value: any) => {
    setRoomSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateModerationSetting = (key: string, value: any) => {
    setModerationSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateTranslationSetting = (key: string, value: any) => {
    setTranslationSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateFontSetting = (key: string, value: any) => {
    setFontSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateEmojiGifSetting = (key: string, value: any) => {
    setEmojiGifSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getFullConfig = () => ({
    room: roomSettings,
    moderation: moderationSettings,
    translation: translationSettings,
    fonts: fontSettings,
    emojiGif: emojiGifSettings,
  });

  const [generatedJsCode, setGeneratedJsCode] = useState('');
  const [generatedCssCode, setGeneratedCssCode] = useState('');
  const [generatedPackageJson, setGeneratedPackageJson] = useState('');
  const [generatedReadme, setGeneratedReadme] = useState('');

  useEffect(() => {
    const config = getFullConfig();
    setGeneratedJsCode(generateWidgetCode(config));
    setGeneratedCssCode(generateCSSCode(config));
    setGeneratedPackageJson(generatePackageJson());
    setGeneratedReadme(generateReadme(config));
  }, [roomSettings, moderationSettings, translationSettings, fontSettings, emojiGifSettings]);

  const handleExportZip = () => {
    toast.success("Plugin exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="size-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Text Chat Module (Plugin) Builder
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Sparkles className="size-3.5" />
                  Configure, preview, and export embeddable text chat module's for any React website
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Configuration Panel - Left Side */}
          <div className="xl:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="size-5 text-primary" />
                  <CardTitle>Module Configuration</CardTitle>
                </div>
                <CardDescription>
                  Customize your text chat module with moderation, translation, fonts, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="room" className="w-full">
                  <TabsList className="grid h-full w-full grid-cols-5 mb-6">
                    <TabsTrigger value="room">Room</TabsTrigger>
                    <TabsTrigger value="moderation">Moderation</TabsTrigger>
                    <TabsTrigger value="translation">Translation</TabsTrigger>
                    <TabsTrigger value="fonts">Fonts</TabsTrigger>
                    <TabsTrigger value="emoji">Emoji's</TabsTrigger>
                  </TabsList>

                  <ScrollArea className="h-full pr-4">
                    <TabsContent value="room" className="mt-0">
                      <RoomSettings settings={roomSettings} onChange={updateRoomSetting} />
                    </TabsContent>

                    <TabsContent value="moderation" className="mt-0">
                      <ModerationPanel
                        settings={moderationSettings}
                        onChange={updateModerationSetting}
                      />
                    </TabsContent>

                    <TabsContent value="translation" className="mt-0">
                      <TranslationSettings
                        settings={translationSettings}
                        onChange={updateTranslationSetting}
                      />
                    </TabsContent>

                    <TabsContent value="fonts" className="mt-0">
                      <FontCustomization settings={fontSettings} onChange={updateFontSetting} />
                    </TabsContent>

                    <TabsContent value="emoji" className="mt-0">
                      <EmojiGifSettings
                        settings={emojiGifSettings}
                        onChange={updateEmojiGifSetting}
                      />
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Middle and Right - Code & Preview */}
          <div className="xl:col-span-8 space-y-6">
            {/* Code Viewer */}
            <div className="h-[calc(50vh-60px)]">
              <CodeViewer
                jsCode={generatedJsCode}
                cssCode={generatedCssCode}
                packageJson={generatedPackageJson}
                readme={generatedReadme}
                onJsCodeChange={setGeneratedJsCode}
                onCssCodeChange={setGeneratedCssCode}
              />
            </div>

            {/* Live Preview and Export */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[calc(50vh-60px)]">
                <LivePreview config={getFullConfig()} />
              </div>
              <div className="lg:col-span-1">
                <PluginExporter
                  jsCode={generatedJsCode}
                  cssCode={generatedCssCode}
                  packageJson={generatedPackageJson}
                  readme={generatedReadme}
                  onExportZip={handleExportZip}
                />
              </div>
            </div>
          </div>
          </div>
        </div>

          <br></br>
          <p className="text-red-500 text-xs text-center">
            • Copyright ©{" "}
            <a
              href="http://erroneous.biz"
              target="_blank"
              className="text-black hover:text-blue-500 hover:underline"
            >
              Erroneous Designs
            </a>{" "}
            2026 • All Rights Reserved ®{" "}
            <a
              href="http://erroneous.biz"
              target="_blank"
              className="text-purple-500 hover:text-green-500 hover:underline"
            >
              Erroneous Holdings LLC
            </a>{" "}
            •<br></br>• (- Designing Your World, Your Way!™ -)
            •
          </p>

        <br></br>
      <br></br>
    </div>
  );
}
