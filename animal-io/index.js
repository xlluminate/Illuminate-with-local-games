window.screenOrientation = "sensor_landscape",
    loadLib("libs/laya.core.js"),
    loadLib("libs/laya.ani.js"),
    loadLib("libs/laya.ui.js"),
    loadLib("libs/laya.d3.js"),
    loadLib("libs/laya.physics3D.js"),
    loadLib("stage1/bundle_.js");
// const loadTask = wx.loadSubpackage({
//     name: "stage1",
//     // name 可以填 name 或者 root
//     success: function(res) {
//         // 分包加载成功后通过 success 回调
//     },
//     fail: function(res) {
//         // 分包加载失败通过 fail 回调
//     }
// });