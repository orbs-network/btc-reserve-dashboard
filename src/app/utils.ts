import { numericFormatter } from "react-number-format";

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
  