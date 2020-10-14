class Stack {
  constructor(){
    this.items = [];
  }

  push(element){
    this.items.push(element);
  }

  pop(){
    if (this.items.length == 0){
      throw "Stack is Empty!"
    }else{
      return this.items.pop();
    }
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty(){
    return this.items.length == 0;
  }

  clearStack(){
    this.items = [];
  }

  printStack(){
    var str = "";
    for (var i = 0; i < this.items.length; i++)
        str += `[${this.items[i]}] -> `;
    console.log(str);
  }
}