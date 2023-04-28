import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { CarsService } from 'src/app/shared/services/cars.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  constructor(
    private router: Router,
    private carsService: CarsService,
    private spinner: NgxSpinnerService,
    private cockie:CookieService,
    public dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.spinner.show();
    if (localStorage.getItem("userProfile")) {
      let data = localStorage.getItem("userProfile") || "{}"
      this.dataUser = JSON.parse(data)
      this.typeUser = this.dataUser.type;
      this.uid=this.dataUser.uid;
      this.name = this.dataUser.name;
      this.retrieveProfiles()
      this.spinner.hide();
    } else {
      this.router.navigate(['login']);
    }
  }

  retrieveProfiles() {
    let startDate = moment().startOf("month").utc().format();
    let endDate = moment().endOf("month").utc().format("YYYY-MM-DD");
    this.range.get("start")!.setValue(startDate);
    this.range.get("end")!.setValue(endDate);
    startDate = moment().startOf("month").format("YYYY-MM-DD HH:mm");
    endDate = moment().endOf("month").format("YYYY-MM-DD HH:mm");
    console.log(new Date().getTime())
    this.carsService.getAll(this.uid,new Date(startDate).getTime(), new Date(endDate).getTime()).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.dataProfiles = data;
    })
  }

  deleteProfile(key: string) {
    Swal.fire({
      title: '¿Deseas eliminar el carro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.carsService.delete(key).then((result) => {
          Swal.fire('Eliminado correctamente', '', 'success')
        })
          .catch((error) => {
            Swal.fire(error.message, '', 'error')
          });
      }
    })
  }
}
