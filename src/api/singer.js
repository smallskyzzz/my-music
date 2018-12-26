import axios from 'axios'

export function getSinger() {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + 'top/artists?limit=100').then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function getSongBySinger(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `artists?id=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}
