const operand = document.querySelectorAll('.operands');
const operator = document.querySelectorAll('.operator');
const display = document.querySelector('.display');
const dot = document.querySelector('.dot');
const clear = document.querySelector('.clear');
const solve = document.querySelector('.solve');

let queue = [];
let stack = [];
let indexStack = [];
let calArray;

operand.forEach(item => {
    item.addEventListener("click", displayValue);
});
operator.forEach(item => {
    item.addEventListener("click", displayValue);
});
dot.addEventListener("click", displayValue);
clear.addEventListener("click", clearDisplay);
solve.addEventListener("click", calculate);

document.addEventListener("keydown", handleKeyboardInput);

function displayValue() {
    let size = queue.length;
    let inputValue = this.value;
    if (size === 0 || checkInput(queue[size - 1], inputValue, size) === 0) {
        display.value += inputValue;
        queue.push(inputValue);
    } else if (checkInput(queue[size - 1], inputValue, size) === 1) {
        display.value += inputValue;
        let temp = queue.pop();
        queue.push(temp + inputValue);
    } else {
        display.value += "";
    }
}

function clearDisplay() {
    display.value = "";
    queue = [];
}

function calculate() {
    calArray = [...queue];
    let result;
    while (calArray.length > 1) {
        let size1 = calArray.length;
        for (let i = 0; i < size1; i++) {
            if (isOperator(calArray[i]) === 1) {
                stack.push(precedence(calArray[i]));
                indexStack.push(i);
            }
        }
        sort(stack, indexStack);
        let index = indexStack.pop();
        result = operation(calArray[index], index);
        calArray.splice(index - 1, 3, result);
        stack = [];
        indexStack = [];
    }
    display.value = isNaN(result) ? "Error" : result;
    queue = [result.toString()];
}

function handleKeyboardInput(event) {
    const key = event.key;
    if (/\d/.test(key)) {
        addToDisplay(key);
    } else if (key === '.') {
        addToDisplay(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        queue.pop();
        display.value = display.value.slice(0, -1);
    } else if (['+', '-', '*', '/'].includes(key)) {
        addToDisplay(key);
    } else if (key === 'Escape') {
        clearDisplay();
    }
}

function addToDisplay(inputValue) {
    let size = queue.length;
    if (size === 0 || checkInput(queue[size - 1], inputValue, size) === 0) {
        display.value += inputValue;
        queue.push(inputValue);
    } else if (checkInput(queue[size - 1], inputValue, size) === 1) {
        display.value += inputValue;
        let temp = queue.pop();
        queue.push(temp + inputValue);
    }
}

function checkInput(value1, value2, size) {
    if ((value1 === "*" && value2 === "/") ||
        (value1 === "/" && value2 === "*") ||
        (value1 === "+" && value2 === "*") ||
        (value1 === "*" && value2 === "+") ||
        (value1 === "-" && value2 === "*") ||
        (value1 === "*" && value2 === "*") ||
        (value1 === "+" && value2 === "+") ||
        (value1 === "/" && value2 === "/") ||
        (value1 === "-" && value2 === "-") ||
        (value1 === "-" && value2 === "+") ||
        (value1 === "-" && value2 === "/") ||
        (value1 === "+" && value2 === "/")) {
        return 2;
    } else if (isOperand(value1, value2) === 1) {
        return 1;
    } else if (value1 === '-') {
        if (isOperator(queue[size - 2]) === 1 && isOperand(value2) === 1) {
            return 1;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

function isOperator(op) {
    return ['+', '-', '*', '/'].includes(op) ? 1 : 0;
}

function isOperand(op1, op2) {
    return isOperator(op1) === 0 && isOperator(op2) === 0 ? 1 : 0;
}

function precedence(op) {
    switch (op) {
        case '+':
            return 2;
        case '-':
            return 1;
        case '/':
            return 4;
        case '*':
            return 3;
        default:
            return 0;
    }
}

function sort(arr1, arr2) {
    let len = arr1.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            if (arr1[j] > arr1[j + 1]) {
                [arr1[j], arr1[j + 1]] = [arr1[j + 1], arr1[j]];
                [arr2[j], arr2[j + 1]] = [arr2[j + 1], arr2[j]];
            }
        }
    }
}

function operation(op, index) {
    switch (op) {
        case '+':
            return add(index);
        case '-':
            return sub(index);
        case '*':
            return mul(index);
        case '/':
            return divide(index);
    }
}

function add(index) {
    let n1 = parseFloat(calArray[index - 1], 10);
    let n2 = parseFloat(calArray[index + 1], 10);
    return n1 + n2;
}

function sub(index) {
    let n1 = parseFloat(calArray[index - 1], 10);
    let n2 = parseFloat(calArray[index + 1], 10);
    return n1 - n2;
}

function mul(index) {
    let n1 = parseFloat(calArray[index - 1], 10);
    let n2 = parseFloat(calArray[index + 1], 10);
    return n1 * n2;
}

function divide(index) {
    let n1 = parseFloat(calArray[index - 1], 10);
    let n2 = parseFloat(calArray[index + 1], 10);
    return n1 / n2;
}
