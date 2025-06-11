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