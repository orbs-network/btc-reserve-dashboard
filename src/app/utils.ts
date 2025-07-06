import { numericFormatter } from "react-number-format";
import { User } from "./types";
import { ORBS_DOMAINS } from "./consts";

export function formatDecimals(
  value?: string,
  scale = 6,
  maxDecimals = 8
): string {
  if (!value) return "";

  // ─── keep the sign, work with the absolute value ────────────────
  const sign = value.startsWith("-") ? "-" : "";
  const abs = sign ? value.slice(1) : value;

  const [intPart, rawDec = ""] = abs.split(".");

  // Fast-path: decimal part is all zeros (or absent) ───────────────
  if (!rawDec || Number(rawDec) === 0) return sign + intPart;

  /** Case 1 – |value| ≥ 1 *****************************************/
  if (intPart !== "0") {
    const sliced = rawDec.slice(0, scale);
    const cleaned = sliced.replace(/0+$/, ""); // drop trailing zeros
    const trimmed = cleaned ? "." + cleaned : "";
    return sign + intPart + trimmed;
  }

  /** Case 2 – |value| < 1 *****************************************/
  const firstSigIdx = rawDec.search(/[^0]/); // first non-zero position
  if (firstSigIdx === -1) return "0"; // decimal part is all zeros
  if (firstSigIdx + 1 > maxDecimals) return "0"; // too many leading zeros → 0

  const leadingZeros = rawDec.slice(0, firstSigIdx); // keep them
  const significantRaw = rawDec.slice(firstSigIdx).slice(0, scale);
  const significant = significantRaw.replace(/0+$/, ""); // trim trailing zeros

  return significant ? sign + "0." + leadingZeros + significant : "0";
}

export const formatNumber = (value?: string | number, decimalScale = 4) => {
  const _value = formatDecimals(value?.toString(), decimalScale);

  const result = numericFormatter(_value, {
    allowLeadingZeros: true,
    thousandSeparator: ",",
    displayType: "text",
    decimalScale: 18,
  });
  return result;
};

export const abbreviate = (num: string) => {
  const abs = Number(num);
  if (abs >= 1e9) return (abs / 1e9).toFixed(2).replace(/\.0+$/, "") + "B";
  if (abs >= 1e6) return (abs / 1e6).toFixed(2).replace(/\.0+$/, "") + "M";
  if (abs >= 1e3) return (abs / 1e3).toFixed(2).replace(/\.0+$/, "") + "K";
  return String(num);
};

export const parseUser = (data: any): User => {
  return {
    authorized: data.hd === "orbs.com",
    email: data.email,
    emailVerified: data.email_verified,
    avatar: data.picture,
    lastName: data.family_name,
    firstName: data.given_name,
    isAdmin: ORBS_DOMAINS.includes(data.email),
    id: data.email,
  };
};

export function parseCurrency(input: string): string | null {
  if (typeof input !== "string") return null;

  const cleaned = input
    .replace(/\$/g, "") // remove dollar sign
    .replace(/,/g, "") // remove commas
    .trim(); // remove leading/trailing whitespace

  return cleaned;
}
