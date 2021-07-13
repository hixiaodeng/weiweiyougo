// 网络请求
import { getCategory } from "../../api/category";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], // 左侧的菜单数据
    rightContent: [], // 右侧的商品数据
    isActive: 0 // 点击的激活
  },

  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    /* 
      使用缓存技术
      1 先判断本地存储中有没有旧的数据
      2 没有旧的数据 直接发送请求
      3 有旧的数据 同时旧的数据没有过期 就使用 本地存储中的旧数据
    */
    const storage = wx.getStorageSync('cates')
    if (!storage) {
      // 发送请求
      this._getCategory()
    } else {
      // 旧的数据没有过期 就使用旧的数据 旧的数据过期了就重新发送请求
      if (Date.now() - storage.time > 1000 * 300) {
        // 就从新发送请求
        this._getCategory()
      } else {
        // 没有过期 就是使用旧的数据 渲染页面
        this.Cates = storage.data
        const leftMenuList = this.Cates.map(item => item.cat_name)
        const rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  async _getCategory() {
    const { data } = await getCategory()
    this.Cates = data.message

    // 就把这个数据存起来
    // 这种格式 {time:Date.now(),data:...}
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })

    const leftMenuList = this.Cates.map((item) => item.cat_name)
    const rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 点击左侧
  handleTap(e) {
    /* 
      1 获取被点击的标题身上的索引
      2 给 data 中的 isActive 赋值就可以了
      3 根据不同的索引来渲染右侧的商品内容
    */
    const { index } = e.currentTarget.dataset
    const rightContent = this.Cates[index].children
    this.setData({
      isActive: index,
      rightContent
    })
  }

})