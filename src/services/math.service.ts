export async function calculateExpressions(req, res, next) {
    try {
    const expArr = req.body.expressions
    const results: string[] = []

    // we need to check if every expression is valid
    for await (const exp of expArr) {
// first we check if expression contains only specified characters: +,-,(,),.,*,/,digits
      if (!exp.match(/^[+\-().*/ 0-9]+$/g)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Data is invalid!'
            })
        }     
// then we check if expression contains numbers only between 0 and 1000
        const numbersOfString = exp.match(/\d+/g).map(Number);
    if (!(() =>  {
        for (const num of numbersOfString) {
        if (num >=0 && num <= 1000) {
            return true
        } else {
            return false
        }
    }
})()) {
        return res.status(400).json({
            status: 'fail',
            message: 'Numbers should be >0 and <1000!'
        })
    }
// then we can parse our expression by passing it to parse function 
         const parsed = await parseExpression(exp)
// then we push each parsed expression to results array 
         results.push(parsed)
    }
// sending successful response
    return res.status(200).json({
        status: 'success',
        message: 'Results saved!'
    })
} catch (err) {
    next(err)
} 
}


// we need to read expression chunk by chunk and return expression in brackets 
const split = (exp, operator) => {
    const calcResult = [];
    let brackets = 0;
    let currentCharacter = "";
    for (let i = 0; i < exp.length; ++i) {
        const chunk = exp[i];
        if (chunk == '(') {
            brackets++;
        } else if (chunk == ')') {
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




