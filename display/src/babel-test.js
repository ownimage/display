const sayHello = () => {
    const person = { name: "Keith", age: 30 };
    const { name, age } = person;

    const element = document.querySelector('h1');
    element.textContent = `Hello, ${name}!`;
};
sayHello();