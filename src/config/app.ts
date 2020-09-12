import { Application }from "express";
import { ApartmentRoutes } from '../routes/routes';
import * as bodyParser from "body-parser";

const express = require("express");
const mongoose = require("mongoose");

class App {
    public app: Application;
    public databaseUrl: string = 'mongodb://localhost/find-apartment-db';
    
    private routes: ApartmentRoutes = new ApartmentRoutes(); 
    constructor() {
        this.app = express();
        this.config();
        this.setupMongoDB();
        this.routes.route(this.app);
    }

    private setupMongoDB(){
        mongoose.connect(this.databaseUrl,  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    }

    private config(): void {
        this.app.use(bodyParser.json()); // support application/json type post data
        this.app.use(bodyParser.urlencoded({extended: false})) //support application/x-www-form-urlencoded post data
    }
}

export default new App().app;
