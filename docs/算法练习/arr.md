---
order: 1
title: '数组算法'
nav:
  title: 算法练习
  order: 2
---

# 数组算法集训营

## 1、求任意数组中的两项之和

给出一个整数数组，请在数组中找出两个加起来等于目标值的数，

你给出的函数 twoSum 需要返回这两个数字的下标（index1，index2），需要满足 index1 小于 index2.。注意：下标是从 1 开始的

假设给出的数组中只存在唯一解
例如：给出的数组为 [20, 70, 110, 150] , 目标值为 90，输出 index1 = 1, index2 = 2

```js
// 79ms
const twoSum1 = (numbers, target) => {
  for (let index = 0; index < numbers.length; index++) {
    const element = numbers[index];
    let findIndex = numbers.findIndex(
      (item, i) => item === target - element && i != index,
    ); //循环太多余
    if (findIndex != -1) {
      return [index + 1, findIndex + 1];
    }
  }
};

// 46ms
const twoSum = (numbers, target) => {
  const map = new Map();
  for (let i = 0; i < numbers.length; i++) {
    console.log('进来几次', numbers[i]);
    // 初始话的map肯定是个空的
    // 第二次进来的就不是3了  而是第二次循环的2  所以对比之下就能排除了我们写的那个排除自身的逻辑了
    if (map.has(target - numbers[i])) {
      return [map.get(target - numbers[i]) + 1, i + 1];
    } else {
      // 第一次将3放进去 和他的下标i
      map.set(numbers[i], i);
    }
  }
};
```

## 2、数组中相加和为 0 的三元组

```js
function threeSum(num) {
  let temp = [];
  let res = [];
  num.sort((a, b) => a - b);
  find(num, 0, temp, res);
  return res;
  function find(num, start, temp, res) {
    if (temp.length == 3) {
      const [a, b, c] = temp;
      if (a + b + c == 0) {
        res.push([...temp]);
        return;
      }
    }
    for (let index = start; index < num.length; index++) {
      const element = num[index];
      // 主要目的就是去重
      if (index > start && element == num[index - 1]) {
        continue;
      }
      temp.push(element);
      find(num, index + 1, temp, res);
      temp.pop();
    }
  }
}

function threeSum1(num) {
  // write code here
  num.sort((a, b) => a - b);
  let res = [],
    len = num.length;
  for (let i = 0; i < len - 2; i++) {
    let j = i + 1,
      k = len - 1;
    // k , j 分别表示尾部开始的最后一项和当前想的下一项
    if (i == 0 || num[i] != num[i - 1]) {
      while (k > j) {
        if (num[i] + num[j] + num[k] == 0) {
          // 满足条件 直接放进
          res.push([num[i], num[j], num[k]]);
          // 头部去重（如果后面一个数跟当前的数字相等，则代表有重复的结果生成，跳过）
          while (j + 1 < k && num[j + 1] === num[j]) j++;
          // 尾部去重（如果前面一个数跟当前的数字相等，则代表有重复的结果生成，跳过）
          while (k - 1 > j && num[k - 1] === num[k]) k--;

          k--;
          j++;
        } else if (num[i] + num[j] + num[k] > 0) {
          // 因为当前数组是按照从小到大排序的  所以如果三项大于0 肯定越往后越大于0
          // 反之一样
          k--;
        } else if (num[i] + num[j] + num[k] < 0) {
          j++;
        }
      }
    }
  }
  return res;
}

console.log(threeSum([-2, 0, 1, 1, 2, -3, -4, 3, 4, -3, 3]), 'threeSum'); //[[-2,0,2],[-2,1,1]]
console.log(threeSum1([-2, 0, 1, 1, 2, -3, -4, 3, 4, -3, 3]), 'threeSum1'); //[[-2,0,2],[-2,1,1]]
```

## 3、缺失数

从 0,1,2,...,n 这 n+1 个数中选择 n 个数，组成有序数组，
找出这 n 个数中缺失的那个数，要求 O(n)尽可能小。

```js
function solve(a) {
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    if (element + 1 != a[index + 1]) {
      return element + 1;
    }
  }
}

function solve1(a) {
  let index = 0;
  while (a[index] + 1 === a[index + 1]) {
    index++;
  }
  return a[index] + 1;
}

function solve2(a) {
  // write code here
  let left = 0,
    right = a.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (a[mid] === mid) {
      left = mid + 1;
    } else if (a[mid] > mid) {
      right = mid;
    }
  }
  return left;
}

console.log(solve([0, 1, 2, 3, 4, 5, 7])); //6
```

## 4、数组奇偶性分离

输入一个整数数组，实现一个函数来调整该数组中数字的顺序，

使得所有的奇数位于数组的前半部分，所有的偶数位于数组的后半部分，

并保证奇数和奇数，偶数和偶数之间的相对位置不变。

```js
function reOrderArray(array) {
  let arr1 = [];
  let arr2 = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element % 2) {
      // 奇数
      arr1.push(element);
    } else {
      arr2.push(element);
    }
  }
  return [...arr1, ...arr2];
}

console.log(reOrderArray([1, 2, 3, 4, 5, 6, 7, 9, 8]));
```

## 5、数组中的某一个数字超过了数组长度的一半

数组中有一个数字出现的次数超过数组长度的一半，

请找出这个数字。例如输入一个长度为 9 的数组[1,2,3,2,2,2,5,4,2]。

由于数字 2 在数组中出现了 5 次，超过数组长度的一半，因此输出 2。如果不存在则输出 0。

```js
function MoreThanHalfNum_Solution(numbers) {
  // write code here
  let res = 0;
  for (let index = 0; index < numbers.length; index++) {
    const element = numbers[index];
    const arr = numbers.filter(el => el == element);
    if (arr.length > numbers.length / 2) {
      res = arr[0];
    } else {
      continue;
    }
  }
  return res;
}

// 真尼玛牛逼
function MoreThanHalfNum_Solution1(arr) {
  let sortArr = arr.sort();
  let count = 0;
  let midNum = sortArr[Math.floor(sortArr.length / 2)];
  console.log(midNum);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === midNum) {
      count++;
    }
  }
  return count > Math.floor(sortArr.length / 2) ? midNum : 0;
}

console.log(MoreThanHalfNum_Solution([2, 2, 2, 2, 2, 1, 3, 4, 5])); //2
console.log(
  MoreThanHalfNum_Solution1([2, 2, 2, 2, 2, 1, 3, 4, 5]),
  'MoreThanHalfNum_Solution1',
); //2
```

## 6、数组中未出现的最小正整数

给定一个无序数组 arr，找到数组中未出现的最小正整数

例如 arr = [-1, 2, 3, 4]。返回 1
arr = [1, 2, 3, 4]。返回 5

```js
// 废柴 错误
function minNumberdisappered(arr) {
  arr.sort((a, b) => a - b);
  let i = 0;
  while (i < arr.length) {
    if (arr[i] >= 0) {
      // 从大于0的时候开始计算
      if (arr[i] + 1 != arr[i + 1]) {
        return arr[i] + 1;
      }
    } else {
      if (arr[i + 1] > 0) {
        return arr[i + 1] - 1;
      }
    }
    i++;
  }
}

// 经典35 正确
function minNumberdisappered1(arr) {
  // write code here
  const len = arr.length;
  for (let i = 1; i <= len; i++) {
    if (arr.indexOf(i) === -1) {
      return i;
    }
  }
  return len + 1;
}

console.log(minNumberdisappered([-1, 2, 3, 4])); //1
console.log(minNumberdisappered([1, 2, 3, 4])); //5

console.log(minNumberdisappered([-1, 200, 300, 450]), 'minNumberdisappered');
console.log(minNumberdisappered1([-1, 200, 300, 450]), 'minNumberdisappered1');
```

## 7、数组中只出现一次的数字

```js
function FindNumsAppearOnce(array) {
  // write code here
  let res = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const arr = array.filter(el => el == element);
    if (arr.length == 1) {
      res.push(arr[0]);
    } else {
      continue;
    }
  }
  return res;
}

function FindNumsAppearOnce1(array) {
  // write code here
  // return list, 比如[a,b]，其中ab是出现一次的两个数字
  let arrObj = {};
  for (let i = 0; i < array.length; i++) {
    let stringItem = array[i].toString();
    let temp = arrObj[stringItem];
    if (temp) {
      delete arrObj[stringItem];
    } else {
      arrObj[stringItem] = 1;
    }
  }
  return Object.keys(arrObj);
}

console.log(FindNumsAppearOnce([2, 4, 3, 6, 3, 2, 5, 5]));
console.log(
  FindNumsAppearOnce1([2, 4, 3, 6, 3, 2, 5, 5]),
  'FindNumsAppearOnce1',
);
```

## 8、加起来的值为目标值的组合

```js
function combinationSum2(num, target) {
  num.sort((a, b) => a - b);
  let res = []; //最终结果
  let temp = [];
  find(num, 0, target, temp, res);
  return res;
}
function find(num, start, target, temp, res) {
  // 当目标值减到0了就终止整个递归
  if (target == 0) {
    res.push([...temp]);
    return;
  }
  // target >= num[i] 如果目标值不如当前值大了就没有意思了
  for (let i = start; i < num.length && target >= num[i]; i++) {
    // 当下标大于0的时候且上一项与当前项相等的时候直接跳过
    console.log(i, start, 'i, start');
    if (i > start && num[i] == num[i - 1]) {
      continue;
    }
    temp.push(num[i]);
    //依次push 10-10-20-50  不合适-50 （10-10-20）
    //再进去此时start保留在了3 不合适-20 再往后 加60合适
    console.log(temp, 'temp-start');
    find(num, i + 1, target - num[i], temp, res);
    console.log(temp, 'temp');
    temp.pop();
    console.log(temp, 'pop');
  }
}

// [100,10,20,70,60,10,50],80
console.log(combinationSum2([100, 10, 20, 70, 60, 10, 50], 80));
// 返回 [[10,10,60],[10,20,50],[10,70],[20,60]]
```

## 9、转换数组 key

```js
const oldList = [
  { createTime: '2019-12-32', url: 'fjkakakk' },
  { createTime: '2019-12-32', url: 'fjkaffkakk' },
  { createTime: '2019-12-42', url: 'fjkakakk' },
  { createTime: '2019-12-42', url: 'fjkakakk' },
];

//test1

function getList(oldList) {
  const arr = [];
  oldList.forEach(item => {
    const obj = {};
    if (!arr.some(el => el.createTime == item.createTime)) {
      obj.createTime = item.createTime;
      obj.list = oldList.filter(el => el.createTime == obj.createTime);
      arr.push(obj);
    }
  });
  return arr;
}

//test2
function getList(oldList) {
  return oldList.reduce((pre, cur) => {
    const index = pre.findIndex(el => el.createTime == cur.createTime);
    if (index != -1) {
      pre[index].list.push({
        createTime: cur.createTime,
        url: cur.url,
      });
    } else {
      pre.push({
        createTime: cur.createTime,
        list: [
          {
            createTime: cur.createTime,
            url: cur.url,
          },
        ],
      });
    }
    return pre;
  }, []);
}
```

## 算法复杂度

### O(1)

- 的常数阶的复杂度，这种复杂度⽆论数据规模 n 如何增⻓，计算时间是不变的。

```js
const increment = n => n++;
```

### O(n)

- 线性复杂度，随着数据规模 n 的增⻓，计算时间也会随着 n 线性增⻓。

典型的 O(n)的例⼦就是线性查找。

```js
const linearSearch = (arr, target) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
};
```

### O(logn)

- 对数复杂度，随着问题规模 n 的增⻓，计算时间也会随着 n 对数级增⻓。

典型的例⼦是⼆分查找法。

在⼆分查找法的代码中，通过 while 循环，成 2 倍数的缩减搜索范围，也就是说需要经过 log2^n 次即可跳出循环。
事实上在实际项⽬中， O(logn) 是⼀个⾮常好的时间复杂度，⽐如当 n=100 的数据规模时，⼆分查找只需要 7 次，线性查找需要 100 次，这对于计算机⽽⾔差距不⼤，但是当有 10 亿的数据规模的时候，⼆分查找依然只需要 30 次，⽽线性查找需要惊⼈的 10 亿次， O(logn) 时间复杂度的算法随着数据规模的增⼤，它的优势就越明显。

```js
function binarySearch(arr, target) {
  let max = target.length - 1;
  let min = 0;
  while (min <= max) {
    let mid = Math.floor((max + min) / 2);
    if (target > arr[mid]) {
      min = mid + 1;
    } else if (target < arr[mid]) {
      max = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}
```

### O(nlogn)

- 线性对数复杂度，随着数据规模 n 的增⻓，计算时间也会随着 n 呈线性对数级增⻓。

这其中典型代表就是归并排序

```js
// 融合两个有序数组，这里实际上是将数组 arr 分为两个数组
function mergeArray(arr, first, mid, last, temp) {
  let i = first;
  let m = mid;
  let j = mid + 1;
  let n = last;
  let k = 0;
  while (i <= m && j <= n) {
    if (arr[i] < arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
    }
  }
  while (i <= m) {
    temp[k++] = arr[i++];
  }
  while (j <= n) {
    temp[k++] = arr[j++];
  }
  for (let l = 0; l < k; l++) {
    arr[first + l] = temp[l];
  }
  return arr;
}

// 递归实现归并排序
function mergeSort(arr, first, last, temp) {
  // first arr的下标0
  // last arr的最后一位下标

  if (first < last) {
    let mid = Math.floor((first + last) / 2); //取中间下标
    mergeSort(arr, first, mid, temp); // 左子数组有序
    mergeSort(arr, mid + 1, last, temp); // 右子数组有序
    arr = mergeArray(arr, first, mid, last, temp);
  }
  return arr;
}

let arr = [10, 3, 1, 5, 11, 2, 0, 6, 3, -2];
let SortedArr = mergeSort(arr, 0, arr.length - 1, []);
console.log(SortedArr);
```

### O(n²)

- 平⽅级复杂度，典型情况是当存在双重循环的时候，即把 O(n) 的代码再嵌套循环⼀遍，它的时间复杂度就是 O(n²)了，代表应⽤是冒泡排序算法。

```js
function bubleSort(arra) {
  let temp;
  for (let i = 0; i < arra.length; i++) {
    for (let j = 0; j < arra.length - i - 1; j++) {
      if (arra[j] > arra[j + 1]) {
        temp = arra[j];
        arra[j] = arra[j + 1];
        arra[j + 1] = temp;
      }
    }
  }
  return arra;
}
```

### 希尔排序

```js
function shellSort(arr) {
  var len = arr.length,
    temp,
    gap = 1;
  console.time('希尔排序耗时:');
  while (gap < len / 5) {
    //动态定义间隔序列
    gap = gap * 5 + 1;
  }
  for (gap; gap > 0; gap = Math.floor(gap / 5)) {
    for (var i = gap; i < len; i++) {
      temp = arr[i];
      for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j];
      }
      arr[j + gap] = temp;
    }
  }
  console.timeEnd('希尔排序耗时:');
  return arr;
}

console.log(shellSort([10, 3, 1, 5, 11, 2, 0, 6, 3, -2]));
```

### 快速排序

- 从数组中选择中间⼀项作为主元；
- 创建两个指针，左边⼀个指向数组的第⼀项，右边指向数组最后⼀项。移动左指针直到我们找到⼀个⽐主元⼤的元素，接着，移动右指针直到找到⼀个⽐主元⼩的元素。然后交换它们，重复这个过程，直到左指针超过了右指针。这个过程是的⽐主元⼩的值都排在了主元之前，⽽⽐主元⼤的值都排在了主元之后，这⼀步叫划分操作。
- 接着，算法对划分的⼩数组（较主元⼩的值组成的⼦数组，以及较主元⼤的值组成的⼦数组）重复之前的两个步骤，直⾄数组以完全排序。

```js
// 默认状态下的⽐较函数
function compare(a, b) {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}
function swap(array, a, b) {
  [array[a], array[b]] = [array[b], array[a]];
}
// 分治函数
function partition(array, left, right) {
  // ⽤index取中间值⽽⾮splice
  const pivot = array[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;
  while (i <= j) {
    while (compare(array[i], pivot) === -1) {
      i++;
    }
    while (compare(array[j], pivot) === 1) {
      j--;
    }
    if (i <= j) {
      swap(array, i, j);
      i++;
      j--;
    }
  }
  return i;
}
// 快排函数
function quick(array, left, right) {
  let index;
  if (array.length > 1) {
    index = partition(array, left, right);
    if (left < index - 1) {
      quick(array, left, index - 1);
    }
    if (index < right) {
      quick(array, index, right);
    }
  }
  return array;
}
function quickSort(array) {
  return quick(array, 0, array.length - 1);
}

console.log(quickSort([10, 3, 1, 5, 11, 2, 0, 6, 3, -2]));
```
