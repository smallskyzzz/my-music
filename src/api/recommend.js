import axios from 'axios'
function getBanner() {
  let promise = new Promise((resolve, reject) => {
    // axios.get('/api' + '/banner').then((res) => { // 当部署到阿里云上时间，需要用下面的ip
    axios.get('http://47.93.219.17:3000' + '/banner').then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })

  return promise
}

function getPersonalized() {
  let promise = new Promise((resolve, reject) => {
    // axios.get('/api' + '/personalized').then((res) => {
    axios.get('http://47.93.219.17:3000' + '/personalized').then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })

  return promise
}

export function getPersonalizedSongs() {
  let promise = new Promise((resolve, reject) => {
    axios.get('http://47.93.219.17:3000' + '/personalized/newsong').then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })

  return promise
}

export function getRecommend() {
  return Promise.all([getBanner(), getPersonalized()])
}

export function getDetail(id) {
  let promise = new Promise((resolve, reject) => {
    // axios.get('/api' + `/playlist/detail?id=${id}`).then((res) => {
    axios.get('http://47.93.219.17:3000' + `/playlist/detail?id=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function getMV() {
  let promise = new Promise((resolve, reject) => {
    axios.get('http://47.93.219.17:3000' + '/mv/first?limit=10').then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function getMVUrl(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get(`http://47.93.219.17:3000/mv/url?id=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}
