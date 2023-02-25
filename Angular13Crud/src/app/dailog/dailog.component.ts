import { Component, OnInit , Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dailog',
  templateUrl: './dailog.component.html',
  styleUrls: ['./dailog.component.scss']
})
export class DailogComponent implements OnInit {


  freshnessList = ["Brand new", "Second Hand", "Refurbished"]
  productForm !: FormGroup;

  actionBtn : string = "save"

  constructor(private formBuilder: FormBuilder, 
  private api: ApiService,
  @Inject(MAT_DIALOG_DATA) public aditData :  any,
  private dialogRef : MatDialogRef<DailogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    });

    if(this.aditData){
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.aditData.productName);
      this.productForm.controls['category'].setValue(this.aditData.category);
      this.productForm.controls['freshness'].setValue(this.aditData.freshness);
      this.productForm.controls['price'].setValue(this.aditData.price);
      this.productForm.controls['comment'].setValue(this.aditData.comment);
      this.productForm.controls['date'].setValue(this.aditData.date);

    }
    


  }
  addProduct() {
   if(this.aditData){
    if (this.productForm.valid) {
      this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            alert("Product added successfully")
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Error while adding the product")
          }
        })
    }

   }else{
    this.updateProduct()
   }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.aditData.id)
    .subscribe({
      next:(res)=>{
        alert("Product Updated Sucessfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the records!!")
      }
    })



  }
}
