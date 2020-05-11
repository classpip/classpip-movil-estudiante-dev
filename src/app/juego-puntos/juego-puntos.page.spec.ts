import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoPuntosPage } from './juego-puntos.page';

describe('JuegoPuntosPage', () => {
  let component: JuegoPuntosPage;
  let fixture: ComponentFixture<JuegoPuntosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoPuntosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoPuntosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
