import { Routes } from '@angular/router';
import { AddTrip } from './add-trip/add-trip';
import { TripListingComponent } from './trip-listing/trip-listing';
import { EditTrip } from './edit-trip/edit-trip';
import { Login } from './models/login/login';

export const routes: Routes = [
    { path: 'add-trip', component: AddTrip},
    { path: 'edit-trip', component: EditTrip},
    { path: 'login', component: Login },
    { path: '', component: TripListingComponent, pathMatch: 'full'}
];
