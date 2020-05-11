import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJornadasPage } from './informacion-jornadas.page';

describe('InformacionJornadasPage', () => {
  let component: InformacionJornadasPage;
  let fixture: ComponentFixture<InformacionJornadasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJornadasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJornadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
