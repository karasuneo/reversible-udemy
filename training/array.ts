const numbers = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
console.log(numbers);

numbers.forEach((num, i) => {
  const doubled = num * 2;
  console.log(`${i}: ${doubled}`);
});

const names = [
  "Alice",
  "Bob",
  "Carol",
  "Dave",
  "Ellen",
  "Frank",
  "Grace",
  "Heidi",
];

const users = names.map((name, i) => {
  return {
    id: i,
    name: name,
  };
});
console.log(users);

const eventIdUsers = users.filter((user) => {
  return user.id % 2 === 0;
});
console.log(eventIdUsers);

const oddIdUsers = users.filter((user) => user.id % 2 === 1);
console.log(oddIdUsers);

const sum = numbers.reduce((previous, current) => previous + current, 0);
console.log(sum);
