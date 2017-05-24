let test1 = "6-3"
let test2 = "4-3,5-1,2-2,1-3,4-4"
let test3 = "1-1,3-5,5-2,2-3,2-4"
let test4 = "1-1,1-2"
let test5 = "1-1,2-2,2-1"
let test6 = "1-1,1-2,3-3,4-4,4-1,1-2"

function domino(inStr) {
  let outNum = 1

  let arr = inStr.split(',')
  for (let i in arr) {
    arr[i] = arr[i].split('-')   
  }
  //console.log('inArr', arr)

  let lastTile = []
  let count = 1
  for (let i in arr) {
    if (i > 0) {
      if (arr[i][0] == lastTile[1]) {
        count++
        if (count > outNum) {
          outNum = count
        }
      } else {
        count = 1
      }
    }
    lastTile = arr[i]
  }

  return outNum
}

//console.log('test1', test1, domino(test1))
//console.log('test2', test2, domino(test2))
console.log('test3', test3, domino(test3))
//console.log('test4', test4, domino(test4))
//console.log('test5', test5, domino(test5))
//console.log('test6', test6, domino(test6))

console.log(domino("1-1")) //=> 1
console.log(domino("1-2,1-2")) //=> 1
console.log(domino("3-2,2-1,1-4,4-4,5-4,4-2,2-1")) //=> 4
console.log(domino("5-5,5-5,4-4,5-5,5-5,5-5,5-5,5-5,5-5,5-5")) //=> 7
