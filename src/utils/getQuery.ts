import sqlite3 from "sqlite3";
import { Query } from "../types/query";

export async function query({ query, parameters, type }: Query): Promise<any> {
  sqlite3.verbose();
  const db = new sqlite3.Database("database.sqlite");

  return new Promise((resolve, reject) => {
    const callback = (err: string, res: any) => {
      if (err) {
        reject(err);
        return;
      }

      if (type === "run") {
        resolve("done");
        return;
      }

      if (res) {
        resolve(JSON.parse(res.value));
      } else {
        resolve(null);
      }
    };

    if (parameters) {
      db[type](query, parameters, callback);
    } else {
      db[type](query, callback);
    }
  });
}
