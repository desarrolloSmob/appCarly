import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { NgxSpinnerService } from "ngx-spinner";
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  //url = "localhost:3000/";
  //url = "https://andanacmsg.herokuapp.com/"
  //url = "https://andanac.uc.r.appspot.com/"
  //url = "https://4949-2806-2a0-b2e-81ab-d8ff-4d02-2311-5505.ngrok-free.app/";
  url = "https://6e06-2806-2a0-b2e-81ab-4cc7-d020-6d40-8f0a.ngrok-free.app/";
  private dbPath = '/requests';
  basePath: string = ""
  tutorialsRef: AngularFireList<Request>;
  constructor(private spinner: NgxSpinnerService, private db: AngularFireDatabase, public router: Router, private toastr: ToastrService, private storage: AngularFireStorage, private http: HttpClient) {
    this.tutorialsRef = db.list(this.dbPath);
    //this.tutorialsRef = db.list(this.dbPath, ref => ref.orderByChild('isRevised').equalTo(true));
  }

  /*   pushFileToStorage(fileUpload: any,Request: Request): Observable<number | undefined> {
      this.basePath=moment().format("YYYY/MM")
      let dateNow=new Date().getTime();
      const filePath = `/${this.basePath}/-${dateNow}-${fileUpload.file.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, fileUpload.file);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            Request.fileURL = downloadURL;
            Request.nameFile = fileUpload.file.name;
            this.create(Request)
           // this.saveFileData(fileUpload);
          });
        })
      ).subscribe();
      return uploadTask.percentageChanges();
    } */

  getAllAdmin(): AngularFireList<Request> {
    return this.tutorialsRef;
  }

  getAll(uid: string, startTime: number, endTime: number): AngularFireList<Request> {
    return this.db.list('webData/' + uid + '/cars', ref => ref.orderByChild('dateTime').startAt(startTime).endAt(endTime));
  }
  revieA(uid: string, id: any): any {
    this.spinner.show();
    var formData: any = new FormData();
    formData.append('id', id);
    formData.append('uid',uid)
    this.toastr.success("Se empezo la revisión del carro, esto puede demorar","Investigación en proceso")

    this.http.post<any>(this.url+"api/revisar", formData).subscribe(data => {
      this.db.list('webData/' + uid + '/cars').update(id,{reviewA:true}).then((result) => {
        this.spinner.hide()
      })
    })

  }

  create(uid: string, car: any): any {
    this.spinner.show();
    var formData: any = new FormData();
    formData.append('vin', car.niv);
    this.http.post<any>(this.url+"/api/procces_vin", formData).subscribe(data => {
      console.log(data)
      for (let i in data){
        car[i]=data[i]
      }
       return this.db.list('webData/' + uid + '/cars').push(car).then((result) => {
        console.log(result.key)
        car.key = result.key

        this.router.navigate(['car/' + result.key])
        this.toastr.success('Solicitud creada', 'Correcto');
      }).catch((error) => {
        window.alert(error.message);
      });
    })
  }

  update(key: string, value: any): Promise<void> {
    return this.tutorialsRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.tutorialsRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.tutorialsRef.remove();
  }
  getOnly(uid:string,key: string): AngularFireObject<any> {
    return this.db.object('webData/' + uid + '/cars/'+ key)

  }
  /* getQueryInsert(keyArray: number): AngularFireList<Dealers> {
    return this.db.list('/dealers', ref => ref.orderByChild('keyArray').equalTo(keyArray))

  } */
}
