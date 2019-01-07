import axios from 'axios'

export function getSinger() {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + '/top/artists?limit=100').then((res) => {
    // axios.get('http://149.129.68.90:3000' + '/top/artists?limit=100').then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function getSongBySinger(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `/artists?id=${id}`).then((res) => {
    // axios.get('http://149.129.68.90:3000' + `/artists?id=${id}`).then((res) => {
      console.log(res)
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}
