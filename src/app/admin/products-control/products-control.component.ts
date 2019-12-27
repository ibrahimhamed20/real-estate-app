import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Products } from 'src/app/types.interface';
import { ProductsControlService } from '../../shared/products-control.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-control',
  templateUrl: './products-control.component.html',
  styleUrls: ['./products-control.component.css']
})
export class ProductsControlComponent implements OnInit {

  products: Products[] = [];
  editProduct: Products = <Products>{};
  productForm: FormGroup;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private _toustr: ToastrService,
    private _productService: ProductsControlService
  ) { }

  data: Products = <Products>{};
  ngOnInit() {
    this.initProductForm();
    this.getAllProducts();
  }

  initProductForm() {
    this.productForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      price: new FormControl(0),
      main_image: new FormControl(),
      short_desc: new FormControl('', [Validators.required, Validators.minLength(5)]),
      long_desc: new FormControl('', [Validators.required, Validators.minLength(20)]),
      img_temp1: new FormControl(),
      img_temp2: new FormControl(),
      img_temp3: new FormControl(),
      img_temp4: new FormControl(),
      owner_name: new FormControl(),
      owner_phone: new FormControl(),
      address: new FormControl()
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  //# start crud operation of products
  getAllProducts() {
    this._productService.getAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data: any) => {
          if (data) {
            this.products = data.products;
          }
        },
        err => console.error(err),
        () => {
          // console.log(this.products);
        });
  }
  getProductsById(code: number) {
    this._productService.getById(code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        data => {
          this.editProduct = data[0];
        },
        err => console.error(err),
        () => {
          console.table(this.editProduct);
        });
  }

  fileData: File = null;
  fileData1: File = null;
  fileData2: File = null;
  fileData3: File = null;
  handleFileInput(files: FileList, flag: number) {
    if (flag == 1) {
      this.fileData = files.item(0);
      this.productForm.get('main_image').setValue(this.fileData ? this.fileData.name : '');
    } else if (flag == 2) {
      this.fileData1 = files.item(0);
      this.productForm.get('img_temp1').setValue(this.fileData ? this.fileData.name : '');
    } else if (flag == 3) {
      this.fileData2 = files.item(0);
      this.productForm.get('img_temp2').setValue(this.fileData ? this.fileData.name : '');
    } else if (flag == 4) {
      this.fileData3 = files.item(0);
      this.productForm.get('img_temp3').setValue(this.fileData ? this.fileData.name : '');
    }
  }

  saveProduct() {
    this.editProduct = this.productForm.value;
    const formData: FormData = new FormData();

    formData.append('name', this.editProduct.name);
    formData.append('price', String(this.editProduct.price));
    formData.append('short_desc', this.editProduct.short_desc);
    formData.append('long_desc', this.editProduct.long_desc);
    formData.append('owner_name', this.editProduct.owner_name);
    formData.append('owner_phone', this.editProduct.owner_phone);
    formData.append('address', this.editProduct.address);

    if (this.fileData && this.fileData != null) {
      formData.append('main_image', this.fileData, this.fileData.name);
    }
    if (this.fileData1 && this.fileData1 != null) {
      formData.append('img_temp1', this.fileData1, this.fileData1.name);
    }
    if (this.fileData2 && this.fileData2 != null) {
      formData.append('img_temp2', this.fileData2, this.fileData2.name);
    }
    if (this.fileData3 && this.fileData3 != null) {
      formData.append('img_temp3', this.fileData3, this.fileData3.name);
    }

    if (!this.editProduct.id || this.editProduct.id == null || this.editProduct.id == 0) {
      this._productService.create(formData)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(msg => {
          this._toustr.success('تم حفظ العقار بنجاح!', 'نجاح');
          this.getAllProducts();
        }, err => {
          this._toustr.error(err, 'فشل!');
        },
          () => {

          });
    } else {
      formData.append('id', this.editProduct.id.toString());
      this._productService.update(formData)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(msg => {
          this._toustr.success('تم تحديث العقار بنجاح!', 'نجاح');
          this.getAllProducts();
        }, err => {
          this._toustr.error(err, 'فشل!');
        },
          () => {

          });
    }
  }

  deleteProducts(id: number) {
    if (id > 0) {
      this._productService.delete(id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(msg => {
          this._toustr.success('تم حذف العقار بنجاح!', 'نجاح');
          this.getAllProducts();
        }, err => {
          this._toustr.error(err, 'فشل!');
        },
          () => {

          });
    }
  }
  //# end crud operation of products

  // popup functions  --> open --> dismiss
  openModal(content, data: Products) {
    if (data.id > 0) {
      this.productForm.patchValue(data);
    } else {
      this.productForm.reset();
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.saveProduct();
    }, (reason) => {
      console.log(`Dismissed => ${reason}`);
    });
  }

}
