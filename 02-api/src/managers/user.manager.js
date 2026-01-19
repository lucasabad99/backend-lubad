import fs from "fs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

class UserManager {
    constructor(path){
        this.path = path;
    }

    async getUsers(){
        try {
            if(!fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, "utf-8")
            return JSON.parse(data);
        }   catch (error) {
            console.error("Error reading users:", error);
        }
    }

    async getById(id){
        try {
            const users = await this.getUsers();
            const user = users.find((u) => u.id === id);
            if(!user) throw new Error("User not found");
            return user 
        } catch (error) {
            throw error;
        }
    }

   async register(body){
        try {
        const users = await this.getUsers();
        const user = {id:uuidv4() , ...body };
        console.log(user)
        user.password = bcrypt.hashSync(user.password, 10);
        users.push(user);
        await fs.promises.writeFile(this.path, JSON.stringify(users))
        return user;
        } catch (error) {
        throw new Error("Error creating user:", error);    
        }
    }

    async login(email, password){
        try {
            const users = await this.getUsers();
            const user = users.find(u => u.email === email);
            if(!user) throw new Error("invalid credentials");
            const isValidPass = bcrypt.compareSync(password, user.password);
            if(!isValidPass) throw new error("Invalid credentials")
            return "LOGIN OK";             
        } catch (error) {
            throw new Error("Login error", error);  
        }
    }

    async update(id, body){
        try {
            const user = await this.getById(id);
            const users = await this.getUsers();
            const index = users.findIndex((u) => u.id === id);
            users[index] = { ...user, ...body };
            return users[index];
        } catch (error) {
            throw new Error(error)            
        }
    }

    async delete(id){
        try {
            const user = await this.getById(id);
            const users = await this.getUsers();
            const index = users.findIndex((u) => u.id === id);
            users.splice(index, 1);
            return user; 
        } catch (error) {
            throw new Error(error)             
        }
    }

}

export const Manager = new UserManager('./users.json');

const user1 = {first_name: "Lucas", last_name: "Abad", email: "lucasabad@gmail.com", password: "1234"};

const user2 = {first_name: "Javier", last_name: "Manno", email: "javi.manno@gmail.com", password: "4321"};

await Manager.register(user1);
await Manager.register(user2);

//console.log(Manager.getUsers());

console.log(await Manager.login('lucasabad@gmail.com', "1234"));