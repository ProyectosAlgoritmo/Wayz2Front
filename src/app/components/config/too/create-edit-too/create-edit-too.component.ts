import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-create-edit-too',
  standalone: true,
  imports: [],
  templateUrl: './create-edit-too.component.html',
  styleUrl: './create-edit-too.component.css'
})

export class CreateEditTooComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let pageName = this.route.snapshot.paramMap.get('id') || '';
    console.log("Pagename: ", pageName)
  }
}
