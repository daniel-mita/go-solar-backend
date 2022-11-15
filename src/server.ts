import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import sequelize from "./config/sequelize/connection"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUI from "swagger-ui-express"
import userRoute from "./routes/userRoute"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 8080

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
  next()
})


const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: `http://localhost:${PORT}`,
			},
		],
	},
	apis: ["./routes/*.ts"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//MySql connection
require("./config/sequelize/connection")

sequelize
  .authenticate()
  .then(() =>
    console.log("Connection to database has been established successfully.")
  )
  .catch((err) => console.error(err))

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`)
})

app.use('/user', userRoute);

app.use("*", (err, req, res, next) => {
  res.status(err.code).json({
    message: err.message,
  })
})
