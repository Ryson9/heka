import Http from './utils/http.js'
import regeneratorRuntime from './utils/runtime.js'

const http = new Http();

App({
  async onLaunch () {
  },
  loadArtFont() {
    wx.loadFontFace({
      family: 'artfont',
      source: 'url("https://fuwu.saasphp.cn/FZYanSJW.TTF")',
      success(res) {
        // console.log(res.status)
      },
      fail: function (res) {
        // console.log(res.status)
      },
      complete: function (res) {
        // console.log(res.status)
      }
    })
  },
  globalData: {
    userInfo: null,
    storageTime: 86400000, // 数据本地缓存时间
  },
  async apiRequst(api, params = {}, queryString = '') {
    return await http.request(api, params, queryString);
  }
})