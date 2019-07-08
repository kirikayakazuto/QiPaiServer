/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-08 08:00:21
 * @LastEditTime: 2019-07-08 16:43:58
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
    public async createCollection(collectionName: string) {
        let promiseDb: any = await this.getConnByPool();
        let dbase = promiseDb.db(this.dbName);
        return await new Promise((resolve, reject) => {
            dbase.createCollection(collectionName, (err, res) => {
                if(err) {
                    reject(err);
                    this.dbClientPool.close();
                }else {
                    resolve(res);
                }
            });
        });
    }
    /** 插入一条文档 */
    public async insertOnce(collectionName: string, obj: any) {
        let promiseDb = await this.getConnByPool();
        let dbase = promiseDb.db(this.dbName)
        return await new Promise((resolve, reject) => {
            dbase.collection(collectionName).insertOne(obj, (err, res) => {
                if(err) {
                    reject(err);
                }else {
                    resolve(res);
                }
            });
        });
    }
    /** 查找文档 */
    public async find(collectionName: string, conditions?: any) {
        let promiseDb = await this.getConnByPool();
        let dbase = promiseDb.db(this.dbName)
        let res = await dbase.collection(collectionName).find(conditions).toArray();
        return res;
    }
    
    /** 删除文档 */
    public async deleteByConditions(collectionName: string, conditions: any) {
        let promiseDb = await this.getConnByPool();
        let dbase = promiseDb.db(this.dbName);
        return await new Promise((resolve, reject) => {
            dbase.collection(collectionName).deleteOne(conditions, (err, res) => {
                if(err) {
                    reject(err);
                }else {
                    resolve(res);
                }
            });
        });
    }
    /** 删除全部 */
    public async deleteAll(collectionName: string) {
        
    }

    public async dropCollection() {
        
    }
}

MongodbDao.getInstance().find("site4");