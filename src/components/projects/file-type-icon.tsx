import {
  FileText,
  Image as ImageIcon,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Music,
  Video,
  File as FileIcon,
  FileType,
  Database,
  Zap,
  Globe,
  Palette,
  Cpu,
  BookOpen,
  FileVideo,
  FileAudio,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTypeIconProps {
  fileName: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBackground?: boolean;
}

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

export function getFileType(fileName: string): string {
  const extension = getFileExtension(fileName);

  // Document types
  if (["txt", "doc", "docx", "rtf", "odt"].includes(extension)) return "document";
  if (["pdf"].includes(extension)) return "pdf";
  if (["xls", "xlsx", "csv", "ods"].includes(extension)) return "spreadsheet";
  if (["ppt", "pptx", "odp"].includes(extension)) return "presentation";

  // Image types
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico"].includes(extension)) return "image";

  // Video types
  if (["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "m4v"].includes(extension)) return "video";

  // Audio types
  if (["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"].includes(extension)) return "audio";

  // Archive types
  if (["zip", "rar", "7z", "tar", "gz", "bz2", "xz"].includes(extension)) return "archive";

  // Code types
  if ([
    "js", "jsx", "ts", "tsx", "html", "css", "scss", "sass", "less",
    "py", "java", "cpp", "c", "cs", "php", "rb", "go", "rs", "swift",
    "kt", "dart", "vue", "svelte", "json", "xml", "yaml", "yml",
    "sql", "sh", "bat", "ps1", "md", "mdx"
  ].includes(extension)) return "code";

  // Database types
  if (["db", "sqlite", "mdb", "accdb"].includes(extension)) return "database";

  // Executable/Application types
  if (["exe", "msi", "app", "deb", "rpm", "dmg", "pkg"].includes(extension)) return "executable";

  // Font types
  if (["ttf", "otf", "woff", "woff2", "eot"].includes(extension)) return "font";

  // 3D/CAD types
  if (["obj", "fbx", "dae", "3ds", "blend", "dwg", "dxf"].includes(extension)) return "3d";

  return "unknown";
}

const fileTypeConfig = {
  document: {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200"
  },
  pdf: {
    icon: FileType,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200"
  },
  spreadsheet: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200"
  },
  presentation: {
    icon: Presentation,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200"
  },
  image: {
    icon: ImageIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200"
  },
  video: {
    icon: FileVideo,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200"
  },
  audio: {
    icon: FileAudio,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-200"
  },
  archive: {
    icon: Package,
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200"
  },
  code: {
    icon: FileCode,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200"
  },
  database: {
    icon: Database,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200"
  },
  executable: {
    icon: Cpu,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200"
  },
  font: {
    icon: Palette,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
    borderColor: "border-rose-200"
  },
  "3d": {
    icon: Zap,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    borderColor: "border-cyan-200"
  },
  unknown: {
    icon: FileIcon,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-muted"
  }
};

const sizeConfig = {
  sm: {
    icon: "w-3 h-3",
    container: "w-6 h-6",
    padding: "p-1"
  },
  md: {
    icon: "w-4 h-4",
    container: "w-8 h-8",
    padding: "p-1.5"
  },
  lg: {
    icon: "w-5 h-5",
    container: "w-10 h-10",
    padding: "p-2"
  },
  xl: {
    icon: "w-6 h-6",
    container: "w-12 h-12",
    padding: "p-2.5"
  }
};

export function FileTypeIcon({
  fileName,
  size = "md",
  className,
  showBackground = true
}: FileTypeIconProps) {
  const fileType = getFileType(fileName);
  const config = fileTypeConfig[fileType as keyof typeof fileTypeConfig];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  if (showBackground) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border",
          config.bgColor,
          config.borderColor,
          sizeStyles.container,
          sizeStyles.padding,
          className
        )}
      >
        <Icon className={cn(sizeStyles.icon, config.color)} />
      </div>
    );
  }

  return <Icon className={cn(sizeStyles.icon, config.color, className)} />;
}

// Helper component for displaying file type with extension
interface FileTypeWithExtensionProps extends FileTypeIconProps {
  showExtension?: boolean;
  extensionPosition?: "right" | "bottom";
}

export function FileTypeWithExtension({
  fileName,
  size = "md",
  showExtension = true,
  extensionPosition = "right",
  className,
  showBackground = true
}: FileTypeWithExtensionProps) {
  const extension = getFileExtension(fileName);

  if (!showExtension) {
    return (
      <FileTypeIcon
        fileName={fileName}
        size={size}
        className={className}
        showBackground={showBackground}
      />
    );
  }

  const isVertical = extensionPosition === "bottom";

  return (
    <div
      className={cn(
        "flex items-center",
        isVertical ? "flex-col gap-1" : "gap-2",
        className
      )}
    >
      <FileTypeIcon
        fileName={fileName}
        size={size}
        showBackground={showBackground}
      />
      <span className="text-xs font-mono text-muted-foreground uppercase">
        {extension}
      </span>
    </div>
  );
}

// Batch component for multiple file types
interface FileTypeGroupProps {
  files: string[];
  maxShow?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showBackground?: boolean;
  className?: string;
}

export function FileTypeGroup({
  files,
  maxShow = 5,
  size = "sm",
  showBackground = true,
  className
}: FileTypeGroupProps) {
  const visibleFiles = files.slice(0, maxShow);
  const hiddenCount = files.length - maxShow;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-1">
        {visibleFiles.map((fileName, index) => (
          <div key={index} className="ring-2 ring-background rounded-lg">
            <FileTypeIcon
              fileName={fileName}
              size={size}
              showBackground={showBackground}
            />
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <div className="ml-2 text-xs text-muted-foreground">
          +{hiddenCount}
        </div>
      )}
    </div>
  );
}

// Stats component showing file type distribution
interface FileTypeStatsProps {
  files: string[];
  className?: string;
}

export function FileTypeStats({ files, className }: FileTypeStatsProps) {
  const typeGroups = files.reduce((acc, fileName) => {
    const fileType = getFileType(fileName);
    acc[fileType] = (acc[fileType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedTypes = Object.entries(typeGroups)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6); // Show top 6 types

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sortedTypes.map(([fileType, count]) => {
        const config = fileTypeConfig[fileType as keyof typeof fileTypeConfig];
        const Icon = config.icon;

        return (
          <div
            key={fileType}
            className="flex items-center gap-1 px-2 py-1 rounded-md border bg-muted/30"
          >
            <Icon className={cn("w-3 h-3", config.color)} />
            <span className="text-xs font-medium capitalize">
              {fileType.replace("_", " ")}
            </span>
            <span className="text-xs text-muted-foreground">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}