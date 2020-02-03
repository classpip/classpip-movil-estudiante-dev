import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegosInactivosPage } from './juegos-inactivos.page';

describe('JuegosInactivosPage', () => {
  let component: JuegosInactivosPage;
  let fixture: ComponentFixture<JuegosInactivosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegosInactivosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegosInactivosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
