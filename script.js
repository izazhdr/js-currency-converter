import {countryList} from './code.js';

async function fetchExchangeRates(baseCurrency, value, targetCurrency) {
  const apiKey = 'cur_live_CifPKhobAlIW7Y5m0kWLOU78cMsu6JwzzOcZRKrD';
  const currencyURL = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${baseCurrency}&value=${value}&currencies=${targetCurrency}`;
  // Example URL: v3/latest?apikey=cur_live_CifPKhobAlIW7Y5m0kWLOU78cMsu6JwzzOcZRKrD&base_currency=USD&value=1&currencies=PKR

  try {
    let response = await fetch(currencyURL);
    let dataobj = await response.json();

    const targetCurrencyCode = dataobj.data[targetCurrency].code;
    const targetCurrencyValue = (dataobj.data[targetCurrency].value).toFixed(2);

    // DISPLAY SECTION - FOR TARGET CURRENCY
    document.querySelector('.currency-code-secondary')
      .innerHTML = `${targetCurrencyCode}`;
    document.querySelector('.currency-rate-secondary')
      .innerHTML = `${targetCurrencyValue * value}`;

  } catch(error) {
    console.warn('Error accessing the exchange rate:', error);
    alert('Error accessing the exchange rate. Please try again.');
  }
}

const convertButton = document.getElementById('get-rates-btn');
convertButton.addEventListener('click', () => {
  fetchValues();
})

function fetchValues() {
  const baseCurrencyAbbr = document.getElementById('baseCurrency').value;
  const targetCurrencyAbbr = document.getElementById('targetCurrency').value;
  const currencyValue = document.getElementById('currency-value').value;
  
  // COMPARISON CODE TO ENSURE THAT WE GET CURRENCY CODES, NOT COUNTRY CODES
  let baseCurrency = null;
  let targetCurrency = null;

  for(const code in countryList) {
    if (baseCurrencyAbbr.toUpperCase() === countryList[code]) {
      baseCurrency = code;
    }

    if (targetCurrencyAbbr.toUpperCase() === countryList[code]) {
      targetCurrency = code;
    }
  }

  // DISPLAY SECTION - FOR BASE CURRENCY
  document.querySelector('.currency-code-primary')
    .innerHTML = `${baseCurrency.toUpperCase()}`;
  document.querySelector('.currency-rate-primary')
    .innerHTML = `${currencyValue}`;

  if (baseCurrency && targetCurrency) {
    fetchExchangeRates(baseCurrency, currencyValue, targetCurrency);
  } else {
    console.error("Base or target currency not found in the country list.");
  }
}

// Fetch the JSON data from the API
const apiUrl = "https://flagcdn.com/en/codes.json";

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Process the data and populate the dropdowns
    populateDropdown("baseCurrency", data);
    populateDropdown("targetCurrency", data);
  })
  .catch(error => console.error("Error fetching currency data:", error));

// Function to populate a dropdown with currency options and flags
function populateDropdown(dropdownId, data) {
  const dropdown = document.getElementById(dropdownId);
  const dropdownValue = dropdownId;

  // Clear existing options
  dropdown.innerHTML = '<option value="">Select Currency</option>';

  // Iterate through the JSON data and create options
  for (const code in data) {
    const option = document.createElement("option");
    option.value = code;

    // Combine the flag image and text into the option label
    option.innerHTML = `${code.toUpperCase()}`;

    // Append the option to the dropdown
    dropdown.appendChild(option);
  };

  dropdown.addEventListener('change', () => {
    const SelectedValue = dropdown.value;
    addFlag(SelectedValue, dropdownValue);
  });
}

function addFlag(code, dropdownValue) {
  const flagUrl = `https://flagsapi.com/${code.toUpperCase()}/flat/64.png`;

  if (dropdownValue === "baseCurrency") {
    const flagImage = document.getElementById("flagImg");
    flagImage.src = flagUrl;
  }
  
  if (dropdownValue === "targetCurrency") {
    const flagImage2 = document.getElementById("flagImg2");
    flagImage2.src = flagUrl;
  }
}