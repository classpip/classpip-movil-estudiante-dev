import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CromosAMostrarPage } from './cromos-amostrar.page';

describe('CromosAMostrarPage', () => {
  let component: CromosAMostrarPage;
  let fixture: ComponentFixture<CromosAMostrarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CromosAMostrarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CromosAMostrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
