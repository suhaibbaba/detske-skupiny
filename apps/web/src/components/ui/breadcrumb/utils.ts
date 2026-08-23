import { FOLDER_LABELS } from "@/components/ui/breadcrumb/constants";

export const formatSegment = (segment: string): string => {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getFolderLabel = (segment: string, locale: string): string => {
  return FOLDER_LABELS[segment]?.[locale] || formatSegment(segment);
};
