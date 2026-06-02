import type { DataSourceSchema } from "@/lib/types/query";

export const DATA_SOURCES: DataSourceSchema[] = [
  {
    id: "users",
    name: "Users",
    tableName: "users",
    fields: [
      { name: "name", type: "string", label: "Name" },
      { name: "email", type: "string", label: "Email" },
      { name: "age", type: "number", label: "Age" },
      {
        name: "status",
        type: "enum",
        label: "Status",
        enumValues: ["active", "inactive", "pending"],
      },
      { name: "country", type: "string", label: "Country" },
      { name: "purchases", type: "number", label: "Purchases" },
      { name: "createdAt", type: "date", label: "Created At" },
      { name: "verified", type: "boolean", label: "Verified" },
    ],
  },
  {
    id: "orders",
    name: "Orders",
    tableName: "orders",
    fields: [
      { name: "orderId", type: "string", label: "Order ID" },
      { name: "amount", type: "number", label: "Amount" },
      {
        name: "status",
        type: "enum",
        label: "Status",
        enumValues: ["pending", "shipped", "delivered", "cancelled"],
      },
      { name: "createdAt", type: "date", label: "Created At" },
    ],
  },
];

export function getSchemaById(id: string): DataSourceSchema | undefined {
  return DATA_SOURCES.find((s) => s.id === id);
}
