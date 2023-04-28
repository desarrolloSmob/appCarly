import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

import { CarsService } from 'src/app/shared/services/cars.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.css']
})
export class EditCarComponent implements OnInit {
  titularAlerta: string = ""
  dataUser: any;
  range = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
    idGroup: new FormControl(null),
    idDelear: new FormControl(null),
    idProveedor: new FormControl(null)
  });
  dataUserDistribuidor: any;
  dataDelears: any;
  dataGroups: any;
  dataProveedor: any;
  dataProfiles: any;
  typeUser: string = "";
  uid: string = "";
  name: string = "";
  search: string = ""
  searchEstado: string = ""
  searchDistribuidor: string = ""
  searchProveedor: string = ""
  id: any
  car:any={}
  constructor(
    private router: Router,
    private carsService: CarsService,
    private spinner: NgxSpinnerService,
    private cockie: CookieService,
    private aRouter: ActivatedRoute,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.spinner.show();
    if (localStorage.getItem("userProfile")) {
      let data = localStorage.getItem("userProfile") || "{}"
      this.dataUser = JSON.parse(data)
      this.typeUser = this.dataUser.type;
      this.uid = this.dataUser.uid;
      this.name = this.dataUser.name;
      this.id = this.aRouter.snapshot.paramMap.get('id');
      this.getCar()
    } else {
      this.router.navigate(['login']);
    }
  }
  getCar() {
    
    this.carsService.getOnly(this.uid,this.id).valueChanges().subscribe(data => {
      this.car=data
      this.spinner.hide();
    })
  }

  reviewA(){
    this.carsService.revieA(this.uid,this.id)
    /* id=request.form["id"]
    uid=request.form["uid"]
     */
  }
}