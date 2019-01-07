import axios from 'axios'

const RANKS = [0, 1, 2, 3, 7, 14, 15, 17, 18]

function getRank(id) {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api' + `/top/list?idx=${id}`).then((res) => {
    // axios.get('http://149.129.68.90:3000' + `/top/list?idx=${id}`).then((res) => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return promise
}

export function getRanks() {
  // let promise = new Promise(resolve, reject)
  let funcs = []
  for (let i = 0; i < RANKS.length; i++) {
    funcs.push(getRank(i))
  }
  return Promise.all(funcs)
}
