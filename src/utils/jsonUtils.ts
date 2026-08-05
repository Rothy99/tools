import { JsonTreeNode } from "../types";

function recursivelyParseJson(val: any): any {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        return recursivelyParseJson(parsed);
      } catch (e) {
        return val;
      }
    }
    return val;
  }
  if (Array.isArray(val)) {
    return val.map((item) => recursivelyParseJson(item));
  }
  if (typeof val === "object" && val !== null) {
    const res: Record<string, any> = {};
    for (const k of Object.keys(val)) {
      res[k] = recursivelyParseJson(val[k]);
    }
    return res;
  }
  return val;
}

export function parseJsonSafe(
  raw: string,
  unescapeEmbedded: boolean = true
): { data: any; error: string | null } {
  try {
    let data = JSON.parse(raw);
    if (unescapeEmbedded) {
      data = recursivelyParseJson(data);
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Invalid JSON syntax" };
  }
}

export function formatJsonString(
  raw: string,
  indent: number | string = 2,
  unescapeEmbedded: boolean = true
): string {
  const { data, error } = parseJsonSafe(raw, unescapeEmbedded);
  if (error) throw new Error(error);
  return JSON.stringify(data, null, indent);
}

export function minifyJsonString(
  raw: string,
  unescapeEmbedded: boolean = true
): string {
  const { data, error } = parseJsonSafe(raw, unescapeEmbedded);
  if (error) throw new Error(error);
  return JSON.stringify(data);
}

export function buildJsonTree(data: any, key: string = "root", path: string = "$"): JsonTreeNode {
  if (data === null) {
    return { key, value: null, type: "null", path };
  }

  const type = Array.isArray(data) ? "array" : typeof data;

  if (type === "object" || type === "array") {
    const children: JsonTreeNode[] = [];
    const keys = Object.keys(data);

    keys.forEach((childKey) => {
      const childPath = type === "array" ? `${path}[${childKey}]` : `${path}.${childKey}`;
      children.push(buildJsonTree(data[childKey], childKey, childPath));
    });

    return {
      key,
      value: data,
      type: type as "object" | "array",
      path,
      children,
      itemCount: keys.length,
    };
  }

  return {
    key,
    value: data,
    type: type as "string" | "number" | "boolean",
    path,
  };
}

export function jsonToYaml(obj: any, indentLevel: number = 0): string {
  const indent = "  ".repeat(indentLevel);
  if (obj === null || obj === undefined) return "null\n";
  if (typeof obj === "boolean" || typeof obj === "number") return `${obj}\n`;
  if (typeof obj === "string") return `"${obj.replace(/"/g, '\\"')}"\n`;

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]\n";
    let yaml = "\n";
    obj.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        yaml += `${indent}- ${jsonToYaml(item, indentLevel + 1).trimStart()}`;
      } else {
        yaml += `${indent}- ${jsonToYaml(item, 0)}`;
      }
    });
    return yaml;
  }

  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}\n";
    let yaml = indentLevel === 0 ? "" : "\n";
    keys.forEach((key) => {
      const val = obj[key];
      if (typeof val === "object" && val !== null) {
        yaml += `${indent}${key}:${jsonToYaml(val, indentLevel + 1)}`;
      } else {
        yaml += `${indent}${key}: ${jsonToYaml(val, 0)}`;
      }
    });
    return yaml;
  }

  return `${obj}\n`;
}

export function jsonToXml(obj: any, rootName: string = "root"): string {
  function toXml(val: any, tag: string): string {
    if (val === null || val === undefined) return `<${tag}/>`;
    if (typeof val !== "object") {
      return `<${tag}>${String(val).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</${tag}>`;
    }

    if (Array.isArray(val)) {
      return val.map((item) => toXml(item, tag.endsWith("s") ? tag.slice(0, -1) : "item")).join("\n");
    }

    const children = Object.keys(val)
      .map((k) => toXml(val[k], k))
      .join("\n  ");

    return `<${tag}>\n  ${children}\n</${tag}>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, rootName)}`;
}

export function jsonToCsv(data: any): string {
  let items = data;
  if (!Array.isArray(data)) {
    if (typeof data === "object" && data !== null) {
      items = [data];
    } else {
      throw new Error("JSON must be an array of objects to convert to CSV");
    }
  }

  if (items.length === 0) return "";

  // Flatten nested objects if primitive properties exist
  const allHeaders = new Set<string>();
  items.forEach((item: any) => {
    if (typeof item === "object" && item !== null) {
      Object.keys(item).forEach((k) => allHeaders.add(k));
    }
  });

  const headers = Array.from(allHeaders);
  const csvRows: string[] = [headers.join(",")];

  items.forEach((item: any) => {
    const row = headers.map((header) => {
      const val = item[header];
      if (val === undefined || val === null) return '""';
      if (typeof val === "object") return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}
