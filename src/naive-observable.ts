
const observer = {
  next: (v: any) => console.log(v)
}

const observable = {
  subscribe: (observer: any) => {
    const notification = {
      v: 0
    }
    const interval = setInterval(()=> {
      observer.next(notification.v++)
    }, 500)
    const subscription = {
      unsubscribe: () => {
        // stop the execution and release resources
        clearInterval(interval);
      }
    }
    return subscription;
  }
}

const subscriptionX = observable.subscribe(observer)
setTimeout(() => {
  subscriptionX.unsubscribe()
}, 5000)
