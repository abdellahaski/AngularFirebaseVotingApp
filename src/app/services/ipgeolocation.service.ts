import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IpgeolocationService {
  api_key = environment.abstractapiAPIKEY;
  url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + this.api_key;
  

  constructor(private http:HttpClient) { }
  
  getIP():Observable<any>{
    return this.http.get(this.url);
  }
}
