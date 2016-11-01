let observerA = {
  next: (value) => console.log(value)
}

let FakeObservable = function() {
  this.isStopped = false;
  // this.scheduler = {
  //   schedule: (timePoint, operation, state) => {
  //     // at timePoint
  //     operation(state);
  //   }
  // }
  this.execution = (observer) => {
    let _this = this;
    let execute = (state) => {
      if('mouse clicked' && !_this.isStopped) {
        observer.next(++state);
        execute(timePoint, state)
      }
    }
  
    execute(0);
    
  }
}


FakeObservable.prototype.subscribe = function (observer) {
  let _this = this;
  _this.execution(observer);
}

let x$ = new FakeObservable();
x$.subscribe(observerA);

// let Person = function() {
//   this.canTalk = true;
// };

// Person.prototype.greet = function() {
//   if (this.canTalk) {
//     console.log('Hi, I am ' + this.name);
//   }
// };