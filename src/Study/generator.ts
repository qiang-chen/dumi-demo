/**
 * @description
 * @author cq
 * @Date 2021-03-19 17:35:00
 * @LastEditTime 2021-03-22 16:41:45
 * @LastEditors cq
 */

function* read() {
  let a = yield 'hellow';
  console.log(a);
  let b = yield 'word';
  console.log(b);
}

const it = read(); //屁都不会打印  到了yield "hellow"就会停止
// console.log(it.next())
it.next(); // 执行到了yield "word";
it.next(); // 声明a 然后 打印 undefined
it.next(); //声明b 然后打印 undefined

// 加入 第二个it.next(1) 传入值会把这个值传给a
//第三个同理传给b

export default read;
