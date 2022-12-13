export function remove(arr, find) {
  if (arr) {
    const index = arr.findIndex(find);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }
  return arr;
}
