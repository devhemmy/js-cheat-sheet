import { category, topic } from '../../utils/topicHelpers';

export const forms = category('Forms', [
  topic(
    'Reactive Forms',
    `Reactive Forms provide a **model-driven approach** to handling form inputs whose values change over time. Unlike "Template-driven" forms (which are similar to Vue's \`v-model\`), Reactive Forms are explicit: you create the form structure in your TypeScript class and link it to the HTML.

> This approach is preferred for complex forms because it is **predictable**, **synchronous**, and **easier to test**.

---

### 1. The Core Building Blocks

| Class | Description |
|-------|-------------|
| \`FormControl\` | Tracks the value and validation status of an individual input field |
| \`FormGroup\` | A group of FormControls (or other groups) treated as a single unit (e.g., an "Address" group) |
| \`FormArray\` | An array of controls. Use this when you need a dynamic list of inputs (e.g., "Add another phone number") |

---

### 2. Implementation Example

In modern Angular, we use the \`FormBuilder\` service to create forms concisely.

**Component TypeScript:**

\`\`\`typescript
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule], // Must import this!
  templateUrl: './profile-form.component.html'
})
export class ProfileFormComponent {
  private fb = inject(FormBuilder);

  // Define the model
  profileForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: this.fb.group({ // Nested Group
      city: [''],
      zip: ['']
    })
  });

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
    }
  }
}
\`\`\`

**Component HTML:**

\`\`\`html
<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
  <input type="text" formControlName="username" />

  <div formGroupName="address">
    <input type="text" formControlName="city" />
  </div>

  <button type="submit" [disabled]="profileForm.invalid">Submit</button>
</form>
\`\`\`

---

### 3. Observables vs. Signals

In Angular v18/20, Reactive Forms are still heavily RxJS-based. Every control has a \`valueChanges\` property which is an Observable.

\`\`\`typescript
// Reacting to changes in real-time
this.profileForm.get('username')?.valueChanges.subscribe(val => {
  console.log('Username changed to:', val);
});
\`\`\`

> **Note:** While Angular is moving toward Signals, the Forms API hasn't been fully "signal-ified" yet. You will often use \`toSignal(control.valueChanges)\` to bridge the gap.

---

### 4. Validation

Validators are functions that return an error object or \`null\`.

| Type | Examples |
|------|----------|
| **Built-in** | \`Validators.required\`, \`Validators.email\`, \`Validators.pattern()\` |
| **Status** | Controls can be \`VALID\`, \`INVALID\`, \`PENDING\`, or \`DISABLED\` |

**Checking errors in HTML:**

\`\`\`html
@if (profileForm.get('email')?.errors?.['email']) {
  <span>Please enter a valid email.</span>
}
\`\`\`

---

### 5. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React (Standard)** | You usually manage form state via \`useState\`. Every keystroke updates a state variable which re-renders the component |
| **React (React Hook Form)** | Closer to Angular's Reactive Forms, using refs to avoid re-renders, but usually more decentralized |
| **Angular** | The form state lives in a separate object (the Model) in your TS class. The DOM and the Model stay in sync via the \`formControlName\` directive. It is highly structured and handles complex nested objects natively |`,
    ['reactive-forms', 'typed-forms', 'FormGroup'],
    'intermediate'
  ),
  topic(
    'Validation',
    `In Angular, validation is the process of ensuring that form input meets specific criteria before it is processed. While Angular provides built-in validators (\`required\`, \`min\`, \`email\`), the real power of Reactive Forms lies in **Custom Validators** and **Async Validators**.

> In modern Angular, validators are simply functions. They don't require complex class inheritance; they just take a control and return an error object or \`null\`.

---

### 1. Custom Sync Validators

A synchronous validator is a function that checks a value immediately. If the value is invalid, it returns a \`ValidationErrors\` object; if it's valid, it returns \`null\`.

**Example: Forbidden Name Validator**

\`\`\`typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// A factory function to pass arguments to the validator
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    // Returns an error object { forbiddenName: { value: '...' } } or null
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Usage in Component
this.fb.group({
  name: ['', [forbiddenNameValidator(/admin/i)]]
});
\`\`\`

---

### 2. Cross-Field Validation

Sometimes you need to compare two fields (e.g., "Password" and "Confirm Password"). To do this, you attach the validator to the \`FormGroup\` instead of an individual \`FormControl\`.

\`\`\`typescript
const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

// Usage
this.fb.group({
  password: [''],
  confirmPassword: ['']
}, { validators: [passwordMatchValidator] });
\`\`\`

---

### 3. Async Validators

Async validators are used for checks that require a server request, such as "Is this username already taken?".

- They must return an **Observable** or a **Promise**
- Angular waits for the async validator to complete before marking the form as \`VALID\`
- To save performance, Angular only runs async validators **after all sync validators have passed**

\`\`\`typescript
import { inject } from '@angular/core';
import { UserService } from './user.service';

// Inside a component or as a standalone function
usernameAvailableValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return userService.checkUsername(control.value).pipe(
      map(isTaken => (isTaken ? { usernameTaken: true } : null)),
      catchError(() => of(null)) // Handle server errors gracefully
    );
  };
}
\`\`\`

---

### 4. Validation Status

A control or group moves through these statuses:

| Status | Description |
|--------|-------------|
| \`VALID\` | Everything is fine |
| \`INVALID\` | At least one validator failed |
| \`PENDING\` | An async validator is currently running (perfect for showing a loading spinner) |
| \`DISABLED\` | The control is excluded from validation and the form's value |

---

### 5. Displaying Errors in the Template

Using the modern \`@if\` control flow makes displaying errors clean and readable.

\`\`\`html
<input formControlName="username" />

@if (userForm.get('username')?.hasError('forbiddenName')) {
  <p class="error">The name "admin" is not allowed.</p>
}

@if (userForm.get('username')?.pending) {
  <p>Checking availability...</p>
}
\`\`\`

---

### 6. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | Validation is often handled manually by checking state on every change, or by using a schema library like Zod or Yup with a hook |
| **Angular** | Validation logic is decoupled from the UI. You define the rules in the logic layer, and the framework automatically tracks the status (valid/invalid/pending). Because it's built-in, you get standard ways to handle complex scenarios like async checks and cross-field comparisons without adding extra libraries |`,
    ['sync-validation', 'async-validation', 'validators'],
    'intermediate'
  ),
  topic(
    'ControlValueAccessor',
    `\`ControlValueAccessor\` is the **"bridge"** between Angular's Forms API and a custom UI component.

In React, if you want a custom component to act like an input, you just pass \`value\` and \`onChange\` as props. In Angular, to make a custom component (like a Star Rating or a Custom Toggle) work seamlessly with \`formControlName\` or \`[(ngModel)]\`, you must implement the \`ControlValueAccessor\` interface.

---

### 1. The Interface Methods

To build a CVA, you must implement these four methods:

| Method | Description |
|--------|-------------|
| \`writeValue(value: any)\` | **Model → View.** Angular calls this to push a value from the TypeScript code into your component (e.g., when you call \`patchValue\`) |
| \`registerOnChange(fn: any)\` | **View → Model.** Angular gives you a function (\`fn\`). You must save it and call it whenever the user changes the value in the UI |
| \`registerOnTouched(fn: any)\` | Angular gives you a function to call when the user "touches" the component (e.g., on blur). This is how Angular knows to show "Required" error messages |
| \`setDisabledState(isDisabled: boolean)\` | (Optional) Angular calls this when the form control is disabled |

---

### 2. Implementation Example (Custom Counter)

This is how you turn a simple counter into a "First-Class" form element.

\`\`\`typescript
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <button (click)="decrement()">-</button>
    <span>{{ value }}</span>
    <button (click)="increment()">+</button>
  \`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterComponent),
      multi: true
    }
  ]
})
export class CounterComponent implements ControlValueAccessor {
  value = 0;
  onChange = (val: any) => {}; // Placeholder
  onTouched = () => {};        // Placeholder

  increment() {
    this.value++;
    this.onChange(this.value); // Tell Angular the value changed
  }

  decrement() {
    this.value--;
    this.onChange(this.value); // Tell Angular the value changed
  }

  // Implementation of CVA Interface:
  writeValue(val: any): void { this.value = val; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
\`\`\`

---

### 3. Usage in a Form

Once implemented, your custom component works exactly like a native \`<input>\`.

\`\`\`html
<form [formGroup]="myForm">
  <app-counter formControlName="quantity"></app-counter>
</form>
\`\`\`

---

### 4. Why is this useful?

| Benefit | Description |
|---------|-------------|
| **Encapsulation** | You can build a complex Date Range Picker or a Google Maps Location Picker, and the parent form doesn't need to know how it works. It just sees a "value" |
| **Validation** | Your custom component automatically inherits validation states (\`ng-invalid\`, \`ng-touched\`) from the parent form |
| **Consistency** | It allows your design system components to behave exactly like native HTML elements |

---

### 5. Key Differences from React

| Framework | Approach |
|-----------|----------|
| **React** | There is no "middleman." You manually pass down \`value\` and \`onChange\`. If you have a deep component tree, you might use Context or a library like React Hook Form to register the component |
| **Angular** | CVA is a formal contract. By providing \`NG_VALUE_ACCESSOR\`, you are telling the Angular engine: "Hey, I'm a form control. If someone puts a \`formControlName\` on me, use these methods to talk to me." It's more boilerplate than React, but it results in a highly standardized and decoupled architecture |`,
    ['custom-controls', 'CVA', 'forms'],
    'advanced'
  ),
]);
