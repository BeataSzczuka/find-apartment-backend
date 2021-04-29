import { Application }from "express";
import { Routes } from '../routes/routes';

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
class App {
    public app: Application;
    public databaseUrl: string = process.env.MONGODB_URI || 'mongodb://localhost/find-apartment-db';
    
    private routes: Routes = new Routes(); 
    constructor() {
        this.app = express();
        this.config();
        dotenv.config();
        this.setupMongoDB();
        this.routes.route(this.app);
    }

    private async setupMongoDB(){
        mongoose.connect(this.databaseUrl,  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    }

    private config(): void {
        this.app.use(bodyParser.json()); // support application/json type post data
        this.app.use(bodyParser.urlencoded({extended: true}))
          

    }
}

export default new App().app;
