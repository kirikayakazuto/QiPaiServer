class ServiceConfig {
    private static instance: ServiceConfig = null;
    public static getInstance() {
        if(this.instance === null) {
            this.instance = new ServiceConfig();
        }
        return this.instance;
    }

    public HOST = "127.0.0.1";

    /**  */
    public WebServerConfig = {
        host: this.HOST,
        port: 10001,
    }
    /** gateway配置 */
    public GateWayConfig = {
        host: this.HOST,
        port: 6080
    }


}
export default ServiceConfig.getInstance();