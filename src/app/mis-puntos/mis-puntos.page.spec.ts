import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPuntosPage } from './mis-puntos.page';

describe('MisPuntosPage', () => {
  let component: MisPuntosPage;
  let fixture: ComponentFixture<MisPuntosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisPuntosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPuntosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
