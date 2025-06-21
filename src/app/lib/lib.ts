import * as XLSX from "xlsx";
import BN from "bignumber.js";
import { ParsedSheetRecord, User } from "../types";
import { protectedApi } from "./api";
import moment from "moment";

const normalizeDate = (input: string): string => {
  const parts = input.split("/");

  if (parts.length !== 3) return input; // fallback for invalid dates

  const [day, month, year] = parts;

  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");
  const paddedYear = year.length === 2 ? year : year.slice(-2); // keep last 2 digits

  return `${paddedDay}/${paddedMonth}/${paddedYear}`;
};
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/;

export const getUsersPurchases = async (
  user: User
): Promise<ParsedSheetRecord> => {
  const name = `${user?.email.replace("@orbs.com", "")}-btc-compensation.csv`;
  const url = `https://www.googleapis.com/drive/v3/files?q=name='${name}'&fields=files(id,name)`;

  const id = await protectedApi.get(url).then((res) => res.data.files[0].id);
  const response = await protectedApi.get(
    `https://www.googleapis.com/drive/v3/files/${id}/export?mimeType=text/csv`,
    { responseType: "text" }
  );

  const workbook = XLSX.read(response.data, { type: "string" });
  const sheetName = workbook.SheetNames[0]; // CSV only has one sheet

  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    raw: true,
  })[0] as any;

  const purchases = Object.entries(data as any)
    .filter(([key]) => dateRegex.test(normalizeDate(key)))
    .map(([key, value]) => ({
      timestamp: moment(key, "DD/MM/YYYY").valueOf(),
      btc: value as number,
      price: 0,
    }));

  Object.entries(data as any).forEach(([key, value]) => {
    if (key.includes("Provision Amount")) {
      const indexStr = key.split("_")[1] || "0";
      const index = parseInt(indexStr, 10);

      if (!isNaN(index) && purchases[index]) {
        purchases[index].price = Number(value);
      }
    }
  });

  const totalBTC = purchases.reduce((acc: any, curr) => {
    return acc.plus(curr.btc);
  }, new BN(0));

  const totalFiatSpent = purchases.reduce((acc: any, curr) => {
    return acc.plus(curr.price);
  }, new BN(0));

  const avgPurchasePrice = totalFiatSpent.div(totalBTC);

  const result = {
    avgPurchasePrice: avgPurchasePrice.toString(),
    totalBTC: totalBTC.toString(),
    totalFiatSpent: totalFiatSpent.toString(),
    purchases,
    name: data["Name"],
    email: data["ID"],
  };

  return result;
};
