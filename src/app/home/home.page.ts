import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Todo } from '../models/todo';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers:[TodoService]
})
export class HomePage {

  todos: Todo[];

  constructor(
    private afauth: AngularFireAuth,
    private router: Router,
    private todoService: TodoService,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private afs: AngularFirestore
  ) {}

  ngOnInit(){
    this.todoService.getTodos().subscribe(todos =>{
      this.todos=todos;
    });
  }

  addNewData(){
    this.router.navigate(['/add']);
  }

  edit(todoId){
    this.router.navigate(['/edit/',todoId]);
  }

  async delete(todoId){
    const loading=await this.loadingCtrl.create({
      message:'Deleting..',
      spinner:'crescent',
      showBackdrop:true
    });
    loading.present();
    this.afs.collection('todo').doc(todoId).delete()
    .then(()=>{
      loading.dismiss();
      this.toast('Data deleted','success');
    })
    .catch((error)=>{
      loading.dismiss();
      this.toast(error.message,'danger');
    })
  }

  async done(todoId){
    const loading=await this.loadingCtrl.create({
      message:'Updating status..',
      spinner:'crescent',
      showBackdrop:true
    });
    loading.present();
    this.afs.collection('todo').doc(todoId).update({
      'status':'Done'
    })
    .then(()=>{
      loading.dismiss();
      this.toast('Data updated','success');
    })
    .catch((error)=>{
      loading.dismiss();
      this.toast(error.message,'danger');
    })
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

  logout(){
    this.afauth.signOut().then(()=>{
      this.router.navigate(['/login']);
    })
  }

}
