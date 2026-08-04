import { CronParseResult, RegexMatchResult } from "../types";

export function testRegex(pattern: string, flags: string, targetText: string): { matches: RegexMatchResult[]; error: string | null } {
  if (!pattern) return { matches: [], error: null };
  try {
    const re = new RegExp(pattern, flags);
    const matches: RegexMatchResult[] = [];

    if (flags.includes("g")) {
      let match: RegExpExecArray | null;
      let count = 0;
      while ((match = re.exec(targetText)) !== null && count < 500) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups ? { ...match.groups } : undefined,
        });
        if (match.index === re.lastIndex) {
          re.lastIndex++;
        }
        count++;
      }
    } else {
      const match = re.exec(targetText);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups ? { ...match.groups } : undefined,
        });
      }
    }

    return { matches, error: null };
  } catch (err: any) {
    return { matches: [], error: err.message };
  }
}

export function formatSql(sql: string): string {
  if (!sql.trim()) return "";
  const keywords = [
    "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY",
    "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "JOIN",
    "ON", "AND", "OR", "LIMIT", "OFFSET", "INSERT INTO", "VALUES",
    "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
    "UNION ALL", "UNION", "AS", "IN", "IS NULL", "IS NOT NULL"
  ];

  let formatted = sql;
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b${kw.replace(" ", "\\s+")}\\b`, "gi");
    formatted = formatted.replace(re, `\n${kw}`);
  });

  const lines = formatted
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let indent = 0;
  const result: string[] = [];

  lines.forEach((line) => {
    const upper = line.toUpperCase();
    if (upper.startsWith("SELECT") || upper.startsWith("INSERT") || upper.startsWith("UPDATE") || upper.startsWith("DELETE") || upper.startsWith("CREATE")) {
      indent = 0;
    }
    result.push("  ".repeat(indent) + line);
    if (upper.startsWith("FROM") || upper.startsWith("WHERE") || upper.startsWith("JOIN")) {
      indent = 1;
    }
  });

  return result.join("\n");
}

export function parseCronExpression(cronStr: string): CronParseResult {
  const parts = cronStr.trim().split(/\s+/);
  if (parts.length !== 5 && parts.length !== 6) {
    return {
      expression: cronStr,
      isValid: false,
      error: "Cron expression must contain 5 fields (minute, hour, day-of-month, month, day-of-week)",
    };
  }

  const [min, hour, dom, month, dow] = parts;

  function explainPart(val: string, name: string): string {
    if (val === "*") return `every ${name}`;
    if (val.startsWith("*/")) return `every ${val.slice(2)} ${name}s`;
    if (val.includes("-")) return `from ${val.split("-")[0]} through ${val.split("-")[1]}`;
    if (val.includes(",")) return `at ${val.split(",").join(", ")}`;
    return `at ${name} ${val}`;
  }

  const description = `Runs ${explainPart(min, "minute")}, ${explainPart(hour, "hour")}, ${explainPart(dom, "day-of-month")}, ${explainPart(month, "month")}, and ${explainPart(dow, "day-of-week")}.`;

  // Compute next 5 simulated dates
  const nextDates: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 5; i++) {
    const d = new Date(now.getTime() + i * 15 * 60 * 1000); // 15 min increments sample
    nextDates.push(d.toLocaleString());
  }

  return {
    expression: cronStr,
    isValid: true,
    description,
    nextDates,
  };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace("#", "").trim();
  if (!/^[0-9A-Fa-f]{3,6}$/.test(cleanHex)) return null;

  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split("").map((c) => c + c).join("");
  }

  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case normR:
        h = (normG - normB) / d + (normG < normB ? 6 : 0);
        break;
      case normG:
        h = (normB - normR) / d + 2;
        break;
      case normB:
        h = (normR - normG) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
