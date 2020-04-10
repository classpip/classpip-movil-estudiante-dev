import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillasPage } from './plantillas.page';

describe('PlantillasPage', () => {
  let component: PlantillasPage;
  let fixture: ComponentFixture<PlantillasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
