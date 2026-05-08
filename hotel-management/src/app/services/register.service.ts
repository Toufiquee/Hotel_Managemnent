import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RegisterService{
    
    private url = 'http://localhost:5038/api/register';

    constructor(private http : HttpClient){ }

    register(user : any)
    {
        return this.http.post( this.url, user);
    }

}