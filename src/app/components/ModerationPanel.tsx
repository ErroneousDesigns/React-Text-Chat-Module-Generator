import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Shield, Ban, UserX, Clock, MapPin, Trash2, Search } from "lucide-react";

interface ModerationPanelProps {
  settings: {
    enableIPLogging: boolean;
    enableProfanityFilter: boolean;
    enableSpamFilter: boolean;
    maxMessageLength: number;
    bannedWords: string[];
  };
  onChange: (key: string, value: any) => void;
}

// Mock IP log data
const mockIPLogs = [
  {
    id: 1,
    username: "user123",
    ip: "192.168.1.105",
    timestamp: "2026-03-16 14:23:45",
    action: "Joined room",
    status: "active",
  },
  {
    id: 2,
    username: "moderator_sam",
    ip: "10.0.0.52",
    timestamp: "2026-03-16 14:20:12",
    action: "Sent message",
    status: "active",
  },
  {
    id: 3,
    username: "guest_5892",
    ip: "172.16.0.88",
    timestamp: "2026-03-16 14:18:33",
    action: "Banned for spam",
    status: "banned",
  },
  {
    id: 4,
    username: "alice_wonder",
    ip: "192.168.1.201",
    timestamp: "2026-03-16 14:15:07",
    action: "Message deleted",
    status: "warned",
  },
];

const mockBannedUsers = [
  { id: 1, username: "spammer99", reason: "Repeated spam", bannedAt: "2026-03-15" },
  { id: 2, username: "troll_account", reason: "Harassment", bannedAt: "2026-03-14" },
  { id: 3, username: "bot_suspicious", reason: "Automated messages", bannedAt: "2026-03-13" },
];

export function ModerationPanel({ settings, onChange }: ModerationPanelProps) {
  const [newBannedWord, setNewBannedWord] = useState("");
  const [searchIP, setSearchIP] = useState("");

  const addBannedWord = () => {
    if (newBannedWord.trim() && !settings.bannedWords.includes(newBannedWord.trim())) {
      onChange("bannedWords", [...settings.bannedWords, newBannedWord.trim()]);
      setNewBannedWord("");
    }
  };

  const removeBannedWord = (word: string) => {
    onChange(
      "bannedWords",
      settings.bannedWords.filter((w) => w !== word)
    );
  };

  const filteredLogs = searchIP
    ? mockIPLogs.filter(
        (log) =>
          log.ip.includes(searchIP) ||
          log.username.toLowerCase().includes(searchIP.toLowerCase())
      )
    : mockIPLogs;

  return (
    <div className="space-y-6">
      {/* Moderation Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="size-5" />
          <h3>Moderation Settings</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableIPLogging">Full IP Logging</Label>
            <p className="text-sm text-muted-foreground">
              Log all user IP addresses and actions
            </p>
          </div>
          <Switch
            id="enableIPLogging"
            checked={settings.enableIPLogging}
            onCheckedChange={(checked) => onChange("enableIPLogging", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableProfanityFilter">Profanity Filter</Label>
            <p className="text-sm text-muted-foreground">
              Automatically filter inappropriate language
            </p>
          </div>
          <Switch
            id="enableProfanityFilter"
            checked={settings.enableProfanityFilter}
            onCheckedChange={(checked) => onChange("enableProfanityFilter", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableSpamFilter">Spam Filter</Label>
            <p className="text-sm text-muted-foreground">
              Detect and prevent spam messages
            </p>
          </div>
          <Switch
            id="enableSpamFilter"
            checked={settings.enableSpamFilter}
            onCheckedChange={(checked) => onChange("enableSpamFilter", checked)}
          />
        </div>
      </div>

      {/* Banned Words */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Ban className="size-5" />
          <h3>Banned Words</h3>
        </div>

        <div className="flex gap-2">
          <Input
            value={newBannedWord}
            onChange={(e) => setNewBannedWord(e.target.value)}
            placeholder="Add word to ban list"
            onKeyPress={(e) => e.key === "Enter" && addBannedWord()}
          />
          <Button onClick={addBannedWord}>Add</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {settings.bannedWords.map((word) => (
            <Badge key={word} variant="secondary" className="gap-2">
              {word}
              <button
                onClick={() => removeBannedWord(word)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          {settings.bannedWords.length === 0 && (
            <p className="text-sm text-muted-foreground">No banned words set</p>
          )}
        </div>
      </div>

      {/* IP Logs */}
      {settings.enableIPLogging && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <MapPin className="size-5" />
            <h3>IP Activity Logs</h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchIP}
              onChange={(e) => setSearchIP(e.target.value)}
              placeholder="Search by IP or username..."
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[300px] border rounded-lg">
            <div className="p-4 space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.username}</span>
                      <Badge
                        variant={
                          log.status === "banned"
                            ? "destructive"
                            : log.status === "warned"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {log.ip}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{log.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Banned Users */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <UserX className="size-5" />
          <h3>Banned Users</h3>
        </div>

        <ScrollArea className="h-[200px] border rounded-lg">
          <div className="p-4 space-y-3">
            {mockBannedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.reason}</p>
                  <p className="text-xs text-muted-foreground">Banned: {user.bannedAt}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
