import { useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Smile, Image, Sparkles, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface EmojiGifSettingsProps {
  settings: {
    enableEmojis: boolean;
    enableGifs: boolean;
    enableCustomEmojis: boolean;
    emojiSize: number;
    gifSize: number;
    gifOverlayPosition: string;
    gifOverlayOpacity: number;
    maxGifsPerMessage: number;
    enableEmojiReactions: boolean;
  };
  onChange: (key: string, value: any) => void;
}

const mockGifs = [
  "https://media.giphy.com/media/3oz8xLd9DJq2l2VFtu/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif",
  "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/26FPy3QZQqGtDcrja/giphy.gif",
];

export function EmojiGifSettings({ settings, onChange }: EmojiGifSettingsProps) {
  const [selectedEmoji, setSelectedEmoji] = useState("😀");
  const [gifSearch, setGifSearch] = useState("");

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="emoji" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="emoji">
            <Smile className="size-4 mr-2" />
            Emojis
          </TabsTrigger>
          <TabsTrigger value="gifs">
            <Image className="size-4 mr-2" />
            GIFs & Overlays
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emoji" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableEmojis">Enable Emojis</Label>
                <p className="text-sm text-muted-foreground">
                  Allow emojis in messages
                </p>
              </div>
              <Switch
                id="enableEmojis"
                checked={settings.enableEmojis}
                onCheckedChange={(checked) => onChange("enableEmojis", checked)}
              />
            </div>

            {settings.enableEmojis && (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableEmojiReactions">Emoji Reactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow reactions to messages with emojis
                    </p>
                  </div>
                  <Switch
                    id="enableEmojiReactions"
                    checked={settings.enableEmojiReactions}
                    onCheckedChange={(checked) =>
                      onChange("enableEmojiReactions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableCustomEmojis">Custom Emojis</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow upload of custom emoji images
                    </p>
                  </div>
                  <Switch
                    id="enableCustomEmojis"
                    checked={settings.enableCustomEmojis}
                    onCheckedChange={(checked) => onChange("enableCustomEmojis", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Emoji Display Size: {settings.emojiSize}px</Label>
                  <Slider
                    value={[settings.emojiSize]}
                    onValueChange={(value) => onChange("emojiSize", value[0])}
                    min={16}
                    max={64}
                    step={4}
                    className="w-full"
                  />
                  <div className="flex gap-2 items-center">
                    <span style={{ fontSize: `${settings.emojiSize}px` }}>
                      {selectedEmoji}
                    </span>
                    <span className="text-sm text-muted-foreground">Preview</span>
                  </div>
                </div>

                {/* Emoji Picker */}
                <div className="space-y-2 pt-4 border-t">
                  <Label>Emoji Picker</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Full range of emojis available to users
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground">
                        <Smile className="size-4" />
                        Open Emoji Picker
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0" align="start">
                      <EmojiPicker onEmojiClick={onEmojiClick} width={350} height={400} />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Recently Used Emojis */}
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <h4 className="font-medium mb-3">Popular Emojis</h4>
                  <div className="grid grid-cols-8 gap-2">
                    {["😀", "😂", "❤️", "👍", "🎉", "🔥", "💯", "✨", "👀", "🙌", "💪", "🎊", "🎈", "⭐", "💖", "🌟"].map(
                      (emoji) => (
                        <button
                          key={emoji}
                          className="text-2xl hover:scale-125 transition-transform p-2 hover:bg-muted rounded"
                          onClick={() => setSelectedEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gifs" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableGifs">Enable GIFs</Label>
                <p className="text-sm text-muted-foreground">
                  Allow the sending of GIF images
                </p>
              </div>
              <Switch
                id="enableGifs"
                checked={settings.enableGifs}
                onCheckedChange={(checked) => onChange("enableGifs", checked)}
              />
            </div>

            {settings.enableGifs && (
              <>
                <div className="space-y-2">
                  <Label>GIF Display Size: {settings.gifSize}px</Label>
                  <Slider
                    value={[settings.gifSize]}
                    onValueChange={(value) => onChange("gifSize", value[0])}
                    min={100}
                    max={500}
                    step={25}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max GIFs per Message: {settings.maxGifsPerMessage}</Label>
                  <Slider
                    value={[settings.maxGifsPerMessage]}
                    onValueChange={(value) => onChange("maxGifsPerMessage", value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5" />
                    <Label>GIF Overlay Settings</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure overlay GIF positioning and appearance
                  </p>

                  <div className="space-y-2 mt-3">
                    <Label htmlFor="gifOverlayPosition">Overlay Position</Label>
                    <Select
                      value={settings.gifOverlayPosition}
                      onValueChange={(value) => onChange("gifOverlayPosition", value)}
                    >
                      <SelectTrigger id="gifOverlayPosition">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="background">Full Background</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Overlay Opacity: {settings.gifOverlayOpacity}%</Label>
                    <Slider
                      value={[settings.gifOverlayOpacity]}
                      onValueChange={(value) => onChange("gifOverlayOpacity", value[0])}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* GIF Browser */}
                <div className="space-y-3 pt-4 border-t">
                  <Label>GIF Library</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={gifSearch}
                      onChange={(e) => setGifSearch(e.target.value)}
                      placeholder="Search GIFs..."
                      className="pl-9"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {mockGifs.map((gif, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border hover:ring-2 hover:ring-primary cursor-pointer group"
                        style={{
                          opacity: settings.gifOverlayOpacity / 100,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="size-8 text-white opacity-70" />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overlay Preview */}
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <h4 className="font-medium mb-3">Overlay Preview</h4>
                  <div className="relative h-48 bg-background rounded-lg overflow-hidden border">
                    <div className="absolute inset-0 p-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="size-8 rounded-full bg-primary/20" />
                          <div className="flex-1 bg-muted rounded-lg p-2">
                            <p className="text-sm">Sample chat message</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`
                        absolute size-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg
                        ${settings.gifOverlayPosition === "top-left" && "top-2 left-2"}
                        ${settings.gifOverlayPosition === "top-right" && "top-2 right-2"}
                        ${settings.gifOverlayPosition === "bottom-left" && "bottom-2 left-2"}
                        ${settings.gifOverlayPosition === "bottom-right" && "bottom-2 right-2"}
                        ${settings.gifOverlayPosition === "center" && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}
                        ${settings.gifOverlayPosition === "background" && "inset-0 size-full"}
                      `}
                      style={{ opacity: settings.gifOverlayOpacity / 100 }}
                    >
                      <div className="flex items-center justify-center h-full">
                        <Sparkles className="size-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}