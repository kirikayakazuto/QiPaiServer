/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-08 08:00:21
 * @LastEditTime: 2019-07-08 11:55:20
 * @LastEditors: denglang
 */
/** 
 * 连接池学习文档  http://www.mongoing.com/archives/3145 
 *  
 * */

import * as mongodb from "mongodb"
export default class MongodbDao {
    private static instance: MongodbDao = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new MongodbDao();
        }
        return this.instance;
    }
    /** 连接路径 */
    private dbUri = "mongodb://localhost:27017";
    private dbName = "testdb"
    /** 连接池 */
    private dbClientPool: mongodb.MongoClient = null;

    /** 从连接池中获得一个连接 */
    public async getConnByPool() {
        if(this.dbClientPool === null) {
            this.dbClientPool = await this.connectMongoDB(`${this.dbUri}/${this.dbName}`) as mongodb.MongoClient;
        }
        return this.dbClientPool;
    }
    /** 连接数据库 */
    private connectMongoDB = function(url: string) {
        return new Promise((resolve, reject) => {            
            mongodb.MongoClient.connect(url, {
                useNewUrlParser: true
            }, function(err: mongodb.MongoError, db: mongodb.MongoClient) {
                if(err) {
                    console.log("连接数据库时出现一个错误");
                    reject(err);
                    db.close();
                }else {
                    
                    resolve(db);                
                }
            });
        });
    }
    /** 创建一个集合 */
    public createCollection(collectionName: string) {
        let promiseDb = this.getConnByPool();
        promiseDb.then((client) => {
            let dbase = client.db(this.dbName);
            new Promise((resolve, reject) => {
                dbase.createCollection(collectionName, (err, res) => {
                    if(err) {
                        reject(err);
                        this.dbClientPool.close();
                    }else {
                        resolve(res);
                    }
                });
            });
        });
    }
    /** 插入一条文档 */
    public insertOnce(dbName: string) {
        let promiseDb = this.getConnByPool();
        promiseDb.then((client) => {
            let dbase = client.db(dbName);
            
        });
    }
    /** 查询数据 */
    public find() {

    }
    /** 测试 */
    public test() {
        this.createCollection("site3");

    }
    /**  */
    public testInsert() {
        mongodb.MongoClient.connect("mongodb://localhost:27017/testdb", {useNewUrlParser: true}, function(err, db) {
            if(err) {
                console.log("连接mongodb数据库的时候出现了一个错误!");
                return ;
            }

            let dbase = db.db("testdb");
            let myobj = {"name": "denglang", "age": 21};

            dbase.collection("site").insertOne(myobj, (err, res) => {
                if(err) throw err;
                console.log("插入文档成功!");
                db.close();
            });
        });
    }
}

MongodbDao.getInstance().test();