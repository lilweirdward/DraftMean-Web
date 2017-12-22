import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftpicksComponent } from './draftpicks.component';

describe('DraftpicksComponent', () => {
  let component: DraftpicksComponent;
  let fixture: ComponentFixture<DraftpicksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftpicksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftpicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
