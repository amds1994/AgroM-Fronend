import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { error } from 'console';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private productServices: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  displayedColumns: string[] = ['id', 'name', 'price', 'account', 'category', 'picture', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  // Inicializar el paginador
  @ViewChild(MatPaginator)
  paginator!: MatPaginator 


  // metodo para optener los productos
  getProducts() {
    this.productServices.getProducts()
    .subscribe( (data:any) => {
      console.log("Respuesta products: ",data);
      this.processProductResponse(data);
    }, (error:any) => {
      console.log("Error en productos: ",error);
    });
  }
  processProductResponse(resp: any){
    const dateProduct: ProductElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCProduct = resp.product.products;

       listCProduct.forEach((element: ProductElement) => {
         element.category = element.category.name;
         element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateProduct.push(element);
       });

       //set the datasource
       this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
       this.dataSource.paginator = this.paginator;
     }
  }
  
}

export interface ProductElement {
  // Se ponene todos los campos que va a tener el modulo producto
  id: number;
  name: string;
  price: number;
  account: number;
  category: any;
  picture: any;
}

