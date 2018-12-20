import axios from 'axios'
export function getBanner() {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + 'banner').then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })

  return promise
}

export function getPersonalized() {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + 'personalized').then((res) => {
      console.log(res)
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })

  return promise
}
