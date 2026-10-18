import { query } from "@/lib/db";

export interface IVerificationCode {
  _id: string;
  id: string;
  userId: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

interface VerificationCodeRow {
  id: string;
  user_id: string;
  code: string;
  expires_at: Date;
  created_at: Date;
}

function mapCode(row: VerificationCodeRow): IVerificationCode {
  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    code: row.code,
    expiresAt: new Date(row.expires_at),
    createdAt: new Date(row.created_at),
  };
}

class CodeQueryPromise implements PromiseLike<IVerificationCode | null> {
  private promise: Promise<IVerificationCode | null>;

  constructor(promise: Promise<IVerificationCode | null>) {
    this.promise = promise;
  }

  sort(_sortOption?: any): CodeQueryPromise {
    return this;
  }

  then<TResult1 = IVerificationCode | null, TResult2 = never>(
    onfulfilled?: ((value: IVerificationCode | null) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<IVerificationCode | null | TResult> {
    return this.promise.catch(onrejected);
  }
}

async function findOneInternal(filter: { userId: any; code?: string }): Promise<IVerificationCode | null> {
  const userIdStr = filter.userId?.toString() || String(filter.userId);
  let sql = `SELECT * FROM verification_codes WHERE user_id = $1`;
  const params: any[] = [userIdStr];

  if (filter.code) {
    sql += ` AND code = $2`;
    params.push(filter.code.trim());
  }

  sql += ` ORDER BY created_at DESC LIMIT 1`;

  const res = await query<VerificationCodeRow>(sql, params);
  return res.rows[0] ? mapCode(res.rows[0]) : null;
}

const VerificationCode = {
  findOne(filter: { userId: any; code?: string }): CodeQueryPromise {
    return new CodeQueryPromise(findOneInternal(filter));
  },

  async create(data: { userId: any; code: string; expiresAt: Date }): Promise<IVerificationCode> {
    const userIdStr = data.userId?.toString() || String(data.userId);
    const res = await query<VerificationCodeRow>(
      `INSERT INTO verification_codes (user_id, code, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userIdStr, data.code.trim(), data.expiresAt]
    );
    return mapCode(res.rows[0]);
  },

  async deleteMany(filter: { userId: any }): Promise<{ deletedCount: number }> {
    const userIdStr = filter.userId?.toString() || String(filter.userId);
    const res = await query(
      `DELETE FROM verification_codes WHERE user_id = $1`,
      [userIdStr]
    );
    return { deletedCount: res.rowCount || 0 };
  },
};

export default VerificationCode;
