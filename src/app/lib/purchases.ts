import fs from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";
import BN from "bignumber.js";
import { ParsedSheetRecord, Purchase, User } from "../types";
import axios from "axios";

function parseCurrency(input: string): string | null {
  if (typeof input !== "string") return null;

  const cleaned = input
    .replace(/\$/g, "") // remove dollar sign
    .replace(/,/g, "") // remove commas
    .trim(); // remove leading/trailing whitespace

  return cleaned;
}


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

const getSheetData = async () => {
    
    const response = await fetch(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/data-sheet.xlsx`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
  }


  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer); // Required by XLSX to parse properly
  const workbook = XLSX.read(uint8Array, { type: 'array' });


    
  // Parse Excel file
  const sheetName = workbook.SheetNames[1]; // Read the first sheet
  const sheet = workbook.Sheets[sheetName];

  return {
    sheet: XLSX.utils.sheet_to_json(sheet),
    dates: getDates(
      XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: "yyyy-mm-dd" })
    ),
  };
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

const getPurchaseAmounts = (
  dates: string[],
  sheetRecord: SheetRecord,
  email: string
) => {
  const priceData = Object.entries(sheetRecord)
    .filter(([key, value]) => {
      return key.includes("Purchase Cost");
    })
    .map(([key, value]) => {
      const index = key.split("_")[1];
      return {
        index: index ? Number(index) : 0,
        amount: Number(value),
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
    const price = priceData[index];
    const btc = btcData[index]?.amount;
    return {
      date: value,
      price: price?.amount || 0,
      btc: btc || 0,
    };
  });

  const totalBTC = btcData.reduce(
    (acc: any, curr) => acc.plus(curr.amount),
    new BN(0)
  );

  const totalSpent = purchases.reduce((acc: any, curr) => {
    return acc.plus(curr.price);
  }, new BN(0));

  const avgPurchasePrice = totalSpent.div(totalBTC).toString();

  return {
    purchases,
    totalBTC,
    avgPurchasePrice,
    totalSpent,
  };
};

export const getUsersPurchases = async (user: User) => {
  const { sheet, dates } = await getSheetData();

  const data = filterUnwantedRows(sheet);

  const parsedData: ParsedSheetRecord[] = data
    .map((row: SheetRecord) => {
      const email = row["__EMPTY"];
      const name = row["__EMPTY_1"];
      const { totalBTC, purchases, avgPurchasePrice, totalSpent } =
        getPurchaseAmounts(dates, row, email);
      return {
        email,
        name,
        purchases,
        totalBTC,
        avgPurchasePrice,
        totalSpent,
      };
    })
    .filter((it: ParsedSheetRecord) => {
      return it !== null;
    });

  return parsedData.find((it: ParsedSheetRecord) => {
    return it.email === user.email;
  });
};
