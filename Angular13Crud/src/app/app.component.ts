import { Component } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DailogComponent } from './dailog/dailog.component';
import { ApiService } from './services/api.service';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Angular13Crud';


  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dailog: MatDialog, private api: ApiService) {

  }
  ngOnInit(): void {
    this.getAllProducts();

  }
  openDialog() {
    this.dailog.open(DailogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val == 'save'){
        this.getAllProducts();
      }
    })
  }
  getAllProducts() {
    this.api.getProduct()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort
        },
        error: (err) => {
          alert("Error while fectchin the Records!!")
        }
      })

  }
  editProduct(row : any){
    this.dailog.open(DailogComponent,{
      width : '30%',
      data : row
    }).afterClosed().subscribe(val=>{
      if(val == 'update'){
        this.getAllProducts();
      }
    })
  }
  deleteProduct(id:number){
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        alert("Product Deleted SucessFully");
        this.getAllProducts();
      },
      error:()=>{
        alert("Error while deleting the product");
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}