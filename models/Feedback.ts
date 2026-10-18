import { query } from "@/lib/db";

export interface IFeedbackPopulatedRequest {
  _id: string;
  id: string;
  title: string;
  slug?: string;
  category?: string;
}

export interface IFeedback {
  _id: string;
  id: string;
  recipientId: string;
  requestId: IFeedbackPopulatedRequest | string | null;
  message: string;
  category: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  save(): Promise<IFeedback>;
}

interface FeedbackRow {
  id: string;
  recipient_id: string;
  request_id: string | null;
  message: string;
  category: string;
  is_read: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  req_id?: string | null;
  req_title?: string | null;
  req_slug?: string | null;
  req_category?: string | null;
}

function mapFeedback(row: FeedbackRow, populated = false): IFeedback {
  let reqObj: IFeedbackPopulatedRequest | string | null = row.request_id;
  if (populated && row.req_id) {
    reqObj = {
      _id: row.req_id,
      id: row.req_id,
      title: row.req_title || "",
      slug: row.req_slug || "",
      category: row.req_category || "",
    };
  }

  return {
    _id: row.id,
    id: row.id,
    recipientId: row.recipient_id,
    requestId: reqObj,
    message: row.message,
    category: row.category,
    isRead: row.is_read,
    isDeleted: row.is_deleted,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    async save() {
      await query(
        `UPDATE feedbacks SET 
          message = $1, 
          category = $2, 
          is_read = $3, 
          is_deleted = $4, 
          updated_at = NOW() 
        WHERE id = $5`,
        [this.message, this.category, this.isRead, this.isDeleted, this.id]
      );
      return this;
    },
  };
}

class FeedbackQueryPromise implements PromiseLike<IFeedback | null> {
  private promise: Promise<IFeedback | null>;

  constructor(promise: Promise<IFeedback | null>) {
    this.promise = promise;
  }

  then<TResult1 = IFeedback | null, TResult2 = never>(
    onfulfilled?: ((value: IFeedback | null) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<IFeedback | null | TResult> {
    return this.promise.catch(onrejected);
  }
}

class FeedbackListQueryBuilder implements PromiseLike<IFeedback[]> {
  private filter: any;
  private shouldPopulate: boolean = false;
  private limitCount?: number;

  constructor(filter: any) {
    this.filter = filter;
  }

  populate(_field: string, _select?: string): this {
    this.shouldPopulate = true;
    return this;
  }

  sort(_sortOptions?: any): this {
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  lean(): this {
    return this;
  }

  private async execute(): Promise<IFeedback[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (this.filter?.recipientId) {
      params.push(this.filter.recipientId.toString());
      conditions.push(`f.recipient_id = $${params.length}`);
    }

    if (this.filter?.isDeleted !== undefined) {
      params.push(Boolean(this.filter.isDeleted));
      conditions.push(`f.is_deleted = $${params.length}`);
    }

    if (this.filter?.isRead !== undefined) {
      params.push(Boolean(this.filter.isRead));
      conditions.push(`f.is_read = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    let limitClause = "";
    if (this.limitCount) {
      params.push(this.limitCount);
      limitClause = `LIMIT $${params.length}`;
    }

    const sql = `
      SELECT 
        f.*,
        r.id as req_id,
        r.title as req_title,
        r.slug as req_slug,
        r.category as req_category
      FROM feedbacks f
      LEFT JOIN feedback_requests r ON f.request_id = r.id
      ${whereClause}
      ORDER BY f.created_at DESC
      ${limitClause}
    `;

    const res = await query<FeedbackRow>(sql, params);
    return res.rows.map((row) => mapFeedback(row, this.shouldPopulate));
  }

  then<TResult1 = IFeedback[], TResult2 = never>(
    onfulfilled?: ((value: IFeedback[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<IFeedback[] | TResult> {
    return this.execute().catch(onrejected);
  }
}

async function findOneInternal(filter: any): Promise<IFeedback | null> {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filter._id || filter.id) {
    params.push(filter._id || filter.id);
    conditions.push(`id = $${params.length}`);
  }

  if (filter.recipientId) {
    params.push(filter.recipientId.toString());
    conditions.push(`recipient_id = $${params.length}`);
  }

  if (conditions.length === 0) return null;

  const sql = `SELECT * FROM feedbacks WHERE ${conditions.join(" AND ")} LIMIT 1`;
  const res = await query<FeedbackRow>(sql, params);
  return res.rows[0] ? mapFeedback(res.rows[0]) : null;
}

const Feedback = {
  find(filter: any): FeedbackListQueryBuilder {
    return new FeedbackListQueryBuilder(filter);
  },

  findOne(filter: any): FeedbackQueryPromise {
    return new FeedbackQueryPromise(findOneInternal(filter));
  },

  async findOneAndDelete(filter: any): Promise<IFeedback | null> {
    const item = await findOneInternal(filter);
    if (!item) return null;

    await query(`DELETE FROM feedbacks WHERE id = $1`, [item.id]);
    return item;
  },

  async countDocuments(filter: any): Promise<number> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter?.recipientId) {
      params.push(filter.recipientId.toString());
      conditions.push(`recipient_id = $${params.length}`);
    }

    if (filter?.isDeleted !== undefined) {
      params.push(Boolean(filter.isDeleted));
      conditions.push(`is_deleted = $${params.length}`);
    }

    if (filter?.isRead !== undefined) {
      params.push(Boolean(filter.isRead));
      conditions.push(`is_read = $${params.length}`);
    }

    if (filter?.createdAt) {
      if (filter.createdAt.$gte) {
        params.push(new Date(filter.createdAt.$gte));
        conditions.push(`created_at >= $${params.length}`);
      }
      if (filter.createdAt.$lte) {
        params.push(new Date(filter.createdAt.$lte));
        conditions.push(`created_at <= $${params.length}`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const res = await query<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM feedbacks ${whereClause}`,
      params
    );
    return parseInt(res.rows[0]?.count || "0", 10);
  },

  async aggregate(pipeline: any[]): Promise<any[]> {
    // Pipeline is: match recipientId and !isDeleted, group by category, sort by count
    const matchStage = pipeline.find((p) => p.$match)?.$match;
    const recipientId = matchStage?.recipientId?.toString();

    const sql = `
      SELECT category as _id, COUNT(*)::int as count 
      FROM feedbacks 
      WHERE recipient_id = $1 AND is_deleted = false 
      GROUP BY category 
      ORDER BY count DESC
    `;
    const res = await query(sql, [recipientId]);
    return res.rows;
  },

  async create(data: {
    recipientId: any;
    requestId?: any;
    message: string;
    category?: string;
    isRead?: boolean;
    isDeleted?: boolean;
  }): Promise<IFeedback> {
    const recipientIdStr = data.recipientId?.toString() || String(data.recipientId);
    const requestIdStr = data.requestId ? data.requestId.toString() : null;

    const res = await query<FeedbackRow>(
      `INSERT INTO feedbacks (recipient_id, request_id, message, category, is_read, is_deleted)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        recipientIdStr,
        requestIdStr,
        data.message.trim(),
        data.category || "General",
        data.isRead ?? false,
        data.isDeleted ?? false,
      ]
    );
    return mapFeedback(res.rows[0]);
  },
};

export default Feedback;
