import axios from 'axios'

export function getSongUrl(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `song/url?id=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function getSongDuration(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `song/detail?ids=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}
