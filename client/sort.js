function merge(left, right) {
  let sortedArr = [];

  while (left.length && right.length) {
    if (left[0] < right[0]) {
      sortedArr.push(left.shift());
    } else {
      sortedArr.push(right.shift());
    }
  }
  return [...sortedArr, ...left, ...right];
}

function mergeSort(arr) {
  const half = arr.length / 2;
  if (arr.length <= 1) {
    return arr;
  }
  const left = arr.splice(0, half);
  const right = arr;
  return merge(mergeSort(left), mergeSort(right));
}

function maxLenght(arr) {
  if (arr.length < 2) {
    return 0;
  }
  let maxArr = [];
  let sort = mergeSort(arr);
  for (let i = 0; i < sort.length - 1; i++) {
    maxArr.push(sort[i + 1] - sort[i]);
  }
  return Math.max(...maxArr);
}

var nums = [3, 6, 9, 1];
console.log(maxLenght(nums));
