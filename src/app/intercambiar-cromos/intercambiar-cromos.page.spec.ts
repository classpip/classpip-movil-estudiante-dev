import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntercambiarCromosPage } from './intercambiar-cromos.page';

describe('IntercambiarCromosPage', () => {
  let component: IntercambiarCromosPage;
  let fixture: ComponentFixture<IntercambiarCromosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntercambiarCromosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntercambiarCromosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
