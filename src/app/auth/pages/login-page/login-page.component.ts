import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  private fb = inject(FormBuilder);
  public myForm: FormGroup = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  login() {
    const { email, password } = this.myForm.value;

    this.authService.login(email,password)
        .subscribe({
          next: () => this.router.navigateByUrl('/dashboard'),
          error: (error) => {
            Swal.fire('Error', error.message, 'error');
          }
        })
  }

}