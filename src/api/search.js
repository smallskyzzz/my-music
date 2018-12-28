import axios from 'axios'

export function getHot() {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + 'search/hot').then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

function getSearch(name, type) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `search?keywords=${name}&type=${type}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function search(name) {
  return Promise.all([getSearch(name, 10), getSearch(name, 1)])
}

// export function search(name) {
//   let timer
//   if (timer) {
//     clearTimeout(timer)
//   }
//   timer = setTimeout(() => {
//     return lessSearch(name)
//   }, 200)
// }
