import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisGruposPage } from './mis-grupos.page';

describe('MisGruposPage', () => {
  let component: MisGruposPage;
  let fixture: ComponentFixture<MisGruposPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisGruposPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisGruposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
