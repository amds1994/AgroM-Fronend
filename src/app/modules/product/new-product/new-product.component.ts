import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../shared/services/product.service';
import { error } from 'console';

export interface Category {
  description: string;
  id: number;
  name: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  // Declaracion de variables
  public productForm: FormGroup;
  // Variable del formulario
  estadoFormulario: string = "";
  // Variable para las categorias
  categories: Category[] = [];
  // Imagen del producto
  slectedFile: any;
  nameImage: string = "";

  constructor(private fb: FormBuilder, private categoryService: CategoryService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<NewProductComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.estadoFormulario = "Agregar"

      this.productForm = this.fb.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
        account: ['', Validators.required],
        category: ['', Validators.required],
        picture: ['', Validators.required]

      })
      
    }

  ngOnInit(): void {
    this.getCategories();
  }

  onSave(){

    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      account: this.productForm.get('account')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.slectedFile
    }

    const uploadImageData = new FormData();
    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('account', data.account);
    uploadImageData.append('categoryId', data.category);

    // llamado al servicio para guardar el producto
    this.productService.saveProduct(uploadImageData)
      .subscribe( (data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      })

  }

  onCancel(){
    this.dialogRef.close(3);
  }

  // Metodo para optener las categorias
  getCategories(){
    this.categoryService.getCategories()
      .subscribe( (data : any) => {
        this.categories = data.categoryResponse.category;
      }, (error: any) => {
        console.log("Error al obtener las categorias");
      });
  }

  onFileChanged(event: any){

    this.slectedFile = event.target.files[0];
    // prueba para mostrar la imagen
    console.log(this.slectedFile);

    this.nameImage = event.target.files[0].name;
  }

}
