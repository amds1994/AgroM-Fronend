import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private productServices: ProductService,
    public dialog: MatDialog, private snackBar: MatSnackBar) { }

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
  processProductResponse(resp: any) {
    const dateProduct: ProductElement[] = [];
  
    if (resp.metadata[0].code === "00") {
      let listCProduct = resp.product.products;
  
      if (listCProduct.length === 0) {
        // No se encontraron productos por nombre, puedes realizar una acción aquí
        console.log("No se encontraron productos por ese nombre.");
        this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
        this.dataSource.paginator = this.paginator;
        return;
      }
  
      listCProduct.forEach((element: ProductElement) => {
        // element.category = element.category.name;  // Comentado para no modificar la categoría
        element.picture = 'data:image/jpeg;base64,' + element.picture;
        dateProduct.push(element);
      });
  
      // Setear el data source
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
  }
  

  openProductDialog() {
    // Abre el diálogo para agregar un nuevo producto
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px', // Ancho del diálogo
    });
  
    // Escucha el evento de cierre del diálogo
    dialogRef.afterClosed().subscribe((result: number | undefined) => {
      // Comprueba el resultado obtenido del diálogo
      if (result === 1) {
        // El producto fue agregado exitosamente
        this.openSnackBar("Producto Agregado", "Exitosa");
        this.getProducts();
      } else if (result === 2) {
        // Ocurrió un error al guardar el producto
        this.openSnackBar("Se produjo un error al guardar producto", "Error");
      }
    });
  }
  

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  // editar producto
  edit(id:number, name: string, price: number, account: number, category: any){

    const dialogRef = this.dialog.open(NewProductComponent , {
      width: '450px',
      data: {id: id, name: name, price: price, account: account, category: category}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Producto editado", "Exitosa");
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar el producto", "Error");
      }
    });

  }

  // eliminar producto
  delete(id: any){

    const dialogRef = this.dialog.open(ConfirmComponent , {
      width: '450px',
      data: {id: id, module: "product"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Producto eliminado", "Exitosa");
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al elimnar el producto", "Error");
      }
    });
  }

  buscar(name: any){

    if(name.length === 0){
      return this.getProducts();
    }

    this.productServices.getProductByName(name)
      .subscribe( ( resp: any) => {
        this.processProductResponse(resp);
      });
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

