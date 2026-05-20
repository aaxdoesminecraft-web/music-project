import { getSupabaseConfig, type SupabaseConfig } from "@/lib/server/supabase/config";

type Primitive = string | number | boolean;

export class SupabaseRestClient {
  private readonly config: SupabaseConfig;

  constructor(config: SupabaseConfig = getSupabaseConfig()) {
    this.config = config;
  }

  async select<T>(
    table: string,
    options: {
      columns?: string;
      filters?: Record<string, string>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    } = {},
  ): Promise<T[]> {
    const response = await fetch(this.buildUrl(table, options), {
      method: "GET",
      headers: this.headers(),
      cache: "no-store",
    });

    return this.parseJson<T[]>(response);
  }

  async insert<T>(table: string, payload: T | T[], options?: { upsert?: boolean }): Promise<void> {
    const headers = {
      ...this.headers(),
      "Content-Type": "application/json",
      Prefer: options?.upsert
        ? "resolution=merge-duplicates,return=minimal"
        : "return=minimal",
    };

    const response = await fetch(this.tableUrl(table), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    await this.ensureOk(response);
  }

  async delete(
    table: string,
    filters: Record<string, string>,
  ): Promise<void> {
    const response = await fetch(
      this.buildUrl(table, {
        filters,
      }),
      {
        method: "DELETE",
        headers: {
          ...this.headers(),
          Prefer: "return=minimal",
        },
      },
    );

    await this.ensureOk(response);
  }

  private buildUrl(
    table: string,
    options: {
      columns?: string;
      filters?: Record<string, string>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    },
  ): string {
    const url = new URL(`/rest/v1/${table}`, this.config.url);
    url.searchParams.set("select", options.columns ?? "*");

    for (const [column, filter] of Object.entries(options.filters ?? {})) {
      url.searchParams.set(column, filter);
    }

    if (options.order) {
      url.searchParams.set(
        "order",
        `${options.order.column}.${options.order.ascending === false ? "desc" : "asc"}`,
      );
    }

    if (options.limit !== undefined) {
      url.searchParams.set("limit", String(options.limit));
    }

    return url.toString();
  }

  private tableUrl(table: string): string {
    return new URL(`/rest/v1/${table}`, this.config.url).toString();
  }

  private headers(): Record<string, string> {
    if (!this.config.url || !this.config.serviceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    return {
      apikey: this.config.serviceRoleKey,
      Authorization: `Bearer ${this.config.serviceRoleKey}`,
      Accept: "application/json",
      "Accept-Profile": this.config.schema,
      "Content-Profile": this.config.schema,
    };
  }

  private async ensureOk(response: Response): Promise<void> {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase request failed: ${response.status} ${text}`);
    }
  }

  private async parseJson<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase request failed: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }
}

export function eq(value: Primitive): string {
  return `eq.${String(value)}`;
}

export function inList(values: Primitive[]): string {
  return `in.(${values.map((value) => String(value)).join(",")})`;
}
