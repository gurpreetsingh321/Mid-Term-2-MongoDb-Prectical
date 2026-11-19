use("libraryDB");

db.books.drop();

db.books.insertMany([
  { _id: 1, title: "Database Systems", author: "Elmasri", copies: 5, status: "available" },
  { _id: 2, title: "Operating Systems", author: "Galvin", copies: 3, status: "available" },
  { _id: 3, title: "Computer Networks", author: "Tanenbaum", copies: 0, status: "unavailable" },
  { _id: 4, title: "Old Almanac 1990", author: "Unknown", copies: 0, status: "unavailable" },
  { _id: 5, title: "Torn Notes", author: "Unknown", copies: 0, status: "damaged" },
  { _id: 6, title: "Water-damaged Atlas", author: "Unknown", copies: 1, status: "damaged" }
]);

print("\n--- Task 1: Add copies with $inc ---");
printjson(
  db.books.updateOne(
    { title: "Operating Systems" },
    { $inc: { copies: 2 } }
  )
);

print("\n--- Task 2: Reduce copies when a book is borrowed ---");
printjson(
  db.books.updateOne(
    { title: "Database Systems" },
    { $inc: { copies: -1 } }
  )
);

print("\n--- Task 3 (First Run): Upsert ---");
printjson(
  db.books.updateOne(
    { title: "Artificial Intelligence" },
    { $set: { author: "Russell", copies: 4, status: "available" } },
    { upsert: true }
  )
);

print("\n--- Task 3 (Second Run): Upsert ---");
printjson(
  db.books.updateOne(
    { title: "Artificial Intelligence" },
    { $set: { author: "Russell", copies: 4, status: "available" } },
    { upsert: true }
  )
);

print("\n--- Task 4: Update expression with $set and $inc together ---");
printjson(
  db.books.updateOne(
    { title: "Computer Networks" },
    { $set: { status: "available" }, $inc: { copies: 3 } }
  )
);

print("\n--- Task 5: Delete one matching document ---");
printjson(db.books.deleteOne({ title: "Old Almanac 1990" }));

print("\n--- Task 6: Delete many matching documents ---");
printjson(db.books.deleteMany({ status: { $in: ["damaged", "lost"] } }));

print("\n--- Task 7: Verify the final data ---");
printjson(
  db.books.find({}, { _id: 0, title: 1, copies: 1 }).sort({ title: 1 }).toArray()
);
