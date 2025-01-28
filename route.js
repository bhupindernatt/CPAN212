import express from "express";
const router = express.Router();

router.get("/name", (req, res) => {
  res.send("Bhupinder Natt");
});

router.get("/greeting", (req, res) => {
  res.send("Bhupinder Natt - N01640283");
});

// Add route
router.get("/add", (req, res) => {
  const { x, y } = req.query;

  if (!x || !y) {
    return res.send("Missing required parameters!");
  }

  const sum = parseFloat(x) + parseFloat(y);

  res.send(`The result is ${sum}`);
});

// Calculate route
router.get("/calculate", (req, res) => {
  const { a, b, operator } = req.query;

  let decodedOperator = operator;

  if (operator === " ") {
    decodedOperator = "+";
  } else {
    decodedOperator = operator;
  }

  if (!a || !b || !decodedOperator) {
    return res.send("Missing required parameters: a, b and operator!");
  }

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (isNaN(numA) || isNaN(numB)) {
    return res.send("Query parameters a and b must be a valid number!");
  }

  let result;

  switch (decodedOperator) {
    case "+":
      result = numA + numB;
      break;
    case "-":
      result = numA - numB;
      break;
    case "*":
      result = numA * numB;
      break;
    case "/":
      if (numB === 0) {
        return res.send("Division by zero is not allowed.");
      }
      result = numA / numB;
      break;
    case "**":
      result = numA ** numB;
      break;
    default:
      return res.send("Invalid operator");
  }

  res.send(`The result of ${a} ${decodedOperator} ${b} is : ${result}`);
});

export default router;
