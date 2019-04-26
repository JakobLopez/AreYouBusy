import { NgModule } from '@angular/core';
import { OrderbyPipe } from './orderby/orderby';
import { ConvertTimePipe } from './convert-time/convert-time';
@NgModule({
	declarations: [OrderbyPipe,
    ConvertTimePipe],
	imports: [],
	exports: [OrderbyPipe,
    ConvertTimePipe]
})
export class PipesModule {}
