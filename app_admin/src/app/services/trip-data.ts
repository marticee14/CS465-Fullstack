import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';

import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';


@Injectable({
  providedIn: 'root'
})

export class TripData {
  
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}
  url = 'http://localhost:3000/api/trips';
  baseUrl = 'http://localhost:3000/api';
  //baseUrl = 'http://localhost:4200';

  getTrips() : Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip) : Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  getTrip(tripCode: string) : Observable<Trip[]> {
    //console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }

  updateTrip(formData: Trip) : Observable<Trip> {
    //console.log('Inside TripDataService::addTrips');
    return this.http.put<Trip>(this.url + '/' + formData.code, formData);
  }

  /*updateTrip(trip: Trip): Observable<Trip> {
    const token = this.storage.getItem('travlr-token') || '';
    const headers = new HttpHeaders({ Authorization: 'Bearer $(token)'});

    return this.http.put<Trip>(
      '${this.baseUrl}/trips/${trip.code}',
      trip,
      { headers }
    );
  }*/

  // Call to our /login endpoint, returns JWT
  login(user: User, passwd: string) : Observable<AuthResponse> {
    //console.log('Inside TripData::login');
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to out /register endpoint, creates user and returns JWT 
  register(user: User, passwd: string) : Observable<AuthResponse> {
    //console.log('Inside TripData::register');
    return this.handleAuthAPICall('register', user, passwd);
  }

  // helper method to process both login and register methods
  handleAuthAPICall(endpoint: string, user: User, passwd: string) : Observable<AuthResponse> {
    //console.log('Inside TripData::handleAuthAPICall');
    let formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint, formData);
  }
}
