import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-dark bg-dark mb-5">
      <span class="navbar-brand mb-0 h1 mx-auto">LyricFinder</span>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
