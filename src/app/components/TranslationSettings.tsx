import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Languages, Globe, MousePointer } from "lucide-react";
import { Badge } from "./ui/badge";

interface TranslationSettingsProps {
  settings: {
    enableClickToTranslate: boolean;
    autoDetectLanguage: boolean;
    defaultLanguage: string;
    enabledLanguages: string[];
  };
  onChange: (key: string, value: any) => void;
}

const availableLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
];

export function TranslationSettings({ settings, onChange }: TranslationSettingsProps) {
  const toggleLanguage = (code: string) => {
    const enabled = settings.enabledLanguages.includes(code);
    if (enabled) {
      onChange(
        "enabledLanguages",
        settings.enabledLanguages.filter((lang) => lang !== code)
      );
    } else {
      onChange("enabledLanguages", [...settings.enabledLanguages, code]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Languages className="size-5" />
        <h3>Translation Configuration</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <MousePointer className="size-4" />
              <Label htmlFor="enableClickToTranslate">Click to Translate</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Click any message to translate it
            </p>
          </div>
          <Switch
            id="enableClickToTranslate"
            checked={settings.enableClickToTranslate}
            onCheckedChange={(checked) => onChange("enableClickToTranslate", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Globe className="size-4" />
              <Label htmlFor="autoDetectLanguage">Auto-Detect Language</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically detect message language
            </p>
          </div>
          <Switch
            id="autoDetectLanguage"
            checked={settings.autoDetectLanguage}
            onCheckedChange={(checked) => onChange("autoDetectLanguage", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultLanguage">Default Language</Label>
          <Select
            value={settings.defaultLanguage}
            onValueChange={(value) => onChange("defaultLanguage", value)}
          >
            <SelectTrigger id="defaultLanguage">
              <SelectValue placeholder="Select default language" />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <Label>Enabled Languages</Label>
          <p className="text-sm text-muted-foreground">
            Select languages available for translation
          </p>
          <div className="grid grid-cols-2 gap-3">
            {availableLanguages.map((lang) => {
              const isEnabled = settings.enabledLanguages.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border transition-all
                    ${
                      isEnabled
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/30 border-muted hover:border-muted-foreground/30"
                    }
                  `}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{lang.name}</p>
                    <p className="text-xs text-muted-foreground">{lang.code}</p>
                  </div>
                  {isEnabled && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {settings.enableClickToTranslate && (
        <div className="p-4 bg-muted/30 rounded-lg border">
          <h4 className="font-medium mb-2">Translation Preview</h4>
          <div className="space-y-2">
            <div className="p-3 bg-background rounded border">
              <p className="text-sm mb-1">
                <span className="font-medium">User:</span> Hello, how are you?
              </p>
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                <Languages className="size-3" />
                Click to translate
              </button>
            </div>
            <div className="p-3 bg-background rounded border">
              <p className="text-sm mb-1">
                <span className="font-medium">Usuario:</span> Hola, ¿cómo estás?
              </p>
              <p className="text-xs text-muted-foreground">
                🇪🇸 Translated from Spanish
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
