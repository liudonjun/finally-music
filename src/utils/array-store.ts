import storage from 'good-storage'

function inertArray(arr:any, val:any, compare:any, maxLen:any) {
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

function deleteFromArray(arr:any, compare:any) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save(item:any, key:any, compare:any, maxLen:any) {
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove(key:any, compare:any) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key:any) {
  return storage.get(key, [])
}

export function clear(key:any) {
  storage.remove(key)
  return []
}

export function saveAll(items:any, key:any) {
  storage.set(key, items)
}
