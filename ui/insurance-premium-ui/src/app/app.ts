import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'Insurance Premium Calculator';
  premiumForm: FormGroup;
  result: PremiumResult | null = null;
  errorMessage = '';

  // IMPORTANT: update this to your actual API URL/port
  apiUrl = 'https://localhost:5001/api/premium';

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  constructor() {
    this.premiumForm = this.fb.group({
      age: [35, [Validators.required, Validators.min(18), Validators.max(80)]],
      coverageAmount: [250000, [Validators.required, Validators.min(10000)]],
      isSmoker: [false],
      state: ['PA', Validators.required],
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.result = null;

    if (this.premiumForm.invalid) {
      this.errorMessage = 'Please fix validation errors before submitting.';
      return;
    }

    const payload: PremiumRequest = this.premiumForm.value;

    this.http.post<PremiumResult>(this.apiUrl, payload).subscribe({
      next: (res) => (this.result = res),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error calculating premium. Please try again.';
      },
    });
  }
}

