# MongoDB Mid Term 2 Practical - Set B

| File | Scenario | Database / Collection |
|------|----------|-----------------------|
| `Scenario_B1_Cafe_Orders.mongodb.js` | B1: Cafe Orders - Sales Reports with Aggregation | `cafeDB.orders` |
| `Scenario_B2_Library_Books.mongodb.js` | B2: Library Books - Updates, Upserts and Deletes | `libraryDB.books` |

## How to run

```powershell
mongosh --file Scenario_B1_Cafe_Orders.mongodb.js
mongosh --file Scenario_B2_Library_Books.mongodb.js
```

---

## File 1: `Scenario_B1_Cafe_Orders.mongodb.js`

Syllabus focus: aggregation using `$match`, `$group`, `$project`, `$sort` and `$limit`.

**Setup:** switches to `cafeDB`, drops `orders`, then inserts 7 orders (Meena, Ravi, Karthik) with `item`, `qty`, `price` and `status`.

### Task 1: Count orders by status
```js
db.orders.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```
```js
[
  { _id: 'delivered', count: 5 },
  { _id: 'cancelled', count: 1 },
  { _id: 'pending', count: 1 }
]
```

### Task 2: Delivered orders (`$match` + `$project`)
```js
db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $project: { _id: 0, customer: 1, item: 1, qty: 1 } }
])
```
```js
[
  { customer: 'Meena', item: 'Coffee', qty: 2 },
  { customer: 'Ravi', item: 'Sandwich', qty: 1 },
  { customer: 'Karthik', item: 'Coffee', qty: 3 },
  { customer: 'Ravi', item: 'Coffee', qty: 1 },
  { customer: 'Meena', item: 'Cake', qty: 1 }
]
```

### Task 3: Revenue per item
```js
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
])
```
```js
[
  { _id: 'Coffee', totalQty: 6, revenue: 720 },
  { _id: 'Cake', totalQty: 1, revenue: 250 },
  { _id: 'Sandwich', totalQty: 1, revenue: 180 }
]
```
Coffee: (2 + 3 + 1) = 6 cups x 120 = 720.

### Task 4: Spend per customer
```js
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
])
```
```js
[
  { customer: 'Meena', orders: 2, totalSpend: 490 },
  { customer: 'Karthik', orders: 1, totalSpend: 360 },
  { customer: 'Ravi', orders: 2, totalSpend: 300 }
]
```

### Task 5: Best customer
```js
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
])
```
```js
[ { _id: 'Meena', totalSpend: 490 } ]
```

---

## File 2: `Scenario_B2_Library_Books.mongodb.js`

Syllabus focus: `$inc`, `$set`, upserts, update expressions and deleting with match conditions.

**Setup:** switches to `libraryDB`, drops `books`, then inserts 6 books (Database Systems, Operating Systems, Computer Networks, Old Almanac 1990, Torn Notes, Water-damaged Atlas).

### Task 1: Add copies with `$inc`
```js
db.books.updateOne(
  { title: "Operating Systems" },
  { $inc: { copies: 2 } }
)
```
```js
{ acknowledged: true, insertedId: null, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
```
Copies of Operating Systems change from 3 to 5.

### Task 2: Reduce copies when a book is borrowed
```js
db.books.updateOne(
  { title: "Database Systems" },
  { $inc: { copies: -1 } }
)
```
```js
{ acknowledged: true, insertedId: null, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
```
Copies of Database Systems change from 5 to 4.

### Task 3: Upsert
The same command is run twice.
```js
db.books.updateOne(
  { title: "Artificial Intelligence" },
  { $set: { author: "Russell", copies: 4, status: "available" } },
  { upsert: true }
)
```

First run (a new document is inserted):
```js
{
  acknowledged: true,
  insertedId: ObjectId('...'),
  matchedCount: 0,
  modifiedCount: 0,
  upsertedCount: 1
}
```

Second run (the document already exists, so no duplicate is created):
```js
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 0,
  upsertedCount: 0
}
```

### Task 4: `$set` and `$inc` together
```js
db.books.updateOne(
  { title: "Computer Networks" },
  { $set: { status: "available" }, $inc: { copies: 3 } }
)
```
```js
{ acknowledged: true, insertedId: null, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
```
Computer Networks now has `copies: 3` and `status: 'available'`.

### Task 5: Delete one matching document
```js
db.books.deleteOne({ title: "Old Almanac 1990" })
```
```js
{ acknowledged: true, deletedCount: 1 }
```

### Task 6: Delete many matching documents
```js
db.books.deleteMany({ status: { $in: ["damaged", "lost"] } })
```
```js
{ acknowledged: true, deletedCount: 2 }
```
Torn Notes and Water-damaged Atlas are deleted. No book has the status "lost", which is fine.

### Task 7: Verify the final data
```js
db.books.find({}, { _id: 0, title: 1, copies: 1 }).sort({ title: 1 })
```
```js
[
  { title: 'Artificial Intelligence', copies: 4 },
  { title: 'Computer Networks', copies: 3 },
  { title: 'Database Systems', copies: 4 },
  { title: 'Operating Systems', copies: 5 }
]
```
