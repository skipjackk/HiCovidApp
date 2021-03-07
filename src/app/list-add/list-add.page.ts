import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-list-add',
  templateUrl: './list-add.page.html',
  styleUrls: ['./list-add.page.scss'],
})
export class ListAddPage implements OnInit {

  fullname: string;
  age: number;
  address: string;
  photo: string;
  gender: string;
  dateSick: string;
    
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController
  ) { }

  ngOnInit() {
  }

  async addPerson(){
    if(this.fullname && this.age && this.address && this.photo && this.gender && this.dateSick){
      const loading=await this.loadingCtrl.create({
        message: 'Add Data..',
        spinner:'crescent',
        showBackdrop:true
      });
      loading.present();
      const todoId=this.afs.createId();
      this.afs.collection('todo').doc(todoId).set({
        'todoId': todoId,
        'fullname': this.fullname,
        'age': this.age,
        'address': this.address,
        'photo': this.photo,
        'gender': this.gender,
        'dateSick': this.dateSick,
        'status': '',
        'createdAt': Date.now()
      })
      .then(()=>{
        loading.dismiss();
        this.toast('Successfully added','success');
        this.router.navigate(['/home']);
      })
      .catch((error)=>{
        loading.dismiss();
        this.toast(error.message,'danger');
      })
    }
  }

  async toast(message,status){
    const toast=await this.toastr.create({
      message:message,
      position:'top',
      color:status,
      duration: 2000
    });
    toast.present();
  }

}
