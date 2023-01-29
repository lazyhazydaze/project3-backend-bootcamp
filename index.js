// require Express NPM library
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Step 1. importing Routers
const UsersRouter = require("./routers/UsersRouter");
const GroupsRouter = require("./routers/GroupsRouter");
const FriendsRouter = require("./routers/FriendsRouter");
const InvoicesRouter = require("./routers/InvoicesRouter");
const ExpensesRouter = require("./routers/ExpensesRouter");

// Step 2. importing Controllers
const UsersController = require("./controllers/UsersController");
const GroupsController = require("./controllers/GroupsController");
const FriendsController = require("./controllers/FriendsController");
const InvoicesController = require("./controllers/InvoicesController");
const ExpensesController = require("./controllers/ExpensesController");

// Step 3. importing DB
const db = require("./db/models/index");
const {
  user,
  group,
  friendlist,
  friendrequest,
  invoice,
  expense,
  splitexpense,
} = db;

// Step 4. initializing Controllers -> note the lowercase for the first word
const usersController = new UsersController(user, group);
const groupsController = new GroupsController(group, user);
const friendsController = new FriendsController(
  friendrequest,
  friendlist,
  user
);
const invoicesController = new InvoicesController(
  invoice,
  group,
  user,
  expense,
  splitexpense
);
const expensesController = new ExpensesController(
  expense,
  user,
  splitexpense,
  group,
  invoice
);

// Step 5.initializing Routers -> note the lowercase for the first word
const usersRouter = new UsersRouter(usersController).routes();
const groupsRouter = new GroupsRouter(groupsController).routes();
const friendsRouter = new FriendsRouter(friendsController).routes();
const invoicesRouter = new InvoicesRouter(invoicesController).routes();
const expensesRouter = new ExpensesRouter(expensesController).routes();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Step 6. using the routers
app.use("/users", usersRouter);
app.use("/groups", groupsRouter);
app.use("/friends", friendsRouter);
app.use("/invoices", invoicesRouter);
app.use("/expenses", expensesRouter);

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT} yeet!`);
});
