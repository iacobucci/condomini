import express from "express";
import { Express, Request, Response } from "express";
import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";

const app: Express = express();
const port = process.env.PORT || '8080';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database.sqlite'
});

class User extends Model {
	declare age: number;
	public getAge(): number {
		return this.age;
	}
}

User.init({
	// Model attributes are defined here
	username: {
		type: DataTypes.STRING,
		allowNull: false
	},
	age: {
		type: DataTypes.INTEGER
	}
}, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
});

app.get("/api/create", async (req: Request, res: Response) => {
	let username: string = req.query.username as string || "";
	let age: number = parseInt(req.query.age as string || "0");

	try {
		await User.create({
			username: username,
			age: age
		});

		res.json({ response: "ok" });
	}
	catch (err) {
		res.json({ response: "error" });
	}

});

app.get("/api/find", async (req: Request, res: Response) => {
	let username: string | null = req.query.username as string || null;
	let age: number | null = parseInt(req.query.age as string) || null;

	let users: Model[];

	if (username == null) {
		users = await User.findAll({
			where: {
				age: age
			}
		});
		res.json({ users: users });
		return;
	}

	if (age == null) {
		users = await User.findAll({
			where: {
				username: username
			}
		});
		res.json({ users: users });
		return;
	}

	users = await User.findAll({
		where: {
			username: username,
			age: age
		}
	});

	res.json({ users: users });

});

app.get("/api/findall", async (req: Request, res: Response) => {
	let users = await User.findAll();

	users.forEach((user: User) => {
		console.log(user.getAge());
	});

	res.json({ users: users });
});

app.get("/api/dump", async (req: Request, res: Response) => {
	// should download the databse.sqlite file
});

app.get("/api/restore", async (req: Request, res: Response) => {
	// should upload the databse.sqlite file
});


let DNS = "https://condomini.onrender.com";

async function selfPing() {

	while (true) {
		await fetch(DNS);
		await new Promise(resolve => setTimeout(resolve, 600000));
	}
}


sequelize.sync().then(async () => {
	console.log("[sequelize]: Database synced");
	selfPing();
	app.listen(port, () => {
		console.log(`[express]: Server is running at http://localhost:${port}`);
	});
});


