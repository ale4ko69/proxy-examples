// Wrapper
const withDefaultValue = (target, defaultValue = 0) => {
  return new Proxy(target, {
    get: (obj, prop) => (prop in obj ? obj[prop] : defaultValue)
  })
}

const position = withDefaultValue(
  {
    x: 24,
    y: 42
  },
  0
)

// Hidden properies
const withHiddenProps = (target, prefix = '_') => {
  return new Proxy(target, {
    has: (obj, prop) => prop in obj && !prop.startsWith(prefix),
    ownKeys: obj => Reflect.ownKeys(obj).filter(p => !p.startsWith(prefix)),
    get: (obj, prop, receiver) => (prop in receiver ? obj[prop] : void 0)
  })
}

const data = withHiddenProps({
  name: 'Vladilen',
  age: 25,
  _uid: '1231231'
})

// Optimization
const IndexedArray = new Proxy(Array, {
  construct(target, [args]) {
    const index = {}
    args.forEach(item => (index[item.id] = item))

    return new Proxy(new target(...args), {
      get(arr, prop) {
        switch (prop) {
          case 'push':
            return item => {
              index[item.id] = item
              arr[prop].call(arr, item)
            }
          case 'findById':
            return id => index[id]
          default:
            return arr[prop]
        }
      }
    })
  }
})

const users = new IndexedArray([
  { id: 11, name: 'Vladilen', job: 'Fullstack', age: 25 },
  { id: 22, name: 'Elena', job: 'Student', age: 22 },
  { id: 33, name: 'Victor', job: 'Backend', age: 23 },
  { id: 44, name: 'Vasilisa', job: 'Teacher', age: 24 }
])

//---- https://gist.github.com/prof3ssorSt3v3/9d8223695082023b54aac70319310320
//Proxies
let objects = [
  { id: 123, name: 'Steve', age: 21 },
  { id: 456, name: 'Riley', age: -34 },
  { id: 789, name: 'Bree', age: 140 },
];
objects = objects.map((person) => {
  return new Proxy(person, {
    get: function (target, prop, receiver) {
      if (prop in target) {
        if (prop === 'age') {
          if (target[prop] >= 0 && target[prop] <= 130) {
            return target[prop];
            return Reflect.get(...arguments);
            return Reflect.get(target, prop, receiver);
          } else {
            throw new RangeError('Age is too high or too low.');
          }
        }
      }
    },
    set: function (target, prop) {
      return true;
    },
  });
});

objects.forEach((person) => {
  try {
    person.age;
  } catch (err) {
    console.log(err.name, err.message);
  }
});

//wrapper IIFE
// let obj = (function(myObj){
//   let handler = {
//     get: function(target, prop){

//     },
//     set: function(target, prop){

//     }
//   }
//   return new Proxy(myObj, handler);
// })({ prop1: 'hello', prop2: 'goodbye' })

// let obj = { prop1: 'hello', prop2: 'goodbye' };

// let handler = {
//   default: 'NO PROP',
//   get: function (target, prop, receiver) {
//     if (prop in target) {
//       return target[prop].toUpperCase();
//     } else {
//       throw new TypeError('No such prop');
//     }
//   },
//   set: function (target, prop, receiver) {
//     if (prop in target) {
//       return true;
//     } else {
//       throw new TypeError('No such property');
//     }
//   },
// };
// let proxy = new Proxy(obj, handler);

// proxy.prop1 = '¡hola!';
// proxy.prop3 = 'blah';
// console.log(proxy.prop1);
// console.log(proxy.prop2);

let f = new Proxy(function () {}, {
  apply: function (target, thisArg, args) {
    //target MUST be a callable function
    //args is the list of values being passed to the function
    //thisArg is the object considered 'this' for this function call
  },
  // has:
  // deleteProperty:
});
