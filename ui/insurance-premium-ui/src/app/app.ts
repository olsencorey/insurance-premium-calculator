import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface PremiumRequest {
  age: number;
  coverageAmount: number;
  isSmoker: boolean;
  state: string;
}

interface PremiumResult {
  annualPremium: number;
  baseRate: number;
  ageFactor: number;
  smokerSurcharge: number;
  stateAdjustment: number;
  ratingNotes: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // <-- plural, array
})
export class AppComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Point this to your API
  apiUrl = 'http://localhost:5187/api/premium';

  // Result + error state
  loading = false;
  premiumResult: number | null = null;
  errorMessage: string | null = null;
  premiumDetails: any = null;
  
  // Reactive form
  premiumForm = this.fb.group({
    age: [30, [Validators.required]],
    coverageAmount: [250000, [Validators.required]],
    smoker: ['No', [Validators.required]],
    state: ['PA', [Validators.required]]
  });

  calculatePremium() {
    console.log('calculatePremium clicked');
    this.errorMessage = null;
    this.premiumResult = null;
    this.premiumDetails = null;

    if (this.premiumForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const formValue = this.premiumForm.value;

    const payload = {
      age: Number(formValue.age),
      coverageAmount: Number(formValue.coverageAmount),
      smoker: formValue.smoker === 'Yes',
      state: String(formValue.state)
    };

    console.log('Submitting payload', payload);
    this.loading = true;

    this.http.post<{
      ageFactor: number;
      annualPremium: number;
      baseRate: number;
      ratingNotes: string;
      smokerSurcharge: number;
      stateAdjustment: number;
    }>(this.apiUrl, payload).subscribe({
      next: result => {
        console.log('API result', result);
        this.premiumDetails = result;
        this.premiumResult = result.annualPremium;
        this.loading = false;
        console.log('Loading set to false, premiumResult:', this.premiumResult);
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('API error', err);
        this.errorMessage = 'An error occurred while calculating the premium.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

