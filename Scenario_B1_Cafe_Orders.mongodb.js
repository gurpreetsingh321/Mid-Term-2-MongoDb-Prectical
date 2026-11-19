use("cafeDB");

db.orders.drop();

db.orders.insertMany([
  { _id: 1, customer: "Meena", item: "Coffee", qty: 2, price: 120, status: "delivered" },
  { _id: 2, customer: "Ravi", item: "Sandwich", qty: 1, price: 180, status: "delivered" },
  { _id: 3, customer: "Meena", item: "Sandwich", qty: 2, price: 180, status: "cancelled" },
  { _id: 4, customer: "Karthik", item: "Coffee", qty: 3, price: 120, status: "delivered" },
  { _id: 5, customer: "Ravi", item: "Coffee", qty: 1, price: 120, status: "delivered" },
  { _id: 6, customer: "Meena", item: "Cake", qty: 1, price: 250, status: "delivered" },
  { _id: 7, customer: "Karthik", item: "Cake", qty: 2, price: 250, status: "pending" }
]);

print("\n--- Task 1: Count orders by status ---");
printjson(
  db.orders.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray()
);

print("\n--- Task 2: Filter with $match and shape with $project ---");
printjson(
  db.orders.aggregate([
    { $match: { status: "delivered" } },
    { $project: { _id: 0, customer: 1, item: 1, qty: 1 } }
  ]).toArray()
);

print("\n--- Task 3: Revenue per item ---");
printjson(
  db.orders.aggregate([
    { $match: { status: "delivered" } },
    {
      $group: {
        _id: "$item",
        totalQty: { $sum: "$qty" },
        revenue: { $sum: { $multiply: ["$qty", "$price"] } }
      }
    },
    { $sort: { revenue: -1 } }
  ]).toArray()
);

print("\n--- Task 4: Spend per customer ---");
printjson(
  db.orders.aggregate([
    { $match: { status: "delivered" } },
    {
      $group: {
        _id: "$customer",
        orders: { $sum: 1 },
        totalSpend: { $sum: { $multiply: ["$qty", "$price"] } }
      }
    },
    { $project: { _id: 0, customer: "$_id", orders: 1, totalSpend: 1 } },
    { $sort: { totalSpend: -1 } }
  ]).toArray()
);

print("\n--- Task 5: Find the best customer ---");
printjson(
  db.orders.aggregate([
    { $match: { status: "delivered" } },
    {
      $group: {
        _id: "$customer",
        totalSpend: { $sum: { $multiply: ["$qty", "$price"] } }
      }
    },
    { $sort: { totalSpend: -1 } },
    { $limit: 1 }
  ]).toArray()
);
