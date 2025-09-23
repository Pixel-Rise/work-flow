import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/use-language";
import {
  Download,
  ExternalLink,
  Eye,
  X,
  FileText,
  Image as ImageIcon,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Music,
  Video,
  File as FileIcon,
  Calendar,
  User,
  HardDrive,
  Share2,
  Edit,
  Trash2,
  Copy
} from "lucide-react";
import { FileTypeIcon, getFileExtension, getFileType } from "./file-type-icon";

interface DocumentData {
  id: number;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadDate: string;
  uploadedBy: string;
  description?: string;
  tags?: string[];
  version?: string;
  isShared?: boolean;
  downloadCount?: number;
  lastModified?: string;
}

interface DocumentPreviewProps {
  document: DocumentData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (document: DocumentData) => void;
  onEdit?: (document: DocumentData) => void;
  onDelete?: (document: DocumentData) => void;
  onShare?: (document: DocumentData) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function DocumentPreview({
  document,
  open,
  onOpenChange,
  onDownload,
  onEdit,
  onDelete,
  onShare,
  canEdit = false,
  canDelete = false
}: DocumentPreviewProps) {
  const t = useTranslation();
  const [imageError, setImageError] = useState(false);

  if (!document) return null;

  const fileType = getFileType(document.name);
  const extension = getFileExtension(document.name);

  const isImage = fileType === "image";
  const isPDF = extension === "pdf";
  const isText = fileType === "text" || ["txt", "md", "json", "xml"].includes(extension);
  const isCode = fileType === "code";

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document);
    } else {
      // Default download behavior
      const link = window.document.createElement("a");
      link.href = document.url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleExternalOpen = () => {
    window.open(document.url, "_blank");
  };

  const formatFileSize = (size: string) => {
    // If size is already formatted, return as is
    if (size.includes("MB") || size.includes("KB") || size.includes("GB")) {
      return size;
    }

    // Convert bytes to readable format
    const bytes = parseInt(size);
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <FileTypeIcon fileName={document.name} size="lg" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg font-medium truncate">
                  {document.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {extension.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(document.size)}
                  </span>
                  {document.version && (
                    <Badge variant="outline" className="text-xs">
                      v{document.version}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                title={t("download")}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExternalOpen}
                title={t("open_in_new_tab")}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare(document)}
                  title={t("share")}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              {canEdit && onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(document)}
                  title={t("edit")}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {canDelete && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(document)}
                  title={t("delete")}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Preview Area */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">
                {t("preview")}
              </h3>

              <div className="border rounded-lg overflow-hidden bg-muted/20 min-h-96 flex items-center justify-center">
                {isImage && !imageError ? (
                  <img
                    src={document.url}
                    alt={document.name}
                    className="max-w-full max-h-96 object-contain"
                    onError={() => setImageError(true)}
                  />
                ) : isPDF ? (
                  <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm font-medium">{t("pdf_preview")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("click_open_external")}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExternalOpen}
                        className="mt-2"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t("open_pdf")}
                      </Button>
                    </div>
                  </div>
                ) : isText || isCode ? (
                  <div className="text-center space-y-4">
                    <FileCode className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm font-medium">{t("text_file_preview")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("click_open_external")}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExternalOpen}
                        className="mt-2"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t("open_file")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <FileIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm font-medium">{t("no_preview_available")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("download_to_view")}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="mt-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t("download")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Document Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">
                  {t("document_details")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        {t("uploaded")}
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(document.uploadDate)}
                      </div>
                    </div>
                  </div>

                  {document.lastModified && (
                    <div className="flex items-start gap-2">
                      <Edit className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">
                          {t("last_modified")}
                        </div>
                        <div className="text-sm font-medium">
                          {formatDate(document.lastModified)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        {t("uploaded_by")}
                      </div>
                      <div className="text-sm font-medium">
                        {document.uploadedBy}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <HardDrive className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        {t("file_size")}
                      </div>
                      <div className="text-sm font-medium">
                        {formatFileSize(document.size)}
                      </div>
                    </div>
                  </div>

                  {document.downloadCount !== undefined && (
                    <div className="flex items-start gap-2">
                      <Download className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">
                          {t("downloads")}
                        </div>
                        <div className="text-sm font-medium">
                          {document.downloadCount}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {document.description && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    {t("description")}
                  </h3>
                  <p className="text-sm text-foreground">
                    {document.description}
                  </p>
                </div>
              )}

              {document.tags && document.tags.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    {t("tags")}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  {t("actions")}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("download")}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(document.url);
                      // Toast success message would go here
                    }}
                    className="justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {t("copy_link")}
                  </Button>

                  {onShare && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onShare(document)}
                      className="justify-start"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {t("share")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}