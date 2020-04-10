import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisColeccionesPage } from './mis-colecciones.page';

describe('MisColeccionesPage', () => {
  let component: MisColeccionesPage;
  let fixture: ComponentFixture<MisColeccionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisColeccionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisColeccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
