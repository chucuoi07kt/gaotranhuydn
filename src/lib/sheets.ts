import { GOOGLE_SHEETS } from './constants';

const BASE = 'https://docs.google.com/spreadsheets/d';
const EXPORT_PATH = 'export';
const FEED_PATH = 'gviz/tq';

interface SheetsRow {
  [key: string]: string;
}

function normalizeHeader(h: string): string {
  return String(h ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '_');
}

function parseCsv(text: string): { headers: string[]; rows: SheetsRow[] } {
  const lines = text.replace(/\r\n/g, '\n').split('\n').filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim().replace(/^"|"$/g, ''));
  };

  const headers = parseLine(lines[0]).map(normalizeHeader);
  const rows: SheetsRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    if (cells.length === 1 && !cells[0]) continue;
    const obj: SheetsRow = {};
    headers.forEach((h, idx) => {
      obj[h] = cells[idx] ?? '';
    });
    rows.push(obj);
  }
  return { headers, rows };
}

export async function fetchSheetRows(
  tab: 'sp' | 'blog'
): Promise<{ headers: string[]; rows: SheetsRow[] }> {
  const gid = tab === 'sp' ? '0' : '1';
  const url = `${BASE}/${GOOGLE_SHEETS.spreadsheetId}/${EXPORT_PATH}?format=csv&gid=${gid}&t=${Date.now()}`;
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'text/csv' },
  });
  if (!res.ok) {
    throw new Error(`Không thể đọc Google Sheet (${res.status})`);
  }
  const text = await res.text();
  return parseCsv(text);
}

export async function fetchSheetJson(
  tab: 'sp' | 'blog'
): Promise<Record<string, string>[]> {
  const gid = tab === 'sp' ? '0' : '1';
  const url = `${BASE}/${GOOGLE_SHEETS.spreadsheetId}/${FEED_PATH}?tqx=out:json&gid=${gid}&t=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Không thể đọc Google Sheet (${res.status})`);
  }
  const text = await res.text();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return [];
  const json = JSON.parse(text.substring(start, end + 1));
  const cols = (json.table?.cols ?? []).map(
    (c: { label?: string; id?: string }) =>
      normalizeHeader(c.label || c.id || '')
  );
  const rows = (json.table?.rows ?? [])
    .map((r: { c: { v: string }[] }) => {
      const obj: Record<string, string> = {};
      (r.c ?? []).forEach((cell, idx) => {
        const key = cols[idx] || `col_${idx}`;
        obj[key] = cell?.v != null ? String(cell.v) : '';
      });
      return obj;
    })
    .filter((r: Record<string, string>) =>
      Object.values(r).some((v) => v)
    );
  return rows;
}

export function mapRowByHeaders(
  row: Record<string, string>,
  fieldMap: Record<string, string[]>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [field, candidates] of Object.entries(fieldMap)) {
    for (const key of Object.keys(row)) {
      const norm = key.toLowerCase().replace(/[\s_]+/g, '_');
      if (candidates.some((c) => norm === c || norm.includes(c))) {
        out[field] = row[key];
        break;
      }
    }
    if (!(field in out)) out[field] = '';
  }
  return out;
}
