import { useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Type, User, Plus } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";

interface FontCustomizationProps {
  settings: {
    enableCustomFonts: boolean;
    enableCustomUsernameFonts: boolean;
    globalFont: string;
    globalFontSize: number;
    usernameFont: string;
    usernameFontSize: number;
    messageColor: string;
    usernameColor: string;
    customUserFonts: Array<{ username: string; font: string; color: string }>;
  };
  onChange: (key: string, value: any) => void;
}

const availableFonts = [
  { value: "inter", name: "Inter", style: "font-sans" },
  { value: "roboto", name: "Roboto", style: "font-sans" },
  { value: "arial", name: "Arial", style: "font-sans" },
  { value: "georgia", name: "Georgia", style: "font-serif" },
  { value: "times", name: "Times New Roman", style: "font-serif" },
  { value: "courier", name: "Courier New", style: "font-mono" },
  { value: "comic", name: "Comic Sans MS", style: "" },
  { value: "impact", name: "Impact", style: "" },
  { value: "verdana", name: "Verdana", style: "font-sans" },
  { value: "trebuchet", name: "Trebuchet MS", style: "font-sans" },
];

export function FontCustomization({ settings, onChange }: FontCustomizationProps) {
  const [showUserFontDialog, setShowUserFontDialog] = useState(false);
  const [newUserFont, setNewUserFont] = useState({
    username: "",
    font: "inter",
    color: "#000000",
  });

  const addCustomUserFont = () => {
    if (newUserFont.username.trim()) {
      onChange("customUserFonts", [...settings.customUserFonts, { ...newUserFont }]);
      setNewUserFont({ username: "", font: "inter", color: "#000000" });
      setShowUserFontDialog(false);
    }
  };

  const removeCustomUserFont = (username: string) => {
    onChange(
      "customUserFonts",
      settings.customUserFonts.filter((u) => u.username !== username)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Type className="size-5" />
        <h3>Font Customization</h3>
      </div>

      <div className="space-y-4">
        {/* Global Font Settings */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableCustomFonts">Enable Custom Fonts</Label>
            <p className="text-sm text-muted-foreground">
              Allow custom font styling in messages
            </p>
          </div>
          <Switch
            id="enableCustomFonts"
            checked={settings.enableCustomFonts}
            onCheckedChange={(checked) => onChange("enableCustomFonts", checked)}
          />
        </div>

        {settings.enableCustomFonts && (
          <>
            <div className="space-y-2">
              <Label htmlFor="globalFont">Global Message Font</Label>
              <Select
                value={settings.globalFont}
                onValueChange={(value) => onChange("globalFont", value)}
              >
                <SelectTrigger id="globalFont">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span className={font.style}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message Font Size: {settings.globalFontSize}px</Label>
              <Slider
                value={[settings.globalFontSize]}
                onValueChange={(value) => onChange("globalFontSize", value[0])}
                min={10}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Message Text Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground">
                    <div
                      className="size-6 rounded border"
                      style={{ backgroundColor: settings.messageColor }}
                    />
                    {settings.messageColor}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <HexColorPicker
                    color={settings.messageColor}
                    onChange={(color) => onChange("messageColor", color)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        {/* Username Font Settings */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <Label htmlFor="enableCustomUsernameFonts">Custom Username Fonts</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable customized fonts for usernames
              </p>
            </div>
            <Switch
              id="enableCustomUsernameFonts"
              checked={settings.enableCustomUsernameFonts}
              onCheckedChange={(checked) => onChange("enableCustomUsernameFonts", checked)}
            />
          </div>

          {settings.enableCustomUsernameFonts && (
            <>
              <div className="space-y-2 mb-4">
                <Label htmlFor="usernameFont">Default Username Font</Label>
                <Select
                  value={settings.usernameFont}
                  onValueChange={(value) => onChange("usernameFont", value)}
                >
                  <SelectTrigger id="usernameFont">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFonts.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={font.style}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mb-4">
                <Label>Username Font Size: {settings.usernameFontSize}px</Label>
                <Slider
                  value={[settings.usernameFontSize]}
                  onValueChange={(value) => onChange("usernameFontSize", value[0])}
                  min={10}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 mb-4">
                <Label>Username Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <div
                        className="size-6 rounded border"
                        style={{ backgroundColor: settings.usernameColor }}
                      />
                      {settings.usernameColor}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <HexColorPicker
                      color={settings.usernameColor}
                      onChange={(color) => onChange("usernameColor", color)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Custom User-Specific Fonts */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label>User-Specific Fonts</Label>
                  <Button
                    size="sm"
                    onClick={() => setShowUserFontDialog(!showUserFontDialog)}
                  >
                    <Plus className="size-4 mr-1" />
                    Add User Font
                  </Button>
                </div>

                {showUserFontDialog && (
                  <div className="p-4 border rounded-lg space-y-3">
                    <Input
                      placeholder="Username"
                      value={newUserFont.username}
                      onChange={(e) =>
                        setNewUserFont({ ...newUserFont, username: e.target.value })
                      }
                    />
                    <Select
                      value={newUserFont.font}
                      onValueChange={(value) =>
                        setNewUserFont({ ...newUserFont, font: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFonts.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <div
                            className="size-6 rounded border"
                            style={{ backgroundColor: newUserFont.color }}
                          />
                          {newUserFont.color}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <HexColorPicker
                          color={newUserFont.color}
                          onChange={(color) =>
                            setNewUserFont({ ...newUserFont, color })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex gap-2">
                      <Button onClick={addCustomUserFont} className="flex-1">
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowUserFontDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <ScrollArea className="h-[200px] border rounded-lg">
                  <div className="p-4 space-y-2">
                    {settings.customUserFonts.map((userFont) => (
                      <div
                        key={userFont.username}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="size-4 rounded"
                            style={{ backgroundColor: userFont.color }}
                          />
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: userFont.color }}
                            >
                              {userFont.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {availableFonts.find((f) => f.value === userFont.font)?.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomUserFont(userFont.username)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    {settings.customUserFonts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No customized fonts configured
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Font Preview */}
      {settings.enableCustomFonts && (
        <div className="p-4 bg-muted/30 rounded-lg border">
          <h4 className="font-medium mb-3">Font Preview</h4>
          <div className="space-y-2">
            <div className="p-3 bg-background rounded border">
              <p
                style={{
                  fontFamily: settings.usernameFont,
                  fontSize: `${settings.usernameFontSize}px`,
                  color: settings.usernameColor,
                }}
              >
                Username
              </p>
              <p
                style={{
                  fontFamily: settings.globalFont,
                  fontSize: `${settings.globalFontSize}px`,
                  color: settings.messageColor,
                }}
              >
                Sample message with custom font styling.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}