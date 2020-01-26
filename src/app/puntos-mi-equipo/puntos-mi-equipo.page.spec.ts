import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosMiEquipoPage } from './puntos-mi-equipo.page';

describe('PuntosMiEquipoPage', () => {
  let component: PuntosMiEquipoPage;
  let fixture: ComponentFixture<PuntosMiEquipoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuntosMiEquipoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntosMiEquipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
