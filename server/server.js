import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { GitHub } from "./config/auth.js";
import pool from "./config/database.js";
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import activitiesRoutes from "./routes/activities.js";
import destinationsRoutes from "./routes/destinations.js";
import tripsDestinationsRoutes from "./routes/trips_destinations.js";
import usersRoutes from "./routes/users.js";
import tripsUsersRoutes from "./routes/tripsUsers.js";
import userTripsRoutes from "./routes/user-trips.js";

const app = express();
app.use(
  session({
    secret: "codepath",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.json());
app.use(
  cors({
    origin: "https://onthefly-client-production.up.railway.app",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);

passport.serializeUser((user, done) => {
  done(null, user.githubid);
});

passport.deserializeUser((githubid, done) => {
  pool.query(
    "SELECT * FROM users WHERE githubid = $1",
    [githubid],
    (err, results) => {
      if (err) {
        return done(err);
      }
      return done(null, results.rows[0]);
    },
  );
});

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top 50px;"> ✈️ On the Fly API</h1>',
    );
});

app.use("/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/destinations", destinationsRoutes);
app.use("/api/trips_destinations", tripsDestinationsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/trips_users", tripsUsersRoutes);
app.use("/api/users-trips", userTripsRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
