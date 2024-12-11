import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IFullProduct } from '../../../types';
import { RouterLink } from '@angular/router';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

@Component({
  selector: 'app-product-card',
  imports: [ButtonComponent, RouterLink, RatingStarsComponent],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product: IFullProduct | null = null;
}
