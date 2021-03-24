import fs from "fs";

export async function calculateExpressions(req, res, next) {
  try {
    const expArr = req.body.expressions;
    const results: string[] = [];

    // we need to check if every expression is valid
    for await (const exp of expArr) {
      // first we check if expression contains only specified characters: +,-,(,),.,*,/,digits
      if (!exp.match(/^[+\-().*/ 0-9]+$/g)) {
        return res.status(400).json({
          status: "fail",
          message: "Data is invalid!",
        });
      }
      // then we check if expression contains numbers only between 0 and 1000
      const numbersOfString = exp.match(/\d+/g).map(Number);
      if (
        !(() => {
          for (const num of numbersOfString) {
            if (num >= 0 && num <= 1000) {
              return true;
            } else {
              return false;
            }
          }
        })()
      ) {
        return res.status(400).json({
          status: "fail",
          message: "Numbers should be >0 and <1000!",
        });
      }
      // then we can parse our expression by passing it to parse function
      const parsed = await parseByPlus(exp);
      // then we push each parsed expression to results array
      results.push(parsed);
    }
    // sending successful response
    fs.writeFile("results.txt", results.join("\n"), (err) => {
      if (err) throw err;
    });
    return res.status(200).json({
      status: "success",
      message: "Results saved!",
    });
  } catch (err) {
    next(err);
  }
}

export async function getResults(req, res, next) {
  try {
    fs.readFile("results.txt", "utf8", function (error, data) {
        let results = [];
      if (error && error.code === 'ENOENT') {
        return res.status(200).json({
            results: results,
          });
        }
      // checking if data if file is not empty
      if (data) {
        // we need to replace whitespace with commas
        // then we need to create array of NUMBERS!!! from our results
        results = data.replace(/\n/g, ",").split(",").map(Number);
      }
      //sending response
      return res.status(200).json({
        results: results,
      });
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error: error,
    });
  }
}

// we need to read expression chunk by chunk and return expression in brackets
const split = (exp, operator) => {
  const calcResult = [];
  let brackets = 0;
  let currentCharacter = "";
  for (let i = 0; i < exp.length; ++i) {
    const chunk = exp[i];
    if (chunk == "(") {
      brackets++;
    } else if (chunk == ")") {
      brackets--;
    }
    if (brackets == 0 && operator == chunk) {
      calcResult.push(currentCharacter);
      currentCharacter = "";
    } else currentCharacter += chunk;
  }
  if (currentCharacter != "") {
    calcResult.push(currentCharacter);
  }
  return calcResult;
};

// multiply function
const parseMultiplicationSeparatedExpression = (exp) => {
  //splitting expression only by '*'
  const numString = split(exp, "*");
  const number = numString.map((toNum) => {
    if (toNum[0] == "(") {
      const expr = toNum.substr(1, toNum.length - 2);
      // call main function for expression in brackets
      return parseByPlus(expr);
    }
    return +toNum;
  });

  // muiltiplying
  const initialValue = 1.0;
  const result = number.reduce((acc, no) => acc * no, initialValue);
  return result;
};

const parseByDivide = (exp: string) => {
  // splitting by '-'
  const numString = split(exp, "/");
  // calling multiply function for next step of calculating
  const number = numString.map((toNum) => {
    return parseMultiplicationSeparatedExpression(toNum);
  });
  // simply dividing numbers
  const result = number.reduce((acc, no) => acc / no);
  return result;
};
// minus function that calls divide function
const parseByMinus = (exp: string) => {
  // splitting by '-'
  const numString = split(exp, "-");
  // calling divide function for next step of calculating
  const number = numString.map((toNum) => parseByDivide(toNum));
  const initialValue = number[0];
  // just calculating difference of numbers
  const result = number.slice(1).reduce((acc, no) => acc - no, initialValue);
  return result;
};
// * - +

const deleteSpaces = (exp: string) => {
  return exp.replace(/ /g, "");
};

// plus (main) function that calls minus function
const parseByPlus = (exp: string) => {
  // deleting white spaces
  const validExp = deleteSpaces(exp);
  // splitting by '+'
  const numString = split(validExp, "+");
  // calling minus function for next step of calculating
  const number = numString.map((toNum) => parseByMinus(toNum));
  // just calculating sum of numbers
  const initialValue = 0.0;
  const result = number.reduce((acc, no) => acc + no, initialValue);
  return result;
};
