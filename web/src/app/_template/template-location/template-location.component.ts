import { AfterViewInit, Component, Input } from '@angular/core';
import { DataService } from '@service/data.service';
import { Display, Location } from '@interface/display';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AlertService } from '@service/alert.service';
import { GeocodingService } from '../../_service/geocoding.service';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: './../../assets/marker-icon-2x.png',
  iconUrl: './../../assets/marker-icon.png',
  shadowUrl: './../../assets/marker-shadow.png',
});

@Component({
    selector: 'app-template-location',
    templateUrl: './template-location.component.html',
    styleUrls: ['./template-location.component.scss'],
    standalone: false
})
export class TemplateLocationComponent implements AfterViewInit{
  @Input() display: Display | undefined
  private _location!: Location;
  @Input()
    set location(value: Location){
      this._location = value
      if (!this.map) return; // Map noch nicht initialisiert -> warten
      this.markerLayer.clearLayers()

      if(value.lat !== 0 && value.lon !== 0){
        this.setHome(value);
      } else {
        this.removeHome();
        this.setView(value)
      }
    }
    get location(): Location {
      return this._location
    }
    
  private map!: L.Map
  private markerLayer!: L.LayerGroup<any>;
  private homeLayer!: L.LayerGroup<any>;

  private initMap() {
    if (this.map) this.map.remove()

    this.map = L.map('map', {
      center: [ 51.35149, 10.45412 ],
      zoom: 6
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map)
    this.homeLayer = L.layerGroup().addTo(this.map)
  }

  constructor(
    private dataService: DataService,
    private geocodingService: GeocodingService,
    private alert: AlertService,
    private notification: ToastrService) {

  }

  ngAfterViewInit() {
    this.initMap()
    setTimeout(() => this.map.invalidateSize(), 100);
  
    this.map.on('click', (event) => {
      this.setMarker(event.latlng, this.markerLayer, 'neuer Standort')
    })
  }

  ngOnDestroy() {
    if (this.map) this.map.remove()
  }

  setHome(location: Location){
    let latlng = {
      lat: location.lat,
      lng: location.lon
    } 

    this.setMarker(latlng, this.homeLayer, 'Spiegel Standort')
    this.setView(location)
  }

  removeHome(){
    this.homeLayer.clearLayers()
  }

  async saveLocation () {
    if(this.markerLayer.getLayers().length == 0) {
      this.notification.error('Bitte Standort in der Karte setzen', "Standort setzen", { progressBar: true })
      return
    }

    const result = await Swal.fire(this.alert.addLocationConfig(this.display!.name))

    this.markerLayer.eachLayer((layer) => {      
      if (layer instanceof L.Marker && result.isConfirmed) {
        this.dataService.setLocation({
          lat: layer.getLatLng().lat,
          lon: layer.getLatLng().lng,
        }).subscribe( _ => {
          this.notification.success('Standort erfolgreich gesetzt', "Standort gesetzt", { progressBar: true })
        })
      }
    });
  }

  async removeLocation () {
    if (this._location.lat == 0 && this._location.lon == 0) {
        this.notification.error('Kein Standort zum ausgewählten Display vorhanden', "Kein Standort vorhanden", { progressBar: true })
      return
    }

    const result = await Swal.fire(this.alert.removeLocationConfig(this.display!.name))

    if (result.isDenied) {
      this.dataService.setLocation({
            lat: 0,
            lon: 0,
      }).subscribe( _ => {
        this.notification.success('Standort erfolgreich entfernt', "Standort entfernt", { progressBar: true })
      })
    }    
  }

  async searchAddress(address: string) {
    this.geocodingService.searchAddress(address).subscribe(res => {
      if(!res) {
        this.notification.warning('Adresse nicht gefunden', 'Suche', { progressBar: true });
        return;
      }

      this.setMarker({ lat: res.location.lat, lng: res.location.lon }, this.markerLayer, 'neuer Standort<br>');
      this.setView(res.location);
    })
  }

  setView(location: Location){
    if (location.lat == 0 && location.lon == 0) {
      this.map.setView({lat: 51.35149, lng: 10.45412}, 6)
    } else {
    this.map.setView({ lat: location.lat, lng: location.lon} , 16)
    }
  }

  setMarker(latlng: L.LatLngExpression, Layer: L.LayerGroup, markerTitle: string){
    let marker: L.Marker  
    Layer.clearLayers()
      this.map.closePopup()
      if (Layer == this.homeLayer) {
        marker = L.marker(latlng).addTo(Layer)
      } else {
        marker = L.marker(latlng, {draggable: true}).addTo(Layer)
      }
      marker.bindTooltip(markerTitle, {permanent: true}).openTooltip()
  }

}
