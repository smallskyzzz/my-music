import storge from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

function insertArray(arr, val, compare, maxLen) { // 将某个搜索插入到现有的历史中
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch(query) { // 保存搜索历史
  let searches = storge.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storge.set(SEARCH_KEY, searches)
  return searches
}

export function getSearch() { // 得到搜索历史
  return storge.get(SEARCH_KEY, [])
}

function deleteFromArray(arr, query) {
  const index = arr.findIndex((item) => {
    return item === query
  })
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

export function deleteSearch(query) {
  let searches = storge.get(SEARCH_KEY, [])
  searches = deleteFromArray(searches, query)
  storge.set(SEARCH_KEY, searches)
  return searches
}
