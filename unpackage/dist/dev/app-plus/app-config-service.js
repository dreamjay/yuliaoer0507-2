
var isReady=false;var onReadyCallbacks=[];
var __uniConfig = {"pages":["pages/tabbar/tabbar-1/tabbar-1","pages/tabbar/tabbar-1/qunzhuxiaoxi/qunzhuxiaoxi","pages/tabbar/tabbar-1/qunxiaoxi/qunxiaoxi","pages/tabbar/tabbar-2/tabbar-2","pages/tabbar/tabbar-2/search/search","pages/tabbar/tabbar-2/newCrowd/newCrowd","pages/tabbar/tabbar-2/newCrowd/wanfashezhi/wanfashezhi","pages/tabbar/tabbar-2/qunliao/qunliao","pages/tabbar/tabbar-2/qunliao/hongbaoxiangqing/hongbaoxiangqing","pages/tabbar/tabbar-2/qunliao/hongbaojilu/hongbaojilu","pages/tabbar/tabbar-2/qunliao/fahongbao/fahongbao","pages/tabbar/tabbar-2/qunliao/zhangdanmingxi/zhangdanmingxi","pages/tabbar/tabbar-2/qunliao/chongzhi/chongzhi","pages/tabbar/tabbar-2/qunliao/shoukuanzhanghu/shoukuanzhanghu","pages/tabbar/tabbar-2/qunliao/lianxiqunzhu/lianxiqunzhu","pages/tabbar/tabbar-2/qunliao/zhifumima/zhifumima","pages/tabbar/tabbar-4/tabbar-4","pages/tabbar/tabbar-4/query/query1","pages/tabbar/tabbar-4/query/query2","pages/tabbar/tabbar-4/query/query3","pages/tabbar/tabbar-4/query/query4","pages/tabbar/tabbar-4/query/query5","pages/tabbar/tabbar-4/query/query6","pages/tabbar/tabbar-4/query/query7","pages/tabbar/tabbar-4/query/query8","pages/tabbar/tabbar-5/tabbar-5","pages/tabbar/tabbar-5/myCenter/myCenter","pages/tabbar/tabbar-5/fenxiang/fenxiang","pages/tabbar/tabbar-5/gerenshezhi/gerenshezhi","pages/tabbar/tabbar-5/gerenshezhi/mimashezhi/mimashezhi","pages/tabbar/tabbar-5/gerenshezhi/mimashezhi/xiugaimima/xiugaimima","pages/tabbar/tabbar-5/gerenshezhi/mimashezhi/paypassword/paypassword","pages/tabbar/tabbar-5/gerenshezhi/mimashezhi/paypassword/updatePayPassword","pages/tabbar/tabbar-5/qunliao/qunliao","pages/tabbar/tabbar-5/qunzhushezhi/qunzhushezhi","pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/liaotianxinxi","pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/shanchurenyuan/shenchurenyuan","pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/renyuan/renyuan","pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/tongyong/tongyong","pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/shenqinggudong/shenqinggudong","pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/wodexiaji/wodexiaji","pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/tiaozhengguizhe/tiaozhengguizhe","pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/shangchuanma/shangchuanma","pages/login/login","pages/login/forgetPassword","pages/login/register"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#fff","backgroundColor":"#C0C0C0","softinputNavBar":"none"},"tabBar":{"borderStyle":"black","backgroundColor":"#eee","color":"#333","selectedColor":"#4CB964","list":[{"pagePath":"pages/tabbar/tabbar-1/tabbar-1","iconPath":"static/nav/icon_chat_nor.png","selectedIconPath":"static/nav/icon_chat_sel.png","text":"聊天"},{"pagePath":"pages/tabbar/tabbar-2/tabbar-2","iconPath":"static/nav/icon_txl_nor.png","selectedIconPath":"static/nav/icon_txl_sel.png","text":"通讯录"},{"pagePath":"pages/tabbar/tabbar-4/tabbar-4","iconPath":"static/nav/icon_kf_nor.png","selectedIconPath":"static/nav/icon_kf_sel.png","text":"客服"},{"pagePath":"pages/tabbar/tabbar-5/tabbar-5","iconPath":"static/nav/icon_my_nor.png","selectedIconPath":"static/nav/icon_my_sel.png","text":"我"}]},"renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"鱼聊儿","compilerVersion":"2.6.11","entryPagePath":"pages/tabbar/tabbar-1/tabbar-1","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/tabbar/tabbar-1/tabbar-1","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","titleNView":false}},{"path":"/pages/tabbar/tabbar-1/qunzhuxiaoxi/qunzhuxiaoxi","meta":{},"window":{"scrollIndicator":"none","navigationBarTitleText":"群主消息","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-1/qunxiaoxi/qunxiaoxi","meta":{},"window":{"scrollIndicator":"none","navigationBarTitleText":"群消息","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-2/tabbar-2","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","titleNView":false}},{"path":"/pages/tabbar/tabbar-2/search/search","meta":{},"window":{"titleNView":{"searchInput":{"autoFocus":true,"align":"left","backgroundColor":"#eee","borderRadius":"5px","placeholder":"请输入群ID或群名","placeholderColor":"#ccc"}}}},{"path":"/pages/tabbar/tabbar-2/newCrowd/newCrowd","meta":{},"window":{"scrollIndicator":"none","navigationBarTitleText":"创建俱乐部","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-2/newCrowd/wanfashezhi/wanfashezhi","meta":{},"window":{"navigationBarTitleText":"玩法设置","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{},"buttons":[{"text":"确定","fontSize":"14px","float":"right","width":"60px"}]}}},{"path":"/pages/tabbar/tabbar-2/qunliao/qunliao","meta":{},"window":{"scrollIndicator":"none","navigationBarTitleText":"","softinputMode":"adjustResize","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{},"buttons":[{"float":"right","text":"","fontSrc":"/static/iconfont.ttf","fontSize":"16px"}]}}},{"path":"/pages/tabbar/tabbar-2/qunliao/hongbaoxiangqing/hongbaoxiangqing","meta":{},"window":{"navigationBarTitleText":"","scrollIndicator":"none","navigationBarBackgroundColor":"#F35543","titleNView":{"titleColor":"#EDD3A2","buttons":[{"color":"#EDD3A2","text":"红包记录","fontSize":"14px","float":"right","width":"auto"}]}}},{"path":"/pages/tabbar/tabbar-2/qunliao/hongbaojilu/hongbaojilu","meta":{},"window":{"scrollIndicator":"none","navigationBarTitleText":"收到的红包","navigationBarBackgroundColor":"#F35543","titleNView":{"titleColor":"#EDD3A2"}}},{"path":"/pages/tabbar/tabbar-2/qunliao/fahongbao/fahongbao","meta":{},"window":{"navigationBarTitleText":"发红包","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-2/qunliao/zhangdanmingxi/zhangdanmingxi","meta":{},"window":{"navigationBarTitleText":"账单明细","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-2/qunliao/chongzhi/chongzhi","meta":{},"window":{"navigationBarTitleText":"充值","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-2/qunliao/shoukuanzhanghu/shoukuanzhanghu","meta":{},"window":{"navigationBarTitleText":"收款账户","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-2/qunliao/lianxiqunzhu/lianxiqunzhu","meta":{},"window":{"navigationBarTitleText":"联系信息","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-2/qunliao/zhifumima/zhifumima","meta":{},"window":{"navigationBarTitleText":"设置支付密码","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/tabbar-4","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"客服咨询","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/query/query1","meta":{},"window":{"navigationBarTitleText":"联系客服","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/query/query2","meta":{},"window":{"navigationBarTitleText":"群架构","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/query/query3","meta":{},"window":{"navigationBarTitleText":"如何充值提现？","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/query/query4","meta":{},"window":{"navigationBarTitleText":"群ID靓号","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/query/query5","meta":{},"window":{"navigationBarTitleText":"娱乐平台","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/query/query6","meta":{},"window":{"navigationBarTitleText":"开群如何盈利","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/query/query7","meta":{},"window":{"navigationBarTitleText":"投诉与建议","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-4/query/query8","meta":{},"window":{"navigationBarTitleText":"靓号推荐码","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/tabbar-5","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"个人中心"}},{"path":"/pages/tabbar/tabbar-5/myCenter/myCenter","meta":{},"window":{"navigationBarTitleText":"个人信息","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{},"buttons":[{"text":"保存","fontSize":"14px","float":"right","width":"60px"}]}}},{"path":"/pages/tabbar/tabbar-5/fenxiang/fenxiang","meta":{},"window":{"navigationBarTitleText":"","transparentTitle":"always"}},{"path":"/pages/tabbar/tabbar-5/gerenshezhi/gerenshezhi","meta":{},"window":{"navigationBarTitleText":"个人设置","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/gerenshezhi/mimashezhi/mimashezhi","meta":{},"window":{"navigationBarTitleText":"密码设置","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/gerenshezhi/mimashezhi/xiugaimima/xiugaimima","meta":{},"window":{"navigationBarTitleText":"修改登录密码","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/gerenshezhi/mimashezhi/paypassword/paypassword","meta":{},"window":{"navigationBarTitleText":"设置支付密码","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/gerenshezhi/mimashezhi/paypassword/updatePayPassword","meta":{},"window":{"navigationBarTitleText":"修改支付密码","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/qunliao/qunliao","meta":{},"window":{"navigationBarTitleText":"我的群聊","enablePullDownRefresh":true,"titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/qunzhushezhi","meta":{},"window":{"navigationBarTitleText":"群主设置","enablePullDownRefresh":true,"titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/liaotianxinxi","meta":{},"window":{"navigationBarTitleText":"聊天信息","scrollIndicator":"none","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/shanchurenyuan/shenchurenyuan","meta":{},"window":{"navigationBarTitleText":"删除成员","scrollIndicator":"none","titleNView":{"backgroundColor":"#EEEEEE","buttons":[{"text":"完成","fontSize":"14px","float":"right","width":"60px"}]}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/renyuan/renyuan","meta":{},"window":{"navigationBarTitleText":"群成员","scrollIndicator":"none","titleNView":{"backgroundColor":"#EEEEEE"}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/tongyong/tongyong","meta":{},"window":{"navigationBarTitleText":"","titleNView":{"backgroundColor":"#EEEEEE","buttons":[{"text":"完成","fontSize":"14px","float":"right","width":"60px"}]}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/shenqinggudong/shenqinggudong","meta":{},"window":{"navigationBarTitleText":"申请股东","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/wodexiaji/wodexiaji","meta":{},"window":{"navigationBarTitleText":"我的下级","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/tiaozhengguizhe/tiaozhengguizhe","meta":{},"window":{"navigationBarTitleText":"调整规则","scrollIndicator":"none","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{}}}},{"path":"/pages/tabbar/tabbar-5/qunzhushezhi/liaotianxinxi/shangchuanma/shangchuanma","meta":{},"window":{"navigationBarTitleText":"上传收款码","scrollIndicator":"none","titleNView":{"backgroundColor":"#EEEEEE","splitLine":{},"buttons":[{"text":"保存","fontSize":"14px","float":"right","width":"60px"}]}}},{"path":"/pages/login/login","meta":{},"window":{"titleNView":false}},{"path":"/pages/login/forgetPassword","meta":{},"window":{"navigationBarTitleText":"忘记密码"}},{"path":"/pages/login/register","meta":{},"window":{"navigationBarTitleText":"注册"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
