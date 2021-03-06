import regeneratorRuntime from './runtime.js'

const app = getApp()

// 拿关键字
const getKeyWords = async () => {
  const time = new Date().getTime()
  let cardKeys = {}
  const keyWordsObj = wx.getStorageSync('keyWordsObj')
  if (keyWordsObj && keyWordsObj.data && (keyWordsObj.time + 86400000 * 7) >= time) {
    cardKeys = keyWordsObj.data
  } else {
    const keyRes = await app.apiRequst('keyWords')
    wx.setStorageSync('keyWordsObj', { data: keyRes.data, time })
    cardKeys = keyRes.data
  }
  return cardKeys
}

// 拿全部风景
const getViews = async () => {
  const time = new Date().getTime()
  let obj = {}
  const viewsObj = wx.getStorageSync('viewsObj')
  if (viewsObj && viewsObj.data && (viewsObj.time + app.globalData.storageTime) >= time) {
    obj = viewsObj
  } else {
    const views = {}
    const viewRes = await app.apiRequst('views')
    for (const item of viewRes.data) {
      views[item.id] = item
    }
    obj = {
      data: views,
      time,
      baseData: viewRes.data
    }
    wx.setStorageSync('viewsObj', obj)
  }
  return obj
}

// 拿祝福语
const getWishes = async () => {
  const time = new Date().getTime()
  let obj = {}
  const wishesObj = wx.getStorageSync('wishesObj')
  if (wishesObj && wishesObj.data && (wishesObj.time + app.globalData.storageTime) >= time) {
    obj = wishesObj
  } else {
    const wishes = {}
    const wishesRes = await app.apiRequst('wishes')
    for (const item of wishesRes.data) {
      wishes[item.id] = item
    }
    obj = {
      data: wishes,
      time,
      baseData: wishesRes.data
    }
    wx.setStorageSync('wishesObj', obj)
  }
  return obj
}

// 拿风景详情
const getViewDetail = async (id) => {
  const time = new Date().getTime()
  let obj = wx.getStorageSync('viewDetailObj')
  if (obj && obj.data && (obj.time + app.globalData.storageTime) >= time) {
    
  } else {
    obj = {
      data: {}
    }
  }
  if (!obj.data.hasOwnProperty(id)) {
    const viewDetail = {}
    const viewDetailRes = await app.apiRequst('viewDetail', {}, id)
    obj.data[id] = viewDetailRes.data
    obj.time = time
    wx.setStorageSync('viewDetailObj', obj)
  }
  return obj
}

// 拿分类
const getCategories = async () => {
  const time = new Date().getTime()
  let obj = {}
  const categoryObj = wx.getStorageSync('categoryObj')
  if (categoryObj && categoryObj.data && (categoryObj.time + app.globalData.storageTime) >= time) {
    obj = categoryObj
  } else {
    const category = {}
    const categoryRes = await app.apiRequst('categories')
    for (const item of categoryRes.data) {
      category[item.id] = item
    }
    obj = {
      data: category,
      time,
      baseData: categoryRes.data
    }
    wx.setStorageSync('categoryObj', obj)
  }
  return obj
}

export default {
  getKeyWords,
  getViews,
  getWishes,
  getViewDetail,
  getCategories
}