import { query } from "@/lib/db";

export interface IUser {
  _id: string;
  id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAcceptingFeedback: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  save(): Promise<IUser>;
  toObject(): IUser;
}

interface UserRow {
  id: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  is_accepting_feedback: boolean;
  profile_image: string | null;
  created_at: Date;
  updated_at: Date;
}

function mapUser(row: UserRow): IUser {
  return {
    _id: row.id,
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    isVerified: row.is_verified,
    isAcceptingFeedback: row.is_accepting_feedback,
    profileImage: row.profile_image || "",
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    async save() {
      await query(
        `UPDATE users SET 
          username = $1, 
          email = $2, 
          password = $3, 
          is_verified = $4, 
          is_accepting_feedback = $5, 
          profile_image = $6, 
          updated_at = NOW() 
        WHERE id = $7`,
        [
          this.username,
          this.email,
          this.password,
          this.isVerified,
          this.isAcceptingFeedback,
          this.profileImage || "",
          this.id,
        ]
      );
      return this;
    },
    toObject() {
      return { ...this };
    },
  };
}

class QueryPromise<T> implements PromiseLike<T | null> {
  private promise: Promise<T | null>;

  constructor(promise: Promise<T | null>) {
    this.promise = promise;
  }

  select(_fields?: string): QueryPromise<T> {
    return this;
  }

  lean(): QueryPromise<T> {
    return this;
  }

  then<TResult1 = T | null, TResult2 = never>(
    onfulfilled?: ((value: T | null) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | null | TResult> {
    return this.promise.catch(onrejected);
  }
}

async function findByIdInternal(id: any): Promise<IUser | null> {
  if (!id) return null;
  const idStr = typeof id === "object" && id.toString ? id.toString() : String(id);
  const res = await query<UserRow>(
    `SELECT * FROM users WHERE id = $1 LIMIT 1`,
    [idStr]
  );
  return res.rows[0] ? mapUser(res.rows[0]) : null;
}

async function findOneInternal(filter: any): Promise<IUser | null> {
  if (!filter) return null;

  if (filter.$or && Array.isArray(filter.$or)) {
    const emailCond = filter.$or.find((c: any) => c.email)?.email;
    const userCond = filter.$or.find((c: any) => c.username)?.username;
    const res = await query<UserRow>(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2) LIMIT 1`,
      [emailCond || "", userCond || ""]
    );
    return res.rows[0] ? mapUser(res.rows[0]) : null;
  }

  if (filter.email) {
    const res = await query<UserRow>(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [filter.email.trim()]
    );
    return res.rows[0] ? mapUser(res.rows[0]) : null;
  }

  if (filter.username) {
    const res = await query<UserRow>(
      `SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1`,
      [filter.username.trim()]
    );
    return res.rows[0] ? mapUser(res.rows[0]) : null;
  }

  if (filter._id || filter.id) {
    return findByIdInternal(filter._id || filter.id);
  }

  return null;
}

const User = {
  findById(id: any): QueryPromise<IUser> {
    return new QueryPromise(findByIdInternal(id));
  },

  findOne(filter: any): QueryPromise<IUser> {
    return new QueryPromise(findOneInternal(filter));
  },

  async create(data: {
    username: string;
    email: string;
    password: string;
    isVerified?: boolean;
    isAcceptingFeedback?: boolean;
    profileImage?: string;
  }): Promise<IUser> {
    const res = await query<UserRow>(
      `INSERT INTO users (username, email, password, is_verified, is_accepting_feedback, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.username.toLowerCase().trim(),
        data.email.toLowerCase().trim(),
        data.password,
        data.isVerified ?? false,
        data.isAcceptingFeedback ?? true,
        data.profileImage ?? "",
      ]
    );
    return mapUser(res.rows[0]);
  },
};

export default User;