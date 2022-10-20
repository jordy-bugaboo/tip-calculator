const BILL = "#bill";
const PERSONS = "#persons";
const TIPCTA = ".btn-tip";
const RESET = ".btn-reset";
const PERSONS_CONTAINER = ".c-person";
const CUSTOM_TIP = ".tip-custom";
const RESULT_LINE1 = ".result-line-1";
const RESULT_LINE2 = ".result-line-2";
const ERROR_MESSAGE = ".error-message";
const ERROR_MESSAGE2 = ".error-message2";

let totalBill = 0;
let customPercentage = 0;
let totalTip = 0;
let tipPerPerson = 0;
let persons = 0;

class bill {
  constructor() {
    this.bill = document.querySelector(BILL);
    this.tips = [...document.querySelectorAll(TIPCTA)];
    this.persons = document.querySelector(PERSONS);
    this.personsContainer = document.querySelector(PERSONS_CONTAINER);
    this.customTip = document.querySelector(CUSTOM_TIP);
    this.resultLine1 = document.querySelector(RESULT_LINE1);
    this.resultLine2 = document.querySelector(RESULT_LINE2);
    this.reset = document.querySelector(RESET);
    this.errorMessage = document.querySelector(ERROR_MESSAGE);
    this.errorMessage2 = document.querySelector(ERROR_MESSAGE2);
    this.init();
  }

  init() {
    this.getBill();
    this.getCustomTipTotal();
    this.getTipTotal();
    this.getPersons();
    this.resetInterface();
  }

  getBill() {
    this.bill.addEventListener("input", () => {
      totalBill = this.bill.value.replace(",", ".");

      this.tips.forEach((tip) => {
        if (tip.classList.contains("active")) {
          totalTip = this.calculateTip(tip.textContent);
        }

        if (this.customTip.value > 0) {
          totalTip = this.customTip.value;
        }
      });

      if (totalTip === 0 || persons === 0) return;

      this.calcTipPerPerson(totalTip, persons);
      this.getTotalBillPerPerson(totalBill, tipPerPerson, persons);
      return totalBill;
    });
  }

  getPersons() {
    this.persons.addEventListener("input", (event) => {
      persons = Number(this.persons.value);

      if (persons === 0) {
        this.personsContainer.classList.add("error-container");
        this.errorMessage.classList.remove("u-hidden");
        this.errorMessage2.classList.add("u-hidden");
      } else if (isNaN(persons)) {
        this.personsContainer.classList.add("error-container");
        this.errorMessage.classList.add("u-hidden");
        this.errorMessage2.classList.remove("u-hidden");
      } else {
        this.personsContainer.classList.remove("error-container");
        this.errorMessage.classList.add("u-hidden");
        this.errorMessage2.classList.add("u-hidden");
      }
      if (persons === 0 || totalTip === 0 || persons === undefined) return;
      this.calcTipPerPerson(totalTip, persons);
      this.getTotalBillPerPerson(totalBill, tipPerPerson, persons);
      return persons;
    });
  }

  getCustomTipTotal() {
    this.customTip.addEventListener("click", () => {
      this.tips.forEach((tip) => {
        tip.classList.remove("active");
      });
    });

    this.customTip.addEventListener("input", (event) => {
      this.tips.forEach((tip) => {
        tip.classList.remove("active");
      });

      this.customTip.classList.add("active");

      totalTip = this.calculateTip(this.customTip.value);

      if (persons === 0) return;
      this.calcTipPerPerson(totalTip, persons);
      this.getTotalBillPerPerson(totalBill, tipPerPerson, persons);
      return totalTip;
    });
  }

  getTotalBillPerPerson(bill, tip, persons) {
    if (bill === undefined || tip === undefined || persons === undefined)
      return;

    const billPerPerson =
      Math.round((tip + bill / persons + Number.EPSILON) * 100) / 100;
    return this.updateInterfaceTotalBillPerPerson(billPerPerson);
  }

  getTipTotal() {
    this.tips.forEach((tip, index) => {
      tip.addEventListener("click", () => {
        this.tips.forEach((tip) => {
          tip.classList.remove("active");
          this.customTip.classList.remove("active");
          this.customTip.value = 0;
          this.tips[index].classList.add("active");
        });
        totalTip = this.calculateTip(tip.textContent);

        if (totalBill === 0 || totalTip === 0 || persons === 0) return;
        this.calcTipPerPerson(totalTip, persons);
        this.getTotalBillPerPerson(totalBill, tipPerPerson, persons);
        return totalTip;
      });
    });
  }

  calcTipPerPerson(value, people) {
    if (value === undefined || people === undefined) return;
    tipPerPerson = Math.round((value / people + Number.EPSILON) * 100) / 100;
    this.updateInterfaceTipAmountPerson(tipPerPerson);
    return tipPerPerson;
  }

  calculateTip(input) {
    const tipPercentage = this.sanitizeData(input);
    const tip = (totalBill / 100) * tipPercentage;
    return tip;
  }

  sanitizeData(input) {
    const str = input;
    const subst = ``;
    const regex = /%/gm;
    const result = str.replace(regex, subst);
    return result;
  }

  updateInterfaceTipAmountPerson(input) {
    this.resultLine1.innerHTML = `$${input}`;
  }

  updateInterfaceTotalBillPerPerson(input) {
    this.resultLine2.innerHTML = `$${input}`;
  }

  resetInterface() {
    this.reset.addEventListener("click", () => {
      this.bill.value = "";
      this.persons.value = "";
      this.resultLine1.innerHTML = `$0`;
      this.resultLine2.innerHTML = `$0`;

      totalBill = 0;
      customPercentage = 0;
      totalTip = 0;
      tipPerPerson = 0;
      persons = 0;

      this.customTip.classList.remove("active");
      this.tips.forEach((tip) => {
        tip.classList.remove("active");
      });
    });
  }
}
const myBill = new bill();
myBill;
