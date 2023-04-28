import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FormsComponent } from './components/forms/forms.component';
import { EditCarComponent } from './components/edit-car/edit-car.component'
import {  RestPasswordComponent} from './components/rest-password/rest-password.component'
import { SignUpComponent } from './components/sign-up/sign-up.component'

// route guard
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [{ path: 'login', component: LoginComponent },
{ path: 'restPassword', component: RestPasswordComponent },
{ path: 'singUp', component: SignUpComponent },
{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
//Formulario
{ path: 'newRequest', component: FormsComponent, canActivate: [AuthGuard] },
{ path: 'car/:id', component: EditCarComponent, canActivate: [AuthGuard] },
{ path: '', pathMatch: 'full', redirectTo: 'login' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
