import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../ui/button/button.component';
import { DataService } from '../../../services/fetch.service';
import { IFullProduct } from '../../../../types';
import { ProductCardComponent } from '../../../ui/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, ButtonComponent, CommonModule],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  isloadingMore = true;
  products: IFullProduct[] = [];
  lastPage = 1;
  hasNext = true;

  constructor(private dataService: DataService) {}

  async loadMoreClick() {
    this.isloadingMore = true;
    this.lastPage += 1;
    this.loadData(this.lastPage);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(page: number = 1) {
    this.dataService
      .getData<{
        data: IFullProduct[];
        pages: { current: number; limit: number; hasNext: boolean };
      }>('/api/catalog/homefeed', { limit: 5, page })
      .subscribe({
        next: (response) => {
          this.products = [...this.products, ...response.data];
          this.hasNext = response.pages.hasNext;
        },
        error: (error) => {
          this.isloadingMore = false;
        },
        complete: () => {
          this.isloadingMore = false;
        },
      });
  }
}
