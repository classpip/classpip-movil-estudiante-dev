import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeGeocachingPage } from './juego-de-geocaching.page';

describe('JuegoDeGeocachingPage', () => {
  let component: JuegoDeGeocachingPage;
  let fixture: ComponentFixture<JuegoDeGeocachingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeGeocachingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeGeocachingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

