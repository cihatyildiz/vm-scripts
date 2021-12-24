import { decorate, observable } from "mobx";

class formsStore {
  constructor() {
    let formFields = null;
  }

  getSsdForm() {
    const form={
      name: 'SSD Engagement Form',
      questions: [
        {
          id: "q1001",
          name: "Does ur project deal with sensitive data?",
          type: "BOOLEAN"
        },
        {
          id: "q1002",
          name: "Does your project serve external/internal consumer",
          type: "SELECT",
          data: ["external", "internal"],
          helpText: "Select one value"
        },
        {
          id: "q1003",
          name: "q3",
          type: "BOOLEAN"
        }
      ]
    }
  }

  setFormFields(formFields) {
    console.log(formFields);
    this.formFields = formFields;
    return this.formFields;
  }

  getFormFields() {
    return this.formFields;
  }
}

decorate(formsStore, {
  formFields: observable
});

export default new formsStore();
