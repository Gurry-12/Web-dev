document.addEventListener('DOMContentLoaded', function() {
    const currentOperandEl = document.querySelector('.current-operand');
    const previousOperandEl = document.querySelector('.previous-operand');
    const buttonsGrid = document.querySelector('.buttons-grid');
    
    // Sidenav History Elements
    const historyToggle = document.getElementById('history-toggle');
    const historyPanel = document.getElementById('history-panel');
    const closeHistoryBtn = document.querySelector('.sidenav .closebtn');
    const historyContent = document.getElementById('history-content');
    const clearHistoryBtn = document.getElementById('clear-history');

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');

    let currentExpression = '';
    let displayExpression = '';
    let history = [];

    // --- Core Calculator Logic ---
    
    const updateDisplay = () => {
        currentOperandEl.textContent = displayExpression || '0';
        previousOperandEl.textContent = ''; // Can be used for more complex logic later
    };

    const clear = () => {
        currentExpression = '';
        displayExpression = '';
        updateDisplay();
    };

    const deleteLast = () => {
        displayExpression = displayExpression.slice(0, -1);
        
        // Handle backend expression carefully
        const lastChar = currentExpression.slice(-1);
        if (lastChar === ' ') {
            currentExpression = currentExpression.slice(0, -3); // " * "
        } else {
            currentExpression = currentExpression.slice(0, -1);
        }
        updateDisplay();
    };

    const appendNumber = (number) => {
        if (number === '.' && displayExpression.split(/[\+\-\×\÷\(\)]/).pop().includes('.')) return;
        displayExpression += number;
        currentExpression += number;
        updateDisplay();
    };
    
    const chooseOperator = (op) => {
        // Prevent adding operator if expression is empty or ends with an operator
        if (currentExpression === '' || /[\+\-\*\/\s]$/.test(currentExpression)) return;
        
        displayExpression += op;
        currentExpression += ` ${op.replace('×', '*').replace('÷', '/')} `;
        updateDisplay();
    };

    const handleParenthesis = (p) => {
        displayExpression += p;
        currentExpression += p;
        updateDisplay();
    };

    const calculate = () => {
        if (!currentExpression) return;
        try {
            // A safer alternative to eval()
            const result = new Function('return ' + currentExpression.replace(/--/g, '+'))();
            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Invalid calculation");
            }
            
            const calculationRecord = `${displayExpression} = ${result}`;
            history.unshift(calculationRecord); // Add to beginning of array
            updateHistory();
            
            displayExpression = result.toString();
            currentExpression = result.toString();
            updateDisplay();

        } catch (error) {
            currentOperandEl.textContent = 'Error';
            previousOperandEl.textContent = '';
            currentExpression = '';
            displayExpression = '';
            console.error("Calculation Error:", error);
        }
    };

    // --- Event Handling ---

    buttonsGrid.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const value = target.textContent;
        
        if (target.classList.contains('btn-num')) {
            appendNumber(value);
        } else if (action === 'operator') {
            chooseOperator(value);
        } else if (action === 'parenthesis') {
            handleParenthesis(value);
        } else if (action === 'clear') {
            clear();
        } else if (action === 'delete') {
            deleteLast();
        } else if (action === 'equals') {
            calculate();
        }
    });

    // --- History Panel Logic ---

    const updateHistory = () => {
        if (history.length === 0) {
            historyContent.innerHTML = '<p>No calculations yet.</p>';
        } else {
            historyContent.innerHTML = history.map(item => `<p>${item}</p>`).join('');
        }
    };

    historyToggle.addEventListener('click', () => {
        historyPanel.style.width = '280px';
    });

    closeHistoryBtn.addEventListener('click', () => {
        historyPanel.style.width = '0';
    });

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        updateHistory();
    });

    // --- Theme Toggler ---

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    });
    
    // --- Keyboard Support ---
    
    document.addEventListener('keydown', (e) => {
        if (e.key >= 0 && e.key <= 9 || e.key === '.') appendNumber(e.key);
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault(); // Prevent form submission behavior
            calculate();
        }
        if (e.key === 'Backspace') deleteLast();
        if (e.key === 'Escape') clear();
        if (e.key === '+') chooseOperator('+');
        if (e.key === '-') chooseOperator('-');
        if (e.key === '*') chooseOperator('×');
        if (e.key === '/') chooseOperator('÷');
        if (e.key === '(' || e.key === ')') handleParenthesis(e.key);
    });

    // Initialize
    updateDisplay();
    updateHistory();
});