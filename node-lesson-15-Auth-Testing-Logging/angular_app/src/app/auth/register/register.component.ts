import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['JaneDoe', [Validators.required, Validators.minLength(3)]],
      password: ['12345678', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['12345678', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch()) {
      const { username, password } = this.registerForm.value;
      this.authService.register({ username, password }).subscribe(
        () => {
          this.snackBar.open('Реєстрація успішна!', 'Закрити', {
            duration: 2000,
          });
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          this.snackBar.open('Помилка реєстрації', 'Закрити', {
            duration: 2000,
          });
          // Обробка помилки
        },
      );
    } else {
      this.snackBar.open('Будь ласка, виправте помилки у формі', 'Закрити', {
        duration: 2000,
      });
    }
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }
}
