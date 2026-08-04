export type ToolCategory = "json" | "encoding" | "code" | "security" | "time" | "colors";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string; // Lucide icon name
  badge?: string;
  keywords: string[];
  isPopular?: boolean;
  pageTitle?: string;
  metaDescription?: string;
}

export type JsonViewMode = "formatted" | "tree" | "minified" | "yaml" | "csv" | "xml";

export interface JsonTreeNode {
  key: string;
  value: any;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  path: string;
  children?: JsonTreeNode[];
  itemCount?: number;
}

export type DiffChangeType = "added" | "removed" | "modified" | "unchanged";

export interface JsonDiffResult {
  path: string;
  type: DiffChangeType;
  oldValue?: any;
  newValue?: any;
}

export interface TextDiffLine {
  lineNumberA?: number;
  lineNumberB?: number;
  type: "added" | "removed" | "unchanged" | "modified";
  contentA?: string;
  contentB?: string;
}

export interface JwtParsed {
  raw: string;
  header: Record<string, any> | null;
  payload: Record<string, any> | null;
  signature: string;
  isValid: boolean;
  error?: string;
  issuedAt?: string;
  expiresAt?: string;
  isExpired?: boolean;
  expiresInSeconds?: number;
}

export interface RegexMatchResult {
  match: string;
  index: number;
  groups: string[];
  namedGroups?: Record<string, string>;
}

export interface HashResult {
  algorithm: string;
  hash: string;
}

export interface CronParseResult {
  expression: string;
  isValid: boolean;
  error?: string;
  description?: string;
  nextDates?: string[];
}
