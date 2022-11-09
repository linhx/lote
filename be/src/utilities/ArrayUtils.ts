export const diff = (
  arr1: any[],
  arr2: any[],
  compare: (ele1: any, ele2) => boolean,
) => {
  const result = [];
  for (const ele1 of arr1) {
    for (const ele2 of arr2) {
      if (!compare(ele1, ele2)) {
        result.push(ele1);
      }
    }
  }
  return result;
};

export const diffBoth = (
  arr1: any[],
  arr2: any[],
  compare: (ele1: any, ele2) => boolean,
): { left: any[]; right: any[] } => {
  const diff1 = [];
  const diff2Index: boolean[] = new Array(arr2.length);
  for (const ele1 of arr1) {
    let isInclude = false;
    for (let i = 0; i < arr2.length; i++) {
      const ele2 = arr2[i];
      if (compare(ele1, ele2)) {
        isInclude = true;
        diff2Index[i] = true;
      }
    }
    if (!isInclude) {
      diff1.push(ele1);
    }
  }

  const diff2 = [];
  for (let i = 0; i < diff2Index.length; i++) {
    if (!diff2Index[i]) {
      diff2.push(arr2[i]);
    }
  }

  return {
    left: diff1,
    right: diff2,
  };
};
