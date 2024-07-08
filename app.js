require("dotenv").config();
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51OvipKRxsBelap0fgjFdSYmBtCK1IybC5PnDyeHjihQpBHs32XwwGtDNOKHLnnxRo0talDZZFp3JOk1U6FdYWYgH001YYY0Kji"
);
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  allowEIO3: true,
});

// Routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const messagesRoutes = require("./routes/messageRoutes");
const verifyToken = require("./middlewares/verifyToken");
const dbConnector = require("./database/mongo");
const Token = require("./models/Token");
const { isNotFound } = require("entity-checker");
const {
  ConnectUser,
  DisconnectUser,
} = require("./controllers/socketController");
const {
  getMessagesByUserId,
  createMessage,
  addMessage,
} = require("./controllers/MessageController");
dbConnector;

io.on("connection", (socket) => {
  socket.on("connectID", (id) => {
    ConnectUser(socket.id, id);
  });
  socket.on("createMessage", async ({ senderId, receiverId }) => {
    const data = await createMessage(senderId, receiverId);
    console.log(data);
    socket.emit("messagesList", data);
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, senderId1 }) => {
      const { SocketID, newMessage } = await addMessage(
        senderId,
        receiverId,
        message,
        senderId1
      );
      if (SocketID) {
        socket.to(SocketID).emit("recievedMessage", {
          senderId,
          receiverId,
          message: newMessage,
          senderId1,
        });
      }
    }
  );
  socket.on("getMessagesList", async (id) => {
    const data = await getMessagesByUserId(id);
    socket.emit("messagesList", data);
  });

  socket.on("disconnect", () => {
    DisconnectUser(socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server Live");
});

app.use("/auth", authRoutes);
// app.use(verifyToken);
app.use("/vendors", vendorRoutes);
app.use("/profile", profileRoutes);
app.use("/products", productRoutes);
app.use("/order", orderRoutes);
app.use("/customers", customerRoutes);

// app.post("/create-payment-intent", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd",
//     });
//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating payment intent" });
//   }
// });

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method: "pm_card_visa",
    });
    console.log(paymentIntent);
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating payment intent" });
  }
});

app.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (isNotFound(token)) {
      return res.status(400).json({ message: "Authorization token missing" });
    }

    const getToken = await Token.findOne({
      token,
      assignedTo: req.user._id,
    });

    if (isNotFound(getToken) || getToken.status !== "Valid") {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    getToken.status = "Expired";
    await getToken.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// app.use("/orders", orderRoutes);
// app.use("/orders", renterRoutes);
// app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  res.status(404).send("404 - Invalid Route");
});

// Start Server
const PORT = process.env.PORT || 9876;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
