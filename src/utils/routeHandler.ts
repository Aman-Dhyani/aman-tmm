// src/utils/routeHandler.ts
import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "./db";

export function createHandler(runLogic: (data: any, conn: any) => Promise<any>) {
  return async (req: NextRequest) => {
    try {
      const data = await req.json();
      const conn = await getDBConnection();
      const result = await runLogic(data, conn);
      await conn.end();
      return NextResponse.json(result);
    } catch (err) {
      return NextResponse.json({ error: (err as any).message }, { status: 500 });
    }
  };
}
