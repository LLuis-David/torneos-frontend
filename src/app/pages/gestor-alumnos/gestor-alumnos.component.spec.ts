import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorAlumnosComponent } from './gestor-alumnos.component';

describe('GestorAlumnosComponent', () => {
  let component: GestorAlumnosComponent;
  let fixture: ComponentFixture<GestorAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestorAlumnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
