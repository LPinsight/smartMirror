// geocoding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Location } from '@interface/display';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private URL: string = 'https://nominatim.openstreetmap.org/search?format=json&q='

  constructor(private http: HttpClient) {}

  searchAddress(address: string): Observable<{ location: Location; name: string } | null> {
    if (!address || address.trim().length === 0) return new Observable(obs => obs.next(null));

    return this.http.get<NominatimResult[]>(this.URL + `${encodeURIComponent(address)}`).pipe(
      map(results => {
        if (!results || results.length === 0) return null;

        const res = results[0];
        return {
          location: { lat: parseFloat(res.lat), lon: parseFloat(res.lon) },
          name: res.display_name
        };
      })
    );
  }

  reverseGeocode(lat: number, lon: number): Observable<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get<any>(url).pipe(
      map(res => res?.display_name || null)
    );
  }

}