var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users.route");
var videosRouter = require("./routes/videos.route");
var commentsRouter = require("./routes/comments.route");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.set('json spaces', 4);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/u", usersRouter);
app.use("/videos", videosRouter);
app.use("/comments", commentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server started on port ${PORT}`);

module.exports = app;
