import UserCenterCtype from "../apps/UserCenter/UserCenterCtype";

class ServerConfig {
    private static instance: ServerConfig = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new ServerConfig();
        }
        return this.instance;
    }

    /** Host */
    public HOST = "127.0.0.1";

    

    /**  */
    public WebServerConfig = {
        host: this.HOST,
        port: 10001,
    }
    /** gateway配置 */
    public GateWayConfig = {
        "AdminService": {
            stype: 101,
        },
        "GateWayService": {
            stype: 100,
            host: this.HOST,
            port: 6010
        }
    }
    
    public ServicesConfig = {
        "UserCenterService": {
            stype: 1,
            host: this.HOST,
            port: 6021,
        },
    }

    public LoginCommand = [
        {
            stype: this.ServicesConfig.UserCenterService.stype,
            ctype: UserCenterCtype.GuestLogin,
        },
        {
            stype: this.ServicesConfig.UserCenterService.stype,
            ctype: UserCenterCtype.AccountLogin,
        }
    ];


}
export default ServerConfig.getInstance();