export interface Query {
  query: string;
  type: "run" | "get";
  parameters?: string[];
}
