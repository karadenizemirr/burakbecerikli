import { SearchModel } from "src/models/search.model";
import { UserModel } from "src/models/user.model";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "administrator",
    password: "123456",
    database: "burakbecerikli",
    synchronize: true,
    logging: true,
    entities: [SearchModel,UserModel],
    subscribers: [],
    migrations: [],
})

// export const AppDataSource = new DataSource({
//     type: "mysql",
//     host: "l6glqt8gsx37y4hs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
//     port: 3306,
//     username: "vv2zkk876fvcne3n",
//     password: "mm1e4x6pdetps212",
//     database: "pl6mxovsxak2w6sb",
//     synchronize: true,
//     logging: true,
//     entities: [SearchModel,UserModel],
//     subscribers: [],
//     migrations: [],
// })