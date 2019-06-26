# Netbus -> 网络总线
本质就是一个消息传输介质, 客户端与服务端的消息都使用netbus传输

消息的格式 统一使用buffer进行传输读取, 使用protobufjs协议
stype, ctype, body, uid 4部分组成
stype用于指定哪一个自定义服务
ctype用于自定义服务的哪一个任务
body用于传输自定义数据
uid表示是哪一个用户传输的

# ServiceManager    -> 管理所有的自定义服务

# ServiceInterface  -> 自定义服务必须实现的接口