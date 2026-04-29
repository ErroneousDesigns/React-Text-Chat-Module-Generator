import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Users, Lock, Globe, Eye } from "lucide-react";

interface RoomSettingsProps {
  settings: {
    roomName: string;
    roomDescription: string;
    maxUsers: number;
    isPrivate: boolean;
    requireApproval: boolean;
    slowMode: number;
    allowGuests: boolean;
    roomCategory: string;
  };
  onChange: (key: string, value: any) => void;
}

export function RoomSettings({ settings, onChange }: RoomSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roomName">Room Name</Label>
          <Input
            id="roomName"
            value={settings.roomName}
            onChange={(e) => onChange("roomName", e.target.value)}
            placeholder="Enter room name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomDescription">Room Description</Label>
          <Textarea
            id="roomDescription"
            value={settings.roomDescription}
            onChange={(e) => onChange("roomDescription", e.target.value)}
            placeholder="Describe chat room"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomCategory">Category</Label>
          <Select
            value={settings.roomCategory}
            onValueChange={(value) => onChange("roomCategory", value)}
          >
            <SelectTrigger id="roomCategory">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Maximum Users: {settings.maxUsers}</Label>
          <Slider
            value={[settings.maxUsers]}
            onValueChange={(value) => onChange("maxUsers", value[0])}
            min={2}
            max={1000}
            step={1}
            className="w-full"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>{settings.maxUsers} users maximum</span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock className="size-4" />
                <Label htmlFor="isPrivate">Private Room</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Room requires invitation to join
              </p>
            </div>
            <Switch
              id="isPrivate"
              checked={settings.isPrivate}
              onCheckedChange={(checked) => onChange("isPrivate", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Eye className="size-4" />
                <Label htmlFor="requireApproval">Require Approval</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Moderators must approve new members
              </p>
            </div>
            <Switch
              id="requireApproval"
              checked={settings.requireApproval}
              onCheckedChange={(checked) => onChange("requireApproval", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Globe className="size-4" />
                <Label htmlFor="allowGuests">Allow Guests</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Guests can join without an account
              </p>
            </div>
            <Switch
              id="allowGuests"
              checked={settings.allowGuests}
              onCheckedChange={(checked) => onChange("allowGuests", checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Slow Mode: {settings.slowMode}s</Label>
          <Slider
            value={[settings.slowMode]}
            onValueChange={(value) => onChange("slowMode", value[0])}
            min={0}
            max={120}
            step={5}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            {settings.slowMode === 0
              ? "Disabled"
              : `Participants must wait ${settings.slowMode}s between messages`}
          </p>
        </div>
      </div>
    </div>
  );
}
