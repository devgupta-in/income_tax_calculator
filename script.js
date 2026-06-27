const form = document.querySelector("#tax-form");
const incomeInput = document.querySelector("#income");
const errorMessage = document.querySelector("#income-error");
const result = document.querySelector("#result");
const taxAmount = document.querySelector("#tax-amount");
const postTaxIncome = document.querySelector("#post-tax");
const effectiveRate = document.querySelector("#effective-rate");
const recalculateButton = document.querySelector("#recalculate");

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

function calculateTax(income) {
    let taxableIncome = income;
    let tax = 0;

    // Tax slabs (FY 2026-27 New Regime)
    if (taxableIncome > 2400000) {
        tax += (taxableIncome - 2400000) * 0.30;
        taxableIncome = 2400000;
    }

    if (taxableIncome > 2000000) {
        tax += (taxableIncome - 2000000) * 0.25;
        taxableIncome = 2000000;
    }

    if (taxableIncome > 1600000) {
        tax += (taxableIncome - 1600000) * 0.20;
        taxableIncome = 1600000;
    }

    if (taxableIncome > 1200000) {
        tax += (taxableIncome - 1200000) * 0.15;
        taxableIncome = 1200000;
    }

    if (taxableIncome > 800000) {
        tax += (taxableIncome - 800000) * 0.10;
        taxableIncome = 800000;
    }

    if (taxableIncome > 400000) {
        tax += (taxableIncome - 400000) * 0.05;
    }

    // Section 87A Rebate
    if (income <= 1200000) {
        tax = 0;
    }

    // Surcharge
    let surchargeRate = 0;

    if (income > 50000000) {
        surchargeRate = 0.25;
    } else if (income > 20000000) {
        surchargeRate = 0.25;
    } else if (income > 10000000) {
        surchargeRate = 0.15;
    } else if (income > 5000000) {
        surchargeRate = 0.10;
    }

    tax += tax * surchargeRate;

    // Health & Education Cess (4%)
    tax += tax * 0.04;

    return Math.round(tax);
}

function showError(message) {
    incomeInput.setAttribute("aria-invalid", "true");
    errorMessage.textContent = message;
    result.classList.remove("is-visible");
    result.setAttribute("aria-hidden", "true");
}

function clearError() {
    incomeInput.removeAttribute("aria-invalid");
    errorMessage.textContent = "";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const income = Number(incomeInput.value);

    if (incomeInput.value.trim() === "" || !Number.isFinite(income)) {
        showError("Please enter your annual income.");
        incomeInput.focus();
        return;
    }

    if (income < 0) {
        showError("Income cannot be negative.");
        incomeInput.focus();
        return;
    }

    clearError();

    const tax = calculateTax(income);
    const rate = income === 0 ? 0 : (tax / income) * 100;

    taxAmount.textContent = currencyFormatter.format(tax);
    postTaxIncome.textContent = currencyFormatter.format(income - tax);
    effectiveRate.textContent = `${rate.toFixed(2)}%`;

    result.classList.add("is-visible");
    result.setAttribute("aria-hidden", "false");
    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

    form.reset();
});

incomeInput.addEventListener("input", clearError);

recalculateButton.addEventListener("click", () => {
    result.classList.remove("is-visible");
    result.setAttribute("aria-hidden", "true");
    incomeInput.value = "";
    incomeInput.focus();
});