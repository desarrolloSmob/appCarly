import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

import { CarsService } from 'src/app/shared/services/cars.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef | undefined;
  @ViewChild('canvasElement') canvasElement: ElementRef | undefined;
  url = "https://6e06-2806-2a0-b2e-81ab-4cc7-d020-6d40-8f0a.ngrok-free.app/";
  viewPhoto:boolean=false
  checked = false;
  viewProrrateo = false;
  newFormRequest: FormGroup;
  dataUser: any;
  uid:string="";
  dataDelears: any;
  photoResult:any;
  arrayProrrateo: any = [];
  dataProveedor: any = []
  dataProductos: any = [];
  typeUser: string = "";
  name: string = "";
  searchMedia: string = "";
  selectedFiles?: FileList;
  takePhotoW:boolean=false;
  typePhoto:string=""
  percentage = 0;
  
  videoStream: MediaStream | undefined;
  currentCameraIndex: number = 0;
  cameras: MediaDeviceInfo[] = [];

  constructor(private spinner: NgxSpinnerService, private http: HttpClient,private fb: FormBuilder, private router: Router, private toastr: ToastrService, private carsService:CarsService) {
    this.newFormRequest = this.fb.group({
      textNiv: ['', Validators.required],
      numberMotor: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    //this.spinner.show();
    if (localStorage.getItem("userProfile")) {

      let data = localStorage.getItem("userProfile") || "{}"
      this.dataUser = JSON.parse(data)
      console.log(this.dataUser)
      this.typeUser = this.dataUser.type;
      this.name = this.dataUser.name;
      this.uid=this.dataUser.uid;
      this.newFormRequest.setValue({
        textNiv: "",
        numberMotor: ""
      })
      this.getCameras();
    } else {
      this.router.navigate(['login']);
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  addRequest() {
    this.spinner.show();
    const date = moment().format("DD/MM/YYYY HH:mm");
    const Request: any = {
      key: null,
      niv: this.newFormRequest.get('textNiv')?.value,
      numMotor: this.newFormRequest.get('numberMotor')?.value,
      uid: this.dataUser.uid,
      dateTime: new Date().getTime(),
      dateNow: date
    }
    this.carsService.create(this.uid,Request)
  }
  startPhoto(){
    this.getCameras();
    this.startCamera(this.typePhoto);
  }
  switchCamera() {
    this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameras.length;
    this.stopCamera();
    this.startCamera(this.typePhoto);
  }

  startCamera(type:any) {
    this.typePhoto=type
    this.viewPhoto=true
    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: { exact: this.cameras[this.currentCameraIndex].deviceId }
      }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this.videoStream = stream;
        const video = this.videoElement!.nativeElement;
        video.srcObject = this.videoStream;
        video.play();
      })
      .catch(error => console.error('Error accessing camera: ', error));
  
  }
  
  getCameras() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        console.log(devices)
        this.cameras = devices.filter(device => device.kind === 'videoinput');
      })
      .catch(error => console.error('Error enumerating devices: ', error));
  }

  takePhoto() {
    const video = this.videoElement!.nativeElement;
    const canvas = this.canvasElement!.nativeElement;
    const context = canvas.getContext('2d');
    // Dibuja el video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Obtiene la imagen como base64
    this.photoResult = canvas.toDataURL('image/png').split(",")[1];   
    // Puedes enviar la imagen a un servidor o realizar otras operaciones con ella
  }

  

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track: { stop: () => any; }) => track.stop());
    }
  }
  
  proceesPhoto(){
    this.spinner.show();
    this.viewPhoto=false
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track: { stop: () => any; }) => track.stop());
    }
    var formData: any = new FormData();
    formData.append('base64', this.photoResult);
    this.http.post<any>(this.url+"api/fotoVIN", formData).subscribe(data => {
      if(data.result!= "ErrorPhoto"){
        if(this.typePhoto == "VIN"){
          this.newFormRequest.get("textNiv")?.setValue(data.result)
        }else{
          this.newFormRequest.get("numberMotor")?.setValue(data.result)
        }
        this.spinner.hide();
      }else{
        this.toastr.error("Foto ilegible")
        this.spinner.hide();
      }
    })
  }

}