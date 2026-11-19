# MongoDB Mid Term 2 Practical - Set B

---

## File 1: `Scenario_B1_Cafe_Orders.mongodb.js`

### Task 1: Count orders by status
```js
[
  { _id: 'delivered', count: 5 },
  { _id: 'cancelled', count: 1 },
  { _id: 'pending', count: 1 }
]
```

### Task 2: Delivered orders (`$match` + `$project`)
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
[
  { _id: 'Coffee', totalQty: 6, revenue: 720 },
  { _id: 'Cake', totalQty: 1, revenue: 250 },
  { _id: 'Sandwich', totalQty: 1, revenue: 180 }
]
```
Coffee: (2 + 3 + 1) = 6 cups x 120 = 720.

### Task 4: Spend per customer
```js
[
  { customer: 'Meena', orders: 2, totalSpend: 490 },
  { customer: 'Karthik', orders: 1, totalSpend: 360 },
  { customer: 'Ravi', orders: 2, totalSpend: 300 }
]
```

### Task 5: Best customer
```js
[ { _id: 'Meena', totalSpend: 490 } ]
```

---

## File 2: `Scenario_B2_Library_Books.mongodb.js`

### Task 1: Add copies with `$inc`
```js
{ acknowledged: true, insertedId: null, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
```
Copies of Operating Systems change from 3 to 5.

### Task 2: Reduce copies when a book is borrowed
```js
{ acknowledged: true, insertedId: null, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
```
Copies of Database Systems change from 5 to 4.

### Task 3: Upsert

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
{ acknowledged: true, insertedId: null, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
```
Computer Networks now has `copies: 3` and `status: 'available'`.

### Task 5: Delete one matching document
```js
{ acknowledged: true, deletedCount: 1 }
```

### Task 6: Delete many matching documents
```js
{ acknowledged: true, deletedCount: 2 }
```
Torn Notes and Water-damaged Atlas are deleted. No book has the status "lost", which is fine.

### Task 7: Verify the final data
```js
[
  { title: 'Artificial Intelligence', copies: 4 },
  { title: 'Computer Networks', copies: 3 },
  { title: 'Database Systems', copies: 4 },
  { title: 'Operating Systems', copies: 5 }
]
```
