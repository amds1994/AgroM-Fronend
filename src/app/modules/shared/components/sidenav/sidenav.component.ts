import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  mobileQuery: MediaQueryList;
  username: any;

  // Son los llamados a los componentes desde router-child.module.ts
  menuNav = [
    {name: "Home", route: "home", icon: "home"},
    {name: "Categorias", route: "category", icon: "category"},
    {name: "Produtos", route: "product", icon: "production_quantity_limits"},
  ]

  constructor(media: MediaMatcher, private keyloackSerevice: KeycloakService) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {

    // Obtenemos el nombre de usuario
    this.username = this.keyloackSerevice.getUsername();
  }

  // cerrar sesion
  logout(){
    this.keyloackSerevice.logout();
  }

}
