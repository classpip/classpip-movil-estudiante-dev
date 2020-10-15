import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisJuegosInactivosPage } from './mis-juegos-inactivos.page';

describe('MisJuegosInactivosPage', () => {
  let component: MisJuegosInactivosPage;
  let fixture: ComponentFixture<MisJuegosInactivosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisJuegosInactivosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisJuegosInactivosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
