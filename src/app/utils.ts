import { numericFormatter } from "react-number-format";
import { User } from "./types";
import { ORBS_DOMAINS } from "./consts";

export const formatNumber = (value?: string, decimalScale = 4) => {
   try {
    if (!value) return value;
    const result = numericFormatter(value, {
      allowLeadingZeros: true,
      thousandSeparator: ",",
      displayType: "text",
      value: value || "",
      decimalScale,
    });
  
    return result;
   } catch (error) {
    console.error(error);
    return value;
   }
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

  

  export function  parseCurrency(input: string): string | null {
    if (typeof input !== "string") return null;
  
    const cleaned = input
      .replace(/\$/g, "") // remove dollar sign
      .replace(/,/g, "") // remove commas
      .trim(); // remove leading/trailing whitespace
  
    return cleaned;
  }