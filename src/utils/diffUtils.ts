import { JsonDiffResult, TextDiffLine } from "../types";

export function compareJsonObjects(
  objA: any,
  objB: any,
  path: string = "$",
  ignoreArrayOrder: boolean = false
): JsonDiffResult[] {
  const diffs: JsonDiffResult[] = [];

  // Primitive equality
  if (objA === objB) {
    diffs.push({ path, type: "unchanged", oldValue: objA, newValue: objB });
    return diffs;
  }

  // Type mismatch
  const typeA = Array.isArray(objA) ? "array" : typeof objA;
  const typeB = Array.isArray(objB) ? "array" : typeof objB;

  if (typeA !== typeB || objA === null || objB === null || typeof objA !== "object" || typeof objB !== "object") {
    diffs.push({ path, type: "modified", oldValue: objA, newValue: objB });
    return diffs;
  }

  // Both are objects / arrays
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  const allKeys = Array.from(new Set([...keysA, ...keysB]));

  allKeys.sort();

  allKeys.forEach((key) => {
    const childPath = typeA === "array" ? `${path}[${key}]` : `${path}.${key}`;
    const hasA = Object.prototype.hasOwnProperty.call(objA, key);
    const hasB = Object.prototype.hasOwnProperty.call(objB, key);

    if (hasA && !hasB) {
      diffs.push({ path: childPath, type: "removed", oldValue: objA[key] });
    } else if (!hasA && hasB) {
      diffs.push({ path: childPath, type: "added", newValue: objB[key] });
    } else {
      // Both have key
      const valA = objA[key];
      const valB = objB[key];

      if (typeof valA === "object" && valA !== null && typeof valB === "object" && valB !== null) {
        diffs.push(...compareJsonObjects(valA, valB, childPath, ignoreArrayOrder));
      } else if (valA !== valB) {
        diffs.push({ path: childPath, type: "modified", oldValue: valA, newValue: valB });
      } else {
        diffs.push({ path: childPath, type: "unchanged", oldValue: valA, newValue: valB });
      }
    }
  });

  return diffs;
}

export function computeTextDiffLines(textA: string, textB: string): TextDiffLine[] {
  const linesA = textA.split(/\r?\n/);
  const linesB = textB.split(/\r?\n/);

  const result: TextDiffLine[] = [];
  const maxLen = Math.max(linesA.length, linesB.length);

  let idxA = 0;
  let idxB = 0;

  while (idxA < linesA.length || idxB < linesB.length) {
    const lineA = linesA[idxA];
    const lineB = linesB[idxB];

    if (lineA !== undefined && lineB !== undefined) {
      if (lineA === lineB) {
        result.push({
          lineNumberA: idxA + 1,
          lineNumberB: idxB + 1,
          type: "unchanged",
          contentA: lineA,
          contentB: lineB,
        });
        idxA++;
        idxB++;
      } else {
        // Look ahead to check if lineA appears in B or lineB appears in A
        const bInA = linesA.indexOf(lineB, idxA);
        const aInB = linesB.indexOf(lineA, idxB);

        if (aInB !== -1 && (bInA === -1 || aInB <= bInA)) {
          // Line in B was added
          result.push({
            lineNumberB: idxB + 1,
            type: "added",
            contentB: lineB,
          });
          idxB++;
        } else if (bInA !== -1 && (aInB === -1 || bInA < aInB)) {
          // Line in A was removed
          result.push({
            lineNumberA: idxA + 1,
            type: "removed",
            contentA: lineA,
          });
          idxA++;
        } else {
          // Modified
          result.push({
            lineNumberA: idxA + 1,
            lineNumberB: idxB + 1,
            type: "modified",
            contentA: lineA,
            contentB: lineB,
          });
          idxA++;
          idxB++;
        }
      }
    } else if (lineA !== undefined) {
      result.push({
        lineNumberA: idxA + 1,
        type: "removed",
        contentA: lineA,
      });
      idxA++;
    } else if (lineB !== undefined) {
      result.push({
        lineNumberB: idxB + 1,
        type: "added",
        contentB: lineB,
      });
      idxB++;
    }
  }

  return result;
}
