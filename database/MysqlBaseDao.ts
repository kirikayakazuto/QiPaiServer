import * as mysql from "mysql"
export default class MySqlBaseDao {
    private static instance: MySqlBaseDao = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new MySqlBaseDao();
        }
        return this.instance;
    }

    private connectPool: mysql.Pool = null;
    /** 连接mysql数据库 */
    public ConnectToMysql(host: string, port: number, dbName: string, uname: string, upwd: string) {
        this.connectPool = mysql.createPool({
            host: host,
            port: port,
            database: dbName,
            user: uname,
            password: upwd,
        });
    }

    /** 同步查询语句 */
    public executeSql(sql: string) {
        return new Promise((resolve, reject) => {
            this.connectPool.getConnection((err: mysql.MysqlError, conn: mysql.PoolConnection) => {
                if(err) {
                    reject(err);
                }else {
                    conn.query(sql, (err, rows: Array<any>) => {
                        if(err) {
                            reject(err);
                        }else {
                            resolve(rows);
                        }
                        conn.release();
                    });
                }
            });
        });
    }
}