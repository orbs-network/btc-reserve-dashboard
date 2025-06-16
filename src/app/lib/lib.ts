import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import BN from "bignumber.js";
import { ParsedSheetRecord, Purchase } from "../types";
import { parseCurrency } from "../utils";



export const parseAndDownloadPurchases = async (file: File) => {
  const zip = new JSZip();
  const parsed = await parseUsersPurchases(file);
  parsed.forEach((item) => {
    const filename = `${item.email}-btc-compensation.json`;
    const json = JSON.stringify(item, null, 2);
    zip.file(filename, json);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "btc-purchases.zip");
  return parsed;
};

type SheetKeys =
  | "Purchase Cost"
  | "BTC Amount"
  | `Purchase Cost_${number}`
  | `BTC Amount_${number}`;

export type SheetRecord = {
  __EMPTY: string;
  __EMPTY_1: string;
} & {
  [K in SheetKeys]?: string;
};

const getDates = (sheet: any) => {
  let dates = sheet.find((row: any) => {
    return row["__EMPTY"] === "ID";
  });
  dates = Object.values(dates as any) as string[];
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  dates = (dates as string[]).filter((it: string) => {
    return dateRegex.test(it);
  });
  return dates;
};

const filterUnwantedRows = (sheet: any) => {
  const unwantedRows = [
    "ID",
    "Provision Amount + Current BTC Price:",
    "From CoinBase",
    "Total From Table Below:",
  ];

  const res = sheet.filter((row: SheetRecord) => {
    return (
      row["__EMPTY"] &&
      row["__EMPTY_1"] &&
      !unwantedRows.includes(row["__EMPTY"]) &&
      row["__EMPTY_1"] !== "0" &&
      row["__EMPTY"] !== "0"
    );
  });
  return res;
};

const getPurchaseAmounts = (dates: string[], sheetRecord: SheetRecord) => {
  const priceData = Object.entries(sheetRecord)
    .filter(([key, value]) => {
      return key.includes("Purchase Cost");
    })
    .map(([key, value]) => {
      const index = key.split("_")[1];

      return {
        index: index ? Number(index) : 0,
        amount: Number(parseCurrency(value || "0")),
      };
    })
    .sort((a, b) => a.index - b.index);

  const btcData = Object.entries(sheetRecord)
    .filter(([key]) => {
      return key.includes("BTC Amount");
    })
    .map(([key, value]) => {
      const index = key.split("_")[1];
      return {
        index: index ? Number(index) : 0,
        amount: Number(value),
      };
    })
    .sort((a, b) => a.index - b.index);

  const purchases: Purchase[] = dates.map((value, index) => {
    const price = priceData[index]?.amount || 0;
    const btc = btcData[index]?.amount || 0;
    return {
      date: value,
      price,
      btc,
    };
  });

  const totalBTC = btcData.reduce((acc: any, curr) => {
    const amount = curr.amount ? curr.amount : 0;

    return acc.plus(amount);
  }, new BN(0));

  const totalSpent = purchases.reduce((acc: any, curr) => {
    console.log(curr.price);

    const price = curr.price ? curr.price : 0;
    return acc.plus(price);
  }, new BN(0));

  const avgPurchasePrice = totalSpent.div(totalBTC);

  return {
    purchases,
    totalBTC: totalBTC.toString(),
    avgPurchasePrice: avgPurchasePrice.toString(),
    totalFiatSpent: totalSpent.toString(),
  };
};

export const parseUsersPurchases = async (file: File) => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });

  // Parse Excel file
  const sheetName = workbook.SheetNames[1]; // Read the first sheet
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    raw: false,
    dateNF: "yyyy-mm-dd",
  });

  const dates = getDates(sheet);

  const data = filterUnwantedRows(sheet);

  const parsedData: ParsedSheetRecord[] = data
    .map((row: SheetRecord) => {
      const email = row["__EMPTY"];
      const name = row["__EMPTY_1"];
      const { totalBTC, purchases, avgPurchasePrice, totalFiatSpent } =
        getPurchaseAmounts(dates, row);
      return {
        email,
        name,
        purchases,
        totalBTC,
        avgPurchasePrice,
        totalFiatSpent,
      };
    })
    .filter((it: ParsedSheetRecord) => {
      return it !== null;
    });

  return parsedData;
};
