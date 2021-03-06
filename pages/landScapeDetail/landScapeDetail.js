import util from '../../utils/util.js'
import regeneratorRuntime from '../../utils/runtime.js'
import apiCollection from '../../utils/apiCollection.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 0,
    showSwiperIndex: 0,
    readMoreFlag: false,
    viewsData: {}, // 风景详情数据
    viewsBaseData: [], // 风景全部数据
    randViewData: [],
    imgUrls: [],
    swiperError: 0,
    preIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 下载字体
    app.loadArtFont();
    
    const {id} = options
    // 拿风景详情
    let viewsDetailObj = await apiCollection.getViewDetail(id)
    const viewsData = viewsDetailObj.data[id] || {}
    const imgUrls = []
    const { imgs} = viewsData.album
    imgs.forEach(item => {
      imgUrls.push(item.api_path)
    })

    // 拿风景
    let viewsObj = await apiCollection.getViews()
    const viewsBaseData = viewsObj.baseData || []

    // 其它景点，随机得到三个不重复的景点
    const randViewData = []
    
    if (viewsBaseData.length > 4) {
      do {
        const rand = Math.floor(Math.random() * viewsBaseData.length)
        if (viewsBaseData[rand].id !== parseInt(id)) {
          let flag = true
          for (let i = 0; i < randViewData.length; i++) {
            if (randViewData[i].id === viewsBaseData[rand].id) {
              flag = false
            }
          }
          if (flag) {
            randViewData.push(viewsBaseData[rand])
          }
        }
      } while (randViewData.length < 3)
    } else {
      for (let i = 0; i < viewsBaseData.length; i++) {
        if (viewsBaseData[i].id !== parseInt(id)) {
          randViewData.push(item)
        }
      }
    }

    this.setData({
      viewsData,
      viewsBaseData,
      randViewData,
      imgUrls
    })
  },

  readMoreFn() {
    this.setData({
      readMoreFlag: true
    })
  },

  
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  swiperClick() {
    const { swiperIndex, imgUrls} = this.data
    wx.previewImage({
      urls: imgUrls,
      current: imgUrls[swiperIndex]
    })
  },

  swiperLeft() {
    const { swiperIndex, imgUrls } = this.data
    let showSwiperIndex = swiperIndex - 1
    if (swiperIndex === 0) {
      showSwiperIndex = imgUrls.length - 1
    }
    this.setData({
      showSwiperIndex
    })
  },

  swiperRight() {
    const { swiperIndex, imgUrls } = this.data
    let showSwiperIndex = swiperIndex + 1
    if (swiperIndex === imgUrls.length - 1) {
      showSwiperIndex = 0
    }
    this.setData({
      showSwiperIndex
    })
  },

  goMakeCard() {
    const { viewsData } = this.data
    wx.redirectTo({
      url: `/pages/makeCard/makeCard?newCard=true&viewId=${viewsData.id}`,
    })
  },

  goNewDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.redirectTo({
      url: `/pages/landScapeDetail/landScapeDetail?id=${id}`,
    })
  },

  goMain() {
    wx.navigateBack({
      delta: 1
    })
  },

  changeSwip(detail) {
    if (detail.detail.source == "touch") {
      let { swiperError, preIndex } = this.data
      //当页面卡死的时候，current的值会变成0 
      if (detail.detail.current == 0) {
        //有时候这算是正常情况，所以暂定连续出现3次就是卡了
        let swiperError = swiperError
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) { //在开关被触发3次以上
          console.error(swiperError)
          this.setData({ showSwiperIndex: preIndex });//，重置current为正确索引
          this.setData({ swiperError: 0 })
        }
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
  }
  
})