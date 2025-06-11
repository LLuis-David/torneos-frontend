import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidoListComponent } from './partido-list.component';

describe('PartidoListComponent', () => {
  let component: PartidoListComponent;
  let fixture: ComponentFixture<PartidoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartidoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
