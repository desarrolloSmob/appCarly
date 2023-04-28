import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public authService: AuthService, private spinner: NgxSpinnerService,    public router: Router,) { }
  //Form Validables 
  registerForm: any = FormGroup;
  submitted = false;
  //Add user form actions
  get f() { return this.registerForm.controls; }
  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    //True if all the fields are filled
    if (this.submitted) {
      let obj = {
        "email": this.registerForm.get('email')?.value,
        "pass": this.registerForm.get('password')?.value,
        "name": this.registerForm.get('password')?.value,
        "profile":"User",
        "Plan":"Free",
        "isNew":true
      }
      this.authService.SignUp(obj)
    }

  }
}
