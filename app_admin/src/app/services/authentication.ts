import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  // Setup our storage and service access
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripData: TripData
  ) { }

  // Variable to handle Authentication Responses
  authResp: AuthResponse = new AuthResponse();

  // Get our token from our Storage provider.
  // NOTE: For this app I've decided to name the key for the token 'travlr-token'
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');

    // Return a string even if a token isn't present
    if(!out) 
    {
      return '';
    }
    return out;
  }

  // Save token to Storage provider.
  // NOTE: name for token is 'travlr-token'
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout of app and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Boolean to determine if we are logged in and the token is still valid
  // Even if we have a tokenwe will have to reauth if token expired
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  // Retrieve the current user. This function should only be called after 
  // the calling method has checked to make sure that the user isLoggedIn.
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  // Login method that leverages the login method in tripDataService 
  // Because that method returns an observable, we subscribe to the 
  // result and only process when the Ovservable condition is satisfied
  // Uncomment the two console.log messages for additional debugging info.
  public login(user: User, passwd: string) : void {
    this.tripData.login(user,passwd).subscribe({
      next: (value: any) => {
        if(value)
        {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    })
  }

  // Register method that leverages the register method in tripData
  // because that method returns an observable, we subscribe to the result
  // and only process when the Observable condition is satisfied
  // NOTE: Method is nearly identical to login() because behavior of API
  public register(user: User, passwd: string) : void {
    this.tripData.register(user,passwd).subscribe({
      next: (value: any) => {
        if(value)
        {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    })
  }
  
}
