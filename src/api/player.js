import axios from 'axios'

export function getSongUrl(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `/song/url?id=${id}`).then((res) => {
    // axios.get('http://149.129.68.90:3000' + `/song/url?id=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function getSongDuration(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `/song/detail?ids=${id}`).then((res) => {
    // axios.get('http://149.129.68.90:3000' + `/song/detail?ids=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function getSongLyric(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `/lyric?id=${id}`).then((res) => {
    // axios.get('http://149.129.68.90:3000' + `/lyric?id=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}
