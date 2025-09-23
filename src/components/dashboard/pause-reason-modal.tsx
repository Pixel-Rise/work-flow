import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-language";
import { Clock, Coffee, Utensils, Phone, Heart, AlertCircle } from "lucide-react";

interface PauseReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, customNote?: string) => void;
}

const pauseReasons = [
  { id: "break", icon: Coffee, color: "text-amber-600" },
  { id: "lunch", icon: Utensils, color: "text-orange-600" },
  { id: "meeting", icon: Clock, color: "text-blue-600" },
  { id: "phone_call", icon: Phone, color: "text-green-600" },
  { id: "personal", icon: Heart, color: "text-pink-600" },
  { id: "other", icon: AlertCircle, color: "text-gray-600" },
];

export function PauseReasonModal({ open, onOpenChange, onConfirm }: PauseReasonModalProps) {
  const t = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customNote, setCustomNote] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState<string>("15");

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason, customNote);
    setSelectedReason("");
    setCustomNote("");
    setEstimatedDuration("15");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedReason("");
    setCustomNote("");
    setEstimatedDuration("15");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            {t("pause_work")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("select_reason")}</Label>
            <div className="grid grid-cols-2 gap-2">
              {pauseReasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <div
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`
                      flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all
                      ${selectedReason === reason.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                      }
                    `}
                  >
                    <Icon className={`w-6 h-6 ${reason.color}`} />
                    <span className="text-sm font-medium">{t(reason.id)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("estimated_duration")}</Label>
            <Select value={estimatedDuration} onValueChange={setEstimatedDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 {t("minutes")}</SelectItem>
                <SelectItem value="15">15 {t("minutes")}</SelectItem>
                <SelectItem value="30">30 {t("minutes")}</SelectItem>
                <SelectItem value="60">1 {t("hour")}</SelectItem>
                <SelectItem value="120">2 {t("hours")}</SelectItem>
                <SelectItem value="custom">{t("custom")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {estimatedDuration === "custom" && (
            <div className="space-y-2">
              <Label>{t("custom_duration_minutes")}</Label>
              <Input
                type="number"
                placeholder="30"
                min="1"
                max="480"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{t("additional_notes")} ({t("optional")})</Label>
            <Textarea
              placeholder={t("add_note_about_pause")}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedReason}
            >
              {t("start_pause")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}