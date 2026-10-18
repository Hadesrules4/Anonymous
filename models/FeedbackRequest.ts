import { query } from "@/lib/db";

export interface IFeedbackRequest {
  _id: string;
  id: string;
  ownerId: string;
  title: string;
  question: string;
  category: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  save(): Promise<IFeedbackRequest>;
}

interface FeedbackRequestRow {
  id: string;
  owner_id: string;
  title: string;
  question: string;
  category: string;
  slug: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

function mapRequest(row: FeedbackRequestRow): IFeedbackRequest {
  return {
    _id: row.id,
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    question: row.question,
    category: row.category,
    slug: row.slug,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    async save() {
      await query(
        `UPDATE feedback_requests SET 
          title = $1, 
          question = $2, 
          category = $3, 
          slug = $4, 
          is_active = $5, 
          updated_at = NOW() 
        WHERE id = $6`,
        [this.title, this.question, this.category, this.slug, this.isActive, this.id]
      );
      return this;
    },
  };
}

class RequestQueryPromise implements PromiseLike<IFeedbackRequest | null> {
  private promise: Promise<IFeedbackRequest | null>;

  constructor(promise: Promise<IFeedbackRequest | null>) {
    this.promise = promise;
  }

  lean(): RequestQueryPromise {
    return this;
  }

  then<TResult1 = IFeedbackRequest | null, TResult2 = never>(
    onfulfilled?: ((value: IFeedbackRequest | null) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<IFeedbackRequest | null | TResult> {
    return this.promise.catch(onrejected);
  }
}

class RequestListQueryPromise implements PromiseLike<IFeedbackRequest[]> {
  private promise: Promise<IFeedbackRequest[]>;

  constructor(promise: Promise<IFeedbackRequest[]>) {
    this.promise = promise;
  }

  sort(_sortOption?: any): RequestListQueryPromise {
    return this;
  }

  lean(): RequestListQueryPromise {
    return this;
  }

  then<TResult1 = IFeedbackRequest[], TResult2 = never>(
    onfulfilled?: ((value: IFeedbackRequest[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<IFeedbackRequest[] | TResult> {
    return this.promise.catch(onrejected);
  }
}

async function findOneInternal(filter: any): Promise<IFeedbackRequest | null> {
  if (!filter) return null;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filter._id || filter.id) {
    params.push(filter._id || filter.id);
    conditions.push(`id = $${params.length}`);
  }

  if (filter.ownerId) {
    params.push(filter.ownerId.toString());
    conditions.push(`owner_id = $${params.length}`);
  }

  if (filter.slug) {
    params.push(filter.slug.toLowerCase().trim());
    conditions.push(`LOWER(slug) = $${params.length}`);
  }

  if (conditions.length === 0) return null;

  const sql = `SELECT * FROM feedback_requests WHERE ${conditions.join(" AND ")} LIMIT 1`;
  const res = await query<FeedbackRequestRow>(sql, params);
  return res.rows[0] ? mapRequest(res.rows[0]) : null;
}

async function findInternal(filter: any): Promise<IFeedbackRequest[]> {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filter?.ownerId) {
    params.push(filter.ownerId.toString());
    conditions.push(`owner_id = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `SELECT * FROM feedback_requests ${whereClause} ORDER BY created_at DESC`;
  const res = await query<FeedbackRequestRow>(sql, params);
  return res.rows.map(mapRequest);
}

const FeedbackRequest = {
  find(filter: any): RequestListQueryPromise {
    return new RequestListQueryPromise(findInternal(filter));
  },

  findOne(filter: any): RequestQueryPromise {
    return new RequestQueryPromise(findOneInternal(filter));
  },

  async findOneAndDelete(filter: any): Promise<IFeedbackRequest | null> {
    const existing = await findOneInternal(filter);
    if (!existing) return null;

    await query(`DELETE FROM feedback_requests WHERE id = $1`, [existing.id]);
    return existing;
  },

  async countDocuments(filter: any): Promise<number> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter?.ownerId) {
      params.push(filter.ownerId.toString());
      conditions.push(`owner_id = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const res = await query<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM feedback_requests ${whereClause}`,
      params
    );
    return parseInt(res.rows[0]?.count || "0", 10);
  },

  async create(data: {
    ownerId: any;
    title: string;
    question: string;
    category?: string;
    slug: string;
    isActive?: boolean;
  }): Promise<IFeedbackRequest> {
    const ownerIdStr = data.ownerId?.toString() || String(data.ownerId);
    const res = await query<FeedbackRequestRow>(
      `INSERT INTO feedback_requests (owner_id, title, question, category, slug, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        ownerIdStr,
        data.title.trim(),
        data.question.trim(),
        data.category || "General",
        data.slug.toLowerCase().trim(),
        data.isActive ?? true,
      ]
    );
    return mapRequest(res.rows[0]);
  },
};

export default FeedbackRequest;
