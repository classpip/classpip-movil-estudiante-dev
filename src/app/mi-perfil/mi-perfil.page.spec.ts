import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPerfilPage } from './mi-perfil.page';

describe('MiPerfilPage', () => {
  let component: MiPerfilPage;
  let fixture: ComponentFixture<MiPerfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiPerfilPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
