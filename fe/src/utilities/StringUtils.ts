export default {
  isEmpty(val?: string) {
    if (!val) {
      return true;
    }
    if (val.length == 0) {
      return true;
    }
    return false;
  }
}